const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("wednesday", {
  openJarvis: {
    check: () => ipcRenderer.invoke("openjarvis:check"),
    chat: (messages, context) => ipcRenderer.invoke("openjarvis:chat", { messages, context }),
  },
});
