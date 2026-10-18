export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
              Servidor MCP Ativo
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            mcp-boni Next.js Server
          </h1>
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            Servidor Model Context Protocol (MCP) nativo no Next.js (App Router) com suporte a Streamable HTTP e Serverless.
          </p>
        </header>

        {/* Endpoint Info */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200">Endpoint MCP</h2>
          <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-lg p-3 font-mono text-sm text-emerald-400">
            <span className="text-zinc-500">POST/GET</span>
            <span>/api/mcp</span>
          </div>
          <p className="text-xs text-zinc-400">
            Compatível com clientes MCP padrão (Cursor, Claude Desktop, Antigravity, cline, etc.).
          </p>
        </section>

        {/* Ferramentas Registradas */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Ferramentas Registradas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
              <span className="font-mono text-sm font-semibold text-emerald-400">ping</span>
              <p className="text-xs text-zinc-400">
                Verifica a conectividade e retorna status com timestamp.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
              <span className="font-mono text-sm font-semibold text-emerald-400">echo</span>
              <p className="text-xs text-zinc-400">
                Ecoa o texto recebido de volta para validação de entrada/saída.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
              <span className="font-mono text-sm font-semibold text-emerald-400">server_info</span>
              <p className="text-xs text-zinc-400">
                Retorna versão do Node, plataforma e tempo de atividade.
              </p>
            </div>
          </div>
        </section>

        {/* Configuração de Exemplo */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200">Como Conectar</h2>
          <p className="text-sm text-zinc-400">
            Exemplo de configuração para clientes MCP (ex: <code className="text-zinc-200 bg-zinc-800 px-1 py-0.5 rounded">mcpServers</code>):
          </p>
          <pre className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`{
  "mcpServers": {
    "mcp-boni": {
      "url": "http://localhost:3000/api/mcp"
    }
  }
}`}
          </pre>
        </section>

        {/* Onde editar */}
        <footer className="text-xs text-zinc-500 border-t border-zinc-800 pt-6">
          Para adicionar mais ferramentas, edite <code className="text-zinc-400">src/lib/mcp/tools.ts</code> ou o handler em <code className="text-zinc-400">src/app/api/mcp/route.ts</code>.
        </footer>
      </div>
    </main>
  );
}
