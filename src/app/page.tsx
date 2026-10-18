export default function Home() {
  const toolCategories = [
    {
      category: "Scripts",
      tools: [
        { name: "script_read", desc: "Lê scripts inteiros ou intervalos específicos de linhas via dot-notation." },
        { name: "multi_edit", desc: "Aplica múltiplas edições atômicas ou cria novos scripts." },
        { name: "script_search", desc: "Busca scripts por correspondência difusa no nome." },
        { name: "script_grep", desc: "Busca padrões de texto ou padrões Luau em todo o projeto." },
      ],
    },
    {
      category: "Execução & Dados",
      tools: [
        { name: "execute_luau", desc: "Executa código Luau diretamente no Studio (Edit, Client ou Server)." },
        { name: "search_game_tree", desc: "Explora a árvore de hierarquia do jogo (DataModel)." },
        { name: "inspect_instance", desc: "Inspeciona todas as propriedades e atributos de uma instância." },
        { name: "subagent", desc: "Lança subagentes autônomos para exploração e testes." },
      ],
    },
    {
      category: "Playtest & Sessão",
      tools: [
        { name: "list_roblox_studios", desc: "Lista todas as instâncias do Studio abertas e seus IDs." },
        { name: "get_studio_state", desc: "Retorna o estado do Studio e datamodels disponíveis." },
        { name: "start_stop_play", desc: "Inicia ou para o playtest do jogo." },
        { name: "get_console_output", desc: "Captura o log de saída do console do Studio." },
        { name: "screen_capture", desc: "Captura screenshot da viewport do Studio." },
      ],
    },
    {
      category: "Ativos & Conteúdo (IA)",
      tools: [
        { name: "generate_mesh", desc: "Gera malhas 3D texturizadas a partir de prompts descritivos." },
        { name: "generate_material", desc: "Gera variantes customizadas de materiais (MaterialVariant)." },
        { name: "generate_procedural_model", desc: "Cria modelos procedurais com atributos customizáveis." },
        { name: "generate_texture", desc: "Re-texturiza malhas existentes com IA." },
        { name: "segment_mesh", desc: "Divide uma malha em subpartes nomeadas." },
        { name: "wait_job_finished", desc: "Aguarda conclusão de trabalhos assíncronos." },
        { name: "search_asset", desc: "Pesquisa na Creator Store ou inventário." },
        { name: "insert_asset", desc: "Insere ativos no jogo via assetId numérico." },
        { name: "upload_image", desc: "Faz upload de imagens HTTP para o asset server." },
        { name: "store_image", desc: "Carrega imagem local e retorna URI IMAGEID_." },
      ],
    },
    {
      category: "Simulação de Entrada",
      tools: [
        { name: "character_navigation", desc: "Navega o personagem até coordenadas ou instâncias." },
        { name: "user_keyboard_input", desc: "Envia sequências de teclas durante o playtest." },
        { name: "user_mouse_input", desc: "Envia cliques, movimentos e rolagem de mouse." },
      ],
    },
    {
      category: "Documentação & Habilidades",
      tools: [
        { name: "http_get", desc: "Consulta documentação oficial do Roblox Engine e Cloud API." },
        { name: "skill", desc: "Acessa runbooks de debug, testes unitários e profiling." },
      ],
    },
    {
      category: "Utilitários Base",
      tools: [
        { name: "ping", desc: "Healthcheck e validação de latência do servidor MCP." },
        { name: "echo", desc: "Ecoa texto de teste para validação de entrada/saída." },
        { name: "server_info", desc: "Retorna dados da plataforma e runtime." },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <header className="border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
              Roblox Studio MCP Server Ativo
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            mcp-boni Next.js Server
          </h1>
          <p className="mt-2 text-zinc-400 text-sm md:text-base">
            Servidor MCP completo com ponte oficial para as 28 ferramentas do <strong>Roblox Studio</strong> via Streamable HTTP.
          </p>
        </header>

        {/* Endpoints */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Endpoint Nuvem (Vercel)</span>
            <div className="bg-black border border-zinc-800 rounded-lg p-3 font-mono text-sm text-emerald-400 select-all overflow-x-auto">
              https://mcp-boni-8lfr.vercel.app/api/mcp
            </div>
            <p className="text-xs text-zinc-500">Público, sem autenticação, pronto para clientes remotos.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Endpoint Local (Bridge PC)</span>
            <div className="bg-black border border-zinc-800 rounded-lg p-3 font-mono text-sm text-emerald-400 select-all overflow-x-auto">
              http://localhost:3000/api/mcp
            </div>
            <p className="text-xs text-zinc-500">Conecta em tempo real ao Roblox Studio aberto na máquina local.</p>
          </div>
        </section>

        {/* Ferramentas Registradas */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-2xl font-semibold text-white">31 Ferramentas Disponíveis</h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
              28 Roblox Studio + 3 Base
            </span>
          </div>

          <div className="space-y-6">
            {toolCategories.map((cat) => (
              <div key={cat.category} className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{cat.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cat.tools.map((t) => (
                    <div key={t.name} className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-3.5 space-y-1 hover:border-zinc-700 transition-colors">
                      <div className="font-mono text-sm font-bold text-emerald-400">{t.name}</div>
                      <div className="text-xs text-zinc-400 leading-relaxed">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Configuração */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-200">Como Conectar</h2>
          <pre className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
{`// Configuração para Cursor, Claude Desktop ou Antigravity:
{
  "mcpServers": {
    "mcp-boni": {
      "url": "https://mcp-boni-8lfr.vercel.app/api/mcp"
    }
  }
}`}
          </pre>
        </section>
      </div>
    </main>
  );
}
