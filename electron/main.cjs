const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const OPENJARVIS_BASE = "http://127.0.0.1:8000";

function validMessages(messages) {
  return Array.isArray(messages) && messages.length > 0 && messages.length <= 20 &&
    messages.every((message) =>
      message &&
      ["system", "user", "assistant"].includes(message.role) &&
      typeof message.content === "string" &&
      message.content.length > 0 &&
      message.content.length <= 5000
    );
}

ipcMain.handle("openjarvis:check", async () => {
  try {
    const response = await fetch(`${OPENJARVIS_BASE}/health`, {
      signal: AbortSignal.timeout(2500),
    });
    return { available: response.ok };
  } catch {
    return { available: false };
  }
});

ipcMain.handle("openjarvis:chat", async (_event, payload) => {
  const messages = payload?.messages;
  if (!validMessages(messages)) {
    throw new Error("Invalid local AI request. Please shorten the conversation and try again.");
  }

  const context = typeof payload?.context === "string" ? payload.context.slice(0, 5000) : "";
  const requestMessages = context
    ? [{ role: "system", content: `You are Wednesday, a private personal assistant. Use this user-approved local workspace context when relevant. Do not claim to access files, apps, or accounts unless a tool actually did so.\n\nWorkspace context:\n${context}` }, ...messages]
    : messages;

  try {
    const response = await fetch(`${OPENJARVIS_BASE}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: requestMessages,
        max_tokens: 900,
        stream: false,
      }),
      signal: AbortSignal.timeout(90000),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error("OpenJarvis could not complete the request. Check that its local server and model are running.");
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      throw new Error("OpenJarvis returned an empty response.");
    }
    return { answer: answer.trim(), model: data?.model || "OpenJarvis local model" };
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("The local model took too long to respond. Try a smaller model or ask a shorter question.");
    }
    throw error instanceof Error ? error : new Error("Could not reach OpenJarvis on this computer.");
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 640,
    title: "Wednesday",
    icon: path.join(__dirname, "../assets/wednesday.ico"),
    backgroundColor: "#090b14",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    }
  });
  win.loadFile(path.join(__dirname, "../dist/index.html"));
}
app.whenReady().then(() => { createWindow(); app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); }); });
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
