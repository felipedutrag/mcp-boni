import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import type { CallToolResult } from "@modelcontextprotocol/server";

export type McpToolResponse = CallToolResult;

/**
 * Envia uma chamada de ferramenta diretamente ao StudioMCP local via mcp.bat
 */
export async function callRobloxStudioMcp(
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<CallToolResult> {
  // Verifica se o caminho do Roblox existe localmente
  const localAppData = process.env.LOCALAPPDATA || "C:\\Users\\felip\\AppData\\Local";
  const batPath = path.join(localAppData, "Roblox", "mcp.bat");

  if (!fs.existsSync(batPath)) {
    return {
      content: [
        {
          type: "text",
          text: `[Roblox Studio MCP Bridge] O arquivo mcp.bat não foi encontrado no host atual (${batPath}).
Caso o servidor esteja rodando na Vercel (nuvem), ferramentas do Roblox Studio requerem execução local ou um túnel.
Para executar ações no seu Roblox Studio local:
1. Rode o servidor localmente com 'npm run dev' na sua máquina (http://localhost:3000/api/mcp), OU
2. Conecte o seu cliente MCP diretamente ao comando local:
   command: "cmd.exe", args: ["/c", "cd /d %LOCALAPPDATA%\\\\Roblox && .\\\\mcp.bat"]`,
        },
      ],
      isError: true,
    };
  }

  // Se studio_id não foi passado e a ferramenta precisa dele, tenta auto-descobrir
  const effectiveArgs = { ...args };
  if (!effectiveArgs.studio_id && toolName !== "list_roblox_studios") {
    try {
      const listResult = await rawCallRobloxMcp(batPath, "list_roblox_studios", {});
      const firstItem = listResult.content?.[0];
      if (firstItem && "text" in firstItem && typeof firstItem.text === "string") {
        const parsed = JSON.parse(firstItem.text);
        if (parsed.studios && parsed.studios.length > 0) {
          effectiveArgs.studio_id = parsed.studios[0].id;
        }
      }
    } catch {
      // Ignora erro de auto-descoberta
    }
  }

  return rawCallRobloxMcp(batPath, toolName, effectiveArgs);
}

function rawCallRobloxMcp(
  batPath: string,
  toolName: string,
  args: Record<string, unknown>
): Promise<CallToolResult> {
  return new Promise((resolve) => {
    let isDone = false;
    let buffer = "";

    const p = spawn("cmd.exe", ["/c", batPath], {
      env: process.env,
      windowsHide: true,
    });

    p.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
          const msg = JSON.parse(line);
          if (msg.id === 1) {
            p.stdin.write(
              JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n"
            );
            p.stdin.write(
              JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                method: "tools/call",
                params: { name: toolName, arguments: args },
              }) + "\n"
            );
          } else if (msg.id === 2) {
            isDone = true;
            p.kill();

            if (msg.result && Array.isArray(msg.result.content)) {
              resolve({
                content: msg.result.content,
                isError: Boolean(msg.result.isError),
              });
            } else if (msg.error) {
              resolve({
                content: [
                  {
                    type: "text",
                    text: msg.error.message || JSON.stringify(msg.error),
                  },
                ],
                isError: true,
              });
            } else {
              resolve({
                content: [{ type: "text", text: JSON.stringify(msg) }],
              });
            }
          }
        } catch {
          // ignora linhas não-json
        }
      }
    });

    p.on("error", (err) => {
      if (!isDone) {
        isDone = true;
        resolve({
          content: [{ type: "text", text: `Falha ao executar Roblox MCP: ${err.message}` }],
          isError: true,
        });
      }
    });

    const timeout = setTimeout(() => {
      if (!isDone) {
        isDone = true;
        p.kill();
        resolve({
          content: [
            {
              type: "text",
              text: `Timeout aguardando resposta do Roblox Studio para a ferramenta '${toolName}'.`,
            },
          ],
          isError: true,
        });
      }
    }, 15000);

    p.stdin.write(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "mcp-boni", version: "1.0.0" },
        },
      }) + "\n"
    );

    p.on("close", () => {
      clearTimeout(timeout);
    });
  });
}
