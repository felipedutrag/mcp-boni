import { createMcpHandler } from "mcp-handler";
import { registerMcpTools } from "@/lib/mcp/tools";


const handler = createMcpHandler(
  (server) => {
    registerMcpTools(server);
  },
  {
    serverInfo: {
      name: "mcp-boni",
      version: "1.0.0",
    },
    verboseLogs: process.env.NODE_ENV === "development",
  }
);

export { handler as GET, handler as POST, handler as OPTIONS, handler as DELETE };
