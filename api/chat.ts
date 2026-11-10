type ChatMessage = { role: "user" | "assistant"; content: string };

function send(res: any, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json").json(body);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !openAiKey) {
    return send(res, 503, { error: "Wednesday's secure backend is not configured yet." });
  }

  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token.length > 8192) {
    return send(res, 401, { error: "Sign in to Wednesday to use its AI assistant." });
  }

  try {
    // Validate the session with Supabase Auth. Never trust a user ID supplied by the browser.
    const identity = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
    });
    if (!identity.ok) return send(res, 401, { error: "Your session is invalid or expired. Please sign in again." });

    const body = req.body || {};
    const raw = Array.isArray(body.messages) ? body.messages : [];
    if (raw.length < 1 || raw.length > 20) return send(res, 400, { error: "Send between 1 and 20 recent messages." });

    const messages: ChatMessage[] = [];
    for (const item of raw) {
      if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
        return send(res, 400, { error: "Invalid chat message." });
      }
      const content = item.content.trim();
      if (!content || content.length > 4000) return send(res, 400, { error: "Each message must be 1–4000 characters." });
      messages.push({ role: item.role, content });
    }

    const context = typeof body.context === "string" ? body.context.slice(0, 5000) : "";
    const model = process.env.OPENAI_MODEL || "gpt-5.5";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openAiKey}` },
      body: JSON.stringify({
        model,
        store: false,
        max_output_tokens: 900,
        instructions: [
          "You are Wednesday, a helpful personal assistant for the account owner.",
          "Be clear, practical, and privacy-conscious. Never claim to have accessed an account or device unless a connected tool actually did so.",
          "Treat finance features as educational/manual tracking only. Never request passwords, one-time codes, UPI PINs, card details, or broker credentials.",
          context ? `User-approved workspace context (may be incomplete):\n${context}` : "",
        ].filter(Boolean).join("\n\n"),
        input: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI Responses API error", response.status, data?.error?.code || "unknown");
      return send(res, 502, { error: "The AI service could not complete that request. Please try again." });
    }

    const answer = (data.output || [])
      .filter((item: any) => item.type === "message")
      .flatMap((item: any) => item.content || [])
      .filter((item: any) => item.type === "output_text")
      .map((item: any) => item.text)
      .join("\n")
      .trim();

    if (!answer) return send(res, 502, { error: "Wednesday received an empty response. Please try again." });
    return send(res, 200, { answer, model });
  } catch (error) {
    console.error("Wednesday chat backend error", error instanceof Error ? error.message : "unknown");
    return send(res, 500, { error: "Wednesday encountered a server error." });
  }
}
