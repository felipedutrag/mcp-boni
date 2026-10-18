import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

/**
 * Registra ferramentas disponíveis no servidor MCP.
 * Novas ferramentas podem ser adicionadas facilmente aqui.
 */
export function registerMcpTools(server: McpServer) {
  // Ferramenta de Ping / Healthcheck
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

  // Ferramenta de Eco
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

  // Ferramenta de Informações do Servidor
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
}
