import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { callRobloxStudioMcp } from "./robloxBridge";

/**
 * Registra todas as ferramentas do Roblox Studio MCP (28 ferramentas oficiais)
 */
export function registerRobloxStudioTools(server: McpServer) {
  // ==========================================
  // 1. GERENCIAMENTO DE SESSÃO
  // ==========================================
  server.registerTool(
    "list_roblox_studios",
    {
      description:
        "Lista todas as instâncias do Roblox Studio conectadas, incluindo nome, ID da instância e ID do lugar.",
      inputSchema: z.object({}),
    },
    async (args) => callRobloxStudioMcp("list_roblox_studios", args)
  );

  // ==========================================
  // 2. SCRIPTS
  // ==========================================
  server.registerTool(
    "script_read",
    {
      description:
        "Lê um script do Roblox usando notação de ponto (ex: game.ServerScriptService.MyScript). Suporta leitura inteira ou intervalos de linhas.",
      inputSchema: z.object({
        target_file: z.string().describe("Caminho do script em notação de ponto (ex: game.ServerScriptService.MyScript)"),
        studio_id: z.string().optional().describe("ID da instância do Studio (auto-detectado se omitido)"),
        should_read_entire_file: z.boolean().optional().default(true).describe("Se deve ler o script inteiro"),
        start_line_one_indexed: z.number().optional().describe("Linha inicial (1-indexed)"),
        end_line_one_indexed_inclusive: z.number().optional().describe("Linha final (1-indexed)"),
      }),
    },
    async (args) => callRobloxStudioMcp("script_read", args)
  );

  server.registerTool(
    "multi_edit",
    {
      description:
        "Aplica múltiplas edições a um script em uma única operação atômica. Cria o script se não existir (requer className).",
      inputSchema: z.object({
        file_path: z.string().describe("Caminho do script (ex: game.ServerScriptService.MyScript)"),
        edits: z
          .array(
            z.object({
              old_string: z.string().describe("Texto a ser substituído (use '' para conteúdo inicial de novo script)"),
              new_string: z.string().describe("Novo texto substituto"),
              replace_all: z.boolean().optional().describe("Substituir todas as ocorrências"),
            })
          )
          .describe("Lista de operações de edição em ordem sequencial"),
        datamodel_type: z.enum(["Edit"]).default("Edit").describe("Tipo de datamodel (Edit)"),
        className: z.string().optional().describe("Classe do script se for novo (Script, LocalScript, ModuleScript)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("multi_edit", args)
  );

  server.registerTool(
    "script_search",
    {
      description: "Busca scripts pelo nome usando correspondência difusa (fuzzy search). Retorna até 10 resultados.",
      inputSchema: z.object({
        keywords: z.string().describe("Palavras-chave separadas por vírgula"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("script_search", args)
  );

  server.registerTool(
    "script_grep",
    {
      description: "Procura um padrão de string ou padrão Luau em todos os scripts do jogo. Retorna até 50 ocorrências.",
      inputSchema: z.object({
        query: z.string().describe("String ou padrão Luau para buscar"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("script_grep", args)
  );

  // ==========================================
  // 3. EXECUÇÃO DE LUAU
  // ==========================================
  server.registerTool(
    "execute_luau",
    {
      description:
        "Executa código Luau no Roblox Studio. Retorna o resultado da execução ou mensagem de erro.",
      inputSchema: z.object({
        code: z.string().describe("Código Luau a ser executado"),
        datamodel_type: z
          .enum(["Edit", "Client", "Server"])
          .default("Edit")
          .describe("Contexto de execução (Edit, Client ou Server)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("execute_luau", args)
  );

  // ==========================================
  // 4. EXPLORAÇÃO DO MODELO DE DADOS
  // ==========================================
  server.registerTool(
    "search_game_tree",
    {
      description:
        "Explora a árvore de hierarquia do jogo Roblox (DataModel) retornando array JSON plano de instâncias.",
      inputSchema: z.object({
        datamodel_type: z.enum(["Edit", "Client", "Server"]).default("Edit").describe("Contexto do DataModel"),
        path: z.string().optional().describe("Caminho inicial (ex: 'Workspace', 'ServerScriptService')"),
        max_depth: z.number().optional().default(3).describe("Profundidade máxima de travessia (1-10)"),
        head_limit: z.number().optional().default(200).describe("Limite máximo de nós retornados"),
        instance_type: z.string().optional().describe("Filtrar por ClassName (ex: BasePart, BaseScript, Model)"),
        keywords: z.string().optional().describe("Filtrar por palavras-chave no nome da instância"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("search_game_tree", args)
  );

  server.registerTool(
    "inspect_instance",
    {
      description:
        "Inspeciona uma instância específica para obter todas as suas propriedades, atributos e resumo de filhos.",
      inputSchema: z.object({
        path: z.string().describe("Caminho completo da instância (ex: 'Workspace.Part')"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("inspect_instance", args)
  );

  server.registerTool(
    "subagent",
    {
      description:
        "Lança um subagente autônomo para tarefas complexas de múltiplas etapas (ex: explore, screen_capture, unit_test).",
      inputSchema: z.object({
        task: z.string().describe("Descrição detalhada da tarefa e instruções para o subagente"),
        description: z.string().describe("Resumo curto da tarefa (3-5 palavras)"),
        subagent_type: z.string().describe("Tipo de subagente (explore, screen_capture, unit_test)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("subagent", args)
  );

  // ==========================================
  // 5. TESTES DE JOGO (PLAYTEST)
  // ==========================================
  server.registerTool(
    "get_studio_state",
    {
      description: "Obtém o estado atual do Studio, incluindo status de playtest e datamodels disponíveis.",
      inputSchema: z.object({
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("get_studio_state", args)
  );

  server.registerTool(
    "start_stop_play",
    {
      description: "Inicia ou interrompe o playtest no Roblox Studio.",
      inputSchema: z.object({
        is_start: z.boolean().describe("true para iniciar o playtest, false para parar e voltar ao modo Edit"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("start_stop_play", args)
  );

  server.registerTool(
    "get_console_output",
    {
      description: "Recupera a saída do console/log de output do Roblox Studio.",
      inputSchema: z.object({
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("get_console_output", args)
  );

  server.registerTool(
    "screen_capture",
    {
      description: "Captura a tela atual da viewport do Roblox Studio e retorna a imagem.",
      inputSchema: z.object({
        capture_id: z.string().default("ScreenCapture_1").describe("Identificador da captura"),
        camera_position: z.array(z.number()).optional().describe("Posição customizada da câmera [x, y, z]"),
        look_at_position: z.array(z.number()).optional().describe("Ponto de foco da câmera [x, y, z]"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("screen_capture", args)
  );

  // ==========================================
  // 6. GERAÇÃO DE ATIVOS E CONTEÚDO (IA)
  // ==========================================
  server.registerTool(
    "generate_mesh",
    {
      description: "Gera uma malha 3D texturizada a partir de um prompt descritivo usando IA.",
      inputSchema: z.object({
        textPrompt: z.string().describe("Prompt de texto descrevendo a malha a gerar"),
        maxTriangles: z.number().optional().describe("Número máximo de triângulos (12 a 20000)"),
        partNames: z.string().optional().describe("Nomes das partes (ex: 'body, wheel')"),
        segmentation: z.enum(["auto", "none", "explicit"]).optional().describe("Modo de segmentação"),
        size: z.object({ x: z.number(), y: z.number(), z: z.number() }).optional().describe("Dimensões do bounding box"),
        async: z.boolean().optional().describe("Executar assincronamente retornando jobId"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("generate_mesh", args)
  );

  server.registerTool(
    "generate_material",
    {
      description: "Gera uma variante de material personalizada (MaterialVariant) e retorna o material base e nome.",
      inputSchema: z.object({
        baseMaterial: z.string().describe("Material base do Roblox (Plastic, Wood, Marble, etc.)"),
        materialDescription: z.string().describe("Descrição do visual do material"),
        materialId: z.string().describe("Identificador único para o material"),
        materialPattern: z.string().describe("Padrão ou estilo visual"),
        async: z.boolean().optional().describe("Executar de forma assíncrona"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("generate_material", args)
  );

  server.registerTool(
    "generate_procedural_model",
    {
      description:
        "Cria objetos 3D construídos a partir de primitivas (blocos, esferas, cilindros, cunhas) com atributos customizáveis.",
      inputSchema: z.object({
        prompt: z.string().describe("Descrição do objeto a criar e atributos desejados"),
        partNames: z.string().optional().describe("Nomes das partes estruturais"),
        segmentation: z.enum(["auto", "none", "explicit"]).optional().describe("Modo de segmentação"),
        attachedImageUri: z.string().optional().describe("URI de imagem de referência local (IMAGEID_...)"),
        async: z.boolean().optional().describe("Executar de forma assíncrona"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("generate_procedural_model", args)
  );

  server.registerTool(
    "generate_texture",
    {
      description: "Re-texturiza uma malha existente usando IA com base em prompt de texto descritivo.",
      inputSchema: z.object({
        textPrompt: z.string().describe("Descrição da textura/aparência (ex: 'metal enferrujado')"),
        instance_path: z.string().optional().describe("Caminho do MeshPart ou Model"),
        model: z.enum(["Fast", "Quality"]).optional().describe("Modo de geração Fast ou Quality"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("generate_texture", args)
  );

  server.registerTool(
    "segment_mesh",
    {
      description: "Segmenta uma malha existente em subpartes nomeadas usando IA.",
      inputSchema: z.object({
        parts: z.array(z.string()).describe("Lista de partes para segmentação (até 5)"),
        instance_path: z.string().optional().describe("Caminho da malha"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("segment_mesh", args)
  );

  server.registerTool(
    "wait_job_finished",
    {
      description: "Aguarda a conclusão de um trabalho assíncrono de IA (generate_mesh, generate_procedural_model, etc.).",
      inputSchema: z.object({
        jobId: z.string().describe("ID do trabalho retornado pela ferramenta assíncrona"),
        timeout: z.number().optional().default(600).describe("Tempo máximo de espera em segundos"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("wait_job_finished", args)
  );

  server.registerTool(
    "search_asset",
    {
      description: "Pesquisa ativos na Creator Store pública ou no inventário do criador.",
      inputSchema: z.object({
        query: z.string().optional().describe("Termo de busca"),
        assetType: z.string().optional().describe("Tipo de ativo (Model, Audio, Decal, etc.)"),
        scope: z.string().optional().describe("Escopo de busca"),
        maxResults: z.number().optional().default(20).describe("Máximo de resultados"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("search_asset", args)
  );

  server.registerTool(
    "insert_asset",
    {
      description: "Insere um ativo no jogo usando seu ID numérico do Roblox.",
      inputSchema: z.object({
        assetId: z.union([z.number(), z.string()]).describe("ID numérico do ativo no Roblox"),
        assetName: z.string().optional().describe("Nome opcional da instância inserida"),
        assetType: z.string().optional().describe("Tipo de ativo"),
        parentPath: z.string().optional().describe("Caminho do pai onde inserir (padrão: Workspace)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("insert_asset", args)
  );

  server.registerTool(
    "upload_image",
    {
      description: "Faz upload de imagens de URLs HTTP para o servidor de ativos do Roblox.",
      inputSchema: z.object({
        imagePaths: z.array(z.string()).describe("Array de URLs de imagens a serem enviadas"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("upload_image", args)
  );

  server.registerTool(
    "store_image",
    {
      description: "Carrega uma imagem de um caminho local e retorna um URI IMAGEID_<id> para uso em outras ferramentas.",
      inputSchema: z.object({
        filePath: z.string().describe("Caminho absoluto para arquivo de imagem local (.png, .jpg)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("store_image", args)
  );

  // ==========================================
  // 7. SIMULAÇÃO DE ENTRADA DO JOGADOR
  // ==========================================
  server.registerTool(
    "character_navigation",
    {
      description: "Move o personagem do jogador para uma posição ou caminho de instância.",
      inputSchema: z.object({
        datamodel_type: z.enum(["Client"]).default("Client").describe("Datamodel (Client)"),
        instance_path: z.string().optional().describe("Caminho da instância de destino"),
        x: z.number().optional().describe("Coordenada X"),
        y: z.number().optional().describe("Coordenada Y"),
        z: z.number().optional().describe("Coordenada Z"),
        speed_multiplier: z.number().optional().default(1.0).describe("Multiplicador de velocidade (0.1 a 10.0)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("character_navigation", args)
  );

  server.registerTool(
    "user_keyboard_input",
    {
      description: "Envia sequência ordenada de ações de teclado para o jogo durante playtest.",
      inputSchema: z.object({
        actions: z
          .array(
            z.object({
              action: z.enum(["keyDown", "keyUp", "keyPress", "textInput", "wait"]),
              key_code: z.string().optional(),
              text_inputs: z.string().optional(),
              wait_time_ms: z.number().optional(),
              instance_path: z.string().optional(),
            })
          )
          .describe("Lista de ações de teclado"),
        datamodel_type: z.enum(["Client"]).default("Client").describe("Datamodel (Client)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("user_keyboard_input", args)
  );

  server.registerTool(
    "user_mouse_input",
    {
      description: "Envia sequência de ações de mouse (mover, clicar, rolar, aguardar) para o jogo.",
      inputSchema: z.object({
        actions: z
          .array(
            z.object({
              action: z.enum(["moveTo", "mouseButtonDown", "mouseButtonUp", "mouseButtonClick", "scrollUp", "scrollDown", "wait"]),
              x: z.number().optional(),
              y: z.number().optional(),
              mouse_button: z.enum(["left", "right"]).optional(),
              instance_path: z.string().optional(),
              wait_time_ms: z.number().optional(),
            })
          )
          .describe("Lista de ações do mouse"),
        datamodel_type: z.enum(["Client"]).default("Client").describe("Datamodel (Client)"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("user_mouse_input", args)
  );

  // ==========================================
  // 8. DOCUMENTAÇÃO E HABILIDADES
  // ==========================================
  server.registerTool(
    "http_get",
    {
      description: "Busca conteúdo da documentação oficial do Roblox (API Engine, Creator Docs, Cloud API).",
      inputSchema: z.object({
        url: z.string().describe("URL oficial da documentação do Roblox (.md ou llms.txt)"),
        query: z.string().optional().describe("Palavra-chave para busca dentro do conteúdo"),
        context_lines: z.number().optional().default(3).describe("Linhas de contexto em volta do resultado"),
        return_full: z.boolean().optional().default(false).describe("Retornar o documento completo"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("http_get", args)
  );

  server.registerTool(
    "skill",
    {
      description:
        "Recupera guias de melhores práticas para habilidades específicas do Roblox (rbx-debug, rbx-unit-test, rbx-perf-profiling, etc.).",
      inputSchema: z.object({
        skill_name: z
          .enum([
            "rbx-create-skill",
            "rbx-debug",
            "rbx-device-simulator-lua",
            "rbx-docs-search",
            "rbx-perf-profiling",
            "rbx-scene-analysis",
            "rbx-unit-test",
          ])
          .describe("Nome da habilidade a recuperar"),
        studio_id: z.string().optional().describe("ID da instância do Studio"),
      }),
    },
    async (args) => callRobloxStudioMcp("skill", args)
  );
}
