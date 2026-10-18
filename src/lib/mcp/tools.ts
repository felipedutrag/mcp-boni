import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { registerRobloxStudioTools } from "./robloxTools";

/**
 * Registra todas as ferramentas disponíveis no servidor MCP
 */
export function registerMcpTools(server: McpServer) {
  // Ferramentas Utilitárias Básicas
  server.registerTool(
    "ping",
    {
      description: "Verifica a saúde e conectividade do servidor MCP",
      inputSchema: z.object({
        message: z.string().optional().describe("Mensagem opcional para ecoar"),
      }),
    },
    async ({ message }) => {
      const timestamp = new Date().toISOString();
      return {
        content: [
          {
            type: "text",
            text: `pong: ${message || "servidor MCP ativo"} (timestamp: ${timestamp})`,
          },
        ],
      };
    }
  );

  server.registerTool(
    "echo",
    {
      description: "Retorna o texto enviado como entrada",
      inputSchema: z.object({
        text: z.string().describe("Texto a ser retornado"),
      }),
    },
    async ({ text }) => {
      return {
        content: [
          {
            type: "text",
            text: `Echo: ${text}`,
          },
        ],
      };
    }
  );

  server.registerTool(
    "server_info",
    {
      description: "Obtém informações sobre a plataforma e runtime do servidor",
      inputSchema: z.object({}),
    },
    async () => {
      const info = {
        name: "mcp-boni",
        version: "1.0.0",
        nodeVersion: process.version,
        platform: process.platform,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(info, null, 2),
          },
        ],
      };
    }
  );

  // Registra as 28 ferramentas oficiais do Roblox Studio
  registerRobloxStudioTools(server);
}
