/// <reference types="vite/client" />

type OpenJarvisBridge = {
  check: () => Promise<{ available: boolean }>;
  chat: (
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    context?: string
  ) => Promise<{ answer: string; model: string }>;
};

interface Window {
  wednesday?: {
    openJarvis?: OpenJarvisBridge;
  };
}
