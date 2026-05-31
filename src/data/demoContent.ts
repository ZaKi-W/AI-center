export type AppStage =
  | 'intro'
  | 'chatbot'
  | 'transition'
  | 'agent-select'
  | 'model-select'
  | 'agent-workbench'
  | 'token-restore'
  | 'summary';
export type ChatStepKind = 'qa' | 'image' | 'thinking' | 'boundary' | 'hook';
export type FileTaskStepKind = 'scan' | 'read' | 'classify' | 'create' | 'rename' | 'move' | 'complete';

export type ChatbotProduct = {
  id: string;
  name: string;
  positioning: string;
  accent: string;
  logoKind: 'text';
};

export type ChatScriptStep = {
  id: string;
  kind: ChatStepKind;
  prompt: string;
  reply: string;
  caption: string;
  thinkingStates?: string[];
  imageTitle?: string;
};

export type AgentOption = {
  id: string;
  name: string;
  tags: string[];
  themeColor: string;
  description: string;
  shortIntro: string;
  popularity: number;
  popularityLabel: string;
  badge: string;
  logoMark: string;
  logoShape: 'circle' | 'diamond' | 'hex' | 'bracket' | 'orbit';
  logVoice: string;
};

export type ModelOption = {
  id: string;
  name: string;
  provider: string;
  region: '国内' | '国外';
  logoMark: string;
  rank: number;
  rankNote: string;
  positioning: string;
  strengths: string[];
  bars: {
    reasoning: number;
    coding: number;
    multimodal: number;
    speed: number;
  };
};

export type FileTaskStep = {
  id: string;
  kind: FileTaskStepKind;
  title: string;
  log: string;
  terminal: string;
  progress: number;
};

export type TokenDemo = {
  title: string;
  subtitle: string;
  pausedMessage: string;
  restoreButton: string;
  exhaustedTokens: number;
  restoredTokens: number;
  facts: string[];
};

export type SkillOption = {
  id: string;
  name: string;
};

export type SkillResult = {
  title: string;
  content: string;
  tags: string[];
};

export type SkillDemo = {
  title: string;
  prompt: string;
  selectedSkillId: string;
  skills: SkillOption[];
  plainResult: SkillResult;
  skilledResult: SkillResult;
  explanation: string;
};

export type MCPTool = {
  id: string;
  name: string;
};

export type MCPDemo = {
  title: string;
  task: string;
  failureLog: string;
  explanation: string;
  successLog: string;
  connectButton: string;
  tools: MCPTool[];
};

export type SummaryItem = {
  term: string;
  description: string;
};

export const appStages: AppStage[] = [
  'intro',
  'chatbot',
  'transition',
  'agent-select',
  'model-select',
  'agent-workbench',
  'token-restore',
  'summary',
];
export const defaultAgentId = 'codex';
export const defaultModelId = 'gpt-52';

export const bannedPlatformTerms = [
  '充值',
  '购买',
  '付费',
  '支付',
  '订阅',
  '会员',
  '价格',
  '下单',
  '去官网',
  '购买额度',
];

export const chatbotProducts: ChatbotProduct[] = [
  { id: 'doubao', name: '豆包', positioning: '日常问答 / 图文理解', accent: '#67d8b5', logoKind: 'text' },
  { id: 'deepseek', name: 'DeepSeek', positioning: '推理问答 / 代码辅助', accent: '#7aa7ff', logoKind: 'text' },
  { id: 'chatgpt', name: 'ChatGPT', positioning: '通用对话 / 多模态助手', accent: '#f3c56b', logoKind: 'text' },
];

export const agentOptions: AgentOption[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    tags: ['项目理解', '长上下文', '代码执行'],
    themeColor: '#d5a46f',
    description: '适合把项目结构、需求和代码任务串起来分析。',
    shortIntro: '偏代码项目助手，擅长读项目、改代码、解释工程问题。',
    popularity: 92,
    popularityLabel: '热门',
    badge: 'CC',
    logoMark: 'C',
    logoShape: 'bracket',
    logVoice: '我会先读懂项目，再拆成可执行步骤。',
  },
  {
    id: 'codex',
    name: 'Codex',
    tags: ['代码任务', '工程执行', '自动修复'],
    themeColor: '#7cc7ff',
    description: '适合把明确任务推进成文件、命令和检查结果。',
    shortIntro: '偏工程执行助手，擅长把需求落到文件修改和命令验证。',
    popularity: 96,
    popularityLabel: '很热门',
    badge: 'CX',
    logoMark: '⌘',
    logoShape: 'orbit',
    logVoice: '我会按任务清单执行，并把每一步结果记录下来。',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tags: ['工具操作', '抓取执行', '自动化'],
    themeColor: '#8fdbb7',
    description: '适合跨窗口、跨工具完成结构化操作。',
    shortIntro: '偏自动化助手，适合连接工具、处理重复操作和资料抓取。',
    popularity: 68,
    popularityLabel: '小众上升',
    badge: 'OC',
    logoMark: 'O',
    logoShape: 'hex',
    logVoice: '我会连接可用工具，把重复动作自动化。',
  },
  {
    id: 'hermes-agent',
    name: 'HermesAgent',
    tags: ['流程执行', '多步骤任务', '助手形态'],
    themeColor: '#b6a7ff',
    description: '适合把一个目标拆成连续流程并持续推进。',
    shortIntro: '偏流程型助手，适合把一个大目标拆成连续任务推进。',
    popularity: 62,
    popularityLabel: '探索中',
    badge: 'HA',
    logoMark: 'H',
    logoShape: 'diamond',
    logVoice: '我会保持任务上下文，逐步推进流程。',
  },
  {
    id: 'trae-solo',
    name: 'Trae Solo',
    tags: ['开发协作', '项目任务', 'IDE 助手'],
    themeColor: '#f0c66a',
    description: '适合贴近开发环境完成项目协作任务。',
    shortIntro: '偏 IDE 协作助手，适合在开发环境里边看边改项目。',
    popularity: 84,
    popularityLabel: '热门上升',
    badge: 'TS',
    logoMark: 'T',
    logoShape: 'circle',
    logVoice: '我会围绕项目任务给出可见的执行反馈。',
  },
];

export const modelOptions: ModelOption[] = [
  {
    id: 'gpt-52',
    name: 'GPT-5.2',
    provider: 'OpenAI',
    region: '国外',
    logoMark: '◎',
    rank: 1,
    rankNote: '综合旗舰参考',
    positioning: '综合能力强，适合复杂推理和通用任务演示。',
    strengths: ['复杂推理', '通用生成', '多步骤规划'],
    bars: { reasoning: 96, coding: 92, multimodal: 90, speed: 82 },
  },
  {
    id: 'opus-45',
    name: 'Claude Opus 4.5',
    provider: 'Anthropic',
    region: '国外',
    logoMark: 'A',
    rank: 2,
    rankNote: '长上下文旗舰参考',
    positioning: '长文档理解强，适合项目分析和写作演示。',
    strengths: ['长上下文', '写作润色', '需求理解'],
    bars: { reasoning: 93, coding: 86, multimodal: 78, speed: 76 },
  },
  {
    id: 'gemini-31-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    region: '国外',
    logoMark: 'G',
    rank: 3,
    rankNote: '多模态旗舰参考',
    positioning: '多模态和资料理解突出，适合跨内容任务演示。',
    strengths: ['多模态', '资料整理', '跨内容理解'],
    bars: { reasoning: 90, coding: 84, multimodal: 96, speed: 80 },
  },
  {
    id: 'grok-43',
    name: 'Grok 4.3',
    provider: 'xAI',
    region: '国外',
    logoMark: 'x',
    rank: 4,
    rankNote: '实时与推理参考',
    positioning: '适合信息密集、推理和快速资料问答演示。',
    strengths: ['实时信息', '推理问答', '快速生成'],
    bars: { reasoning: 91, coding: 84, multimodal: 82, speed: 88 },
  },
  {
    id: 'llama-4',
    name: 'Llama 4',
    provider: 'Meta',
    region: '国外',
    logoMark: '∞',
    rank: 5,
    rankNote: '开源生态参考',
    positioning: '开源生态影响力强，适合解释模型部署和生态差异。',
    strengths: ['开源生态', '部署灵活', '通用生成'],
    bars: { reasoning: 86, coding: 82, multimodal: 76, speed: 86 },
  },
  {
    id: 'mistral-large-3',
    name: 'Mistral Large 3',
    provider: 'Mistral AI',
    region: '国外',
    logoMark: 'M',
    rank: 6,
    rankNote: '欧洲旗舰参考',
    positioning: '适合展示企业级、低延迟和欧洲模型生态。',
    strengths: ['企业场景', '低延迟', '多语种'],
    bars: { reasoning: 85, coding: 83, multimodal: 74, speed: 90 },
  },
  {
    id: 'deepseek-v32',
    name: 'DeepSeek V3.2',
    provider: 'DeepSeek',
    region: '国内',
    logoMark: 'D',
    rank: 7,
    rankNote: '推理与代码演示参考',
    positioning: '代码和推理表现突出，适合工程任务演示。',
    strengths: ['代码理解', '推理拆解', '终端任务'],
    bars: { reasoning: 94, coding: 95, multimodal: 72, speed: 84 },
  },
  {
    id: 'qwen-35-max',
    name: 'Qwen3.5 Max',
    provider: 'Alibaba',
    region: '国内',
    logoMark: 'Q',
    rank: 8,
    rankNote: '中文与开源生态参考',
    positioning: '中文能力和工具生态完整，适合本土业务工作流演示。',
    strengths: ['中文业务', '工具调用', '开源生态'],
    bars: { reasoning: 90, coding: 88, multimodal: 82, speed: 86 },
  },
  {
    id: 'kimi-k26',
    name: 'Kimi K2.6',
    provider: 'Moonshot AI',
    region: '国内',
    logoMark: 'K',
    rank: 9,
    rankNote: '长文本与资料处理参考',
    positioning: '适合长资料阅读、报告总结和复杂材料整理。',
    strengths: ['长文本', '资料总结', '中文写作'],
    bars: { reasoning: 88, coding: 82, multimodal: 78, speed: 84 },
  },
  {
    id: 'glm-51',
    name: 'GLM-5.1',
    provider: 'Zhipu AI',
    region: '国内',
    logoMark: '智',
    rank: 10,
    rankNote: '中文与综合演示参考',
    positioning: '中文场景友好，适合本土化工作流演示。',
    strengths: ['中文表达', '结构总结', '任务规划'],
    bars: { reasoning: 88, coding: 82, multimodal: 78, speed: 88 },
  },
  {
    id: 'ernie-51',
    name: 'ERNIE 5.1',
    provider: 'Baidu',
    region: '国内',
    logoMark: '文',
    rank: 11,
    rankNote: '搜索与知识增强参考',
    positioning: '适合知识问答、资料检索和中文内容生产演示。',
    strengths: ['知识问答', '检索增强', '中文内容'],
    bars: { reasoning: 86, coding: 78, multimodal: 80, speed: 86 },
  },
  {
    id: 'seed-18',
    name: 'Seed 1.8',
    provider: 'ByteDance',
    region: '国内',
    logoMark: '豆',
    rank: 12,
    rankNote: '产品生态参考',
    positioning: '适合展示面向应用生态的多场景通用模型。',
    strengths: ['应用生态', '多场景', '中文交互'],
    bars: { reasoning: 84, coding: 78, multimodal: 84, speed: 88 },
  },
];

export const fileTaskSteps: FileTaskStep[] = [
  {
    id: 'scan-folder',
    kind: 'scan',
    title: '扫描桌面文件夹',
    log: '发现 3 个报名表和 1 个未分类目录。',
    terminal: '$ scan ~/Desktop/报名表 --type xlsx',
    progress: 14,
  },
  {
    id: 'read-names',
    kind: 'read',
    title: '读取文件名与表头',
    log: '读取姓名、班级、报名项目字段。',
    terminal: '$ inspect 报名表_1.xlsx 报名表_2.xlsx 报名表_3.xlsx',
    progress: 28,
  },
  {
    id: 'classify-class',
    kind: 'classify',
    title: '识别班级字段',
    log: '识别到一班、二班、三班三组分类。',
    terminal: '$ classify --field 班级 --strategy stable',
    progress: 43,
  },
  {
    id: 'create-folders',
    kind: 'create',
    title: '创建分类文件夹',
    log: '创建 一班、二班、三班 文件夹。',
    terminal: '$ mkdir 一班 二班 三班',
    progress: 58,
  },
  {
    id: 'rename-files',
    kind: 'rename',
    title: '批量重命名文件',
    log: '文件名已改为 班级_姓名_报名表 格式。',
    terminal: '$ rename --pattern "{class}_{name}_报名表.xlsx"',
    progress: 74,
  },
  {
    id: 'move-files',
    kind: 'move',
    title: '移动到对应文件夹',
    log: '报名表已移动到对应班级目录。',
    terminal: '$ move --by class --confirm',
    progress: 90,
  },
  {
    id: 'complete-task',
    kind: 'complete',
    title: '输出整理结果',
    log: '整理完成，文件结构可用于后续汇总。',
    terminal: '$ report --summary 文件整理完成',
    progress: 100,
  },
];

export const tokenDemo: TokenDemo = {
  title: 'Token 是 AI 处理信息时消耗的单位',
  subtitle: '这次任务已经消耗 1,000,000 token，恢复后会补充 10,000,000 token 继续演示。',
  pausedMessage: 'Token 不足，任务已暂停。',
  restoreButton: '补充 10,000,000 token',
  exhaustedTokens: 1_000_000,
  restoredTokens: 10_000_000,
  facts: [
    'Agent 执行多步骤任务时，会持续消耗 Token。',
    '任务暂停不是失败，而是当前演示资源已经用完。',
    '补充后，Agent 可以继续接收新的复杂任务。',
  ],
};

export const skillDemo: SkillDemo = {
  title: '选择一个专业 Skill',
  prompt: '帮我优化这段短视频口播稿，让它更适合开头。',
  selectedSkillId: 'short-video-script',
  skills: [
    { id: 'short-video-script', name: '短视频口播优化 Skill' },
    { id: 'prd-analysis', name: 'PRD 分析 Skill' },
    { id: 'code-review', name: '代码审查 Skill' },
    { id: 'research整理', name: '资料整理 Skill' },
  ],
  plainResult: {
    title: '普通输出',
    content: '大家好，今天我们来聊一聊 ChatBOT 和 Agent 的区别。ChatBOT 可以回答问题，Agent 可以执行任务。',
    tags: ['语言泛泛', '开头不够抓人', '缺少短视频钩子'],
  },
  skilledResult: {
    title: '使用 Skill 后',
    content: '你以为 AI 只能聊天？错。真正改变工作流的，是能拆任务、跑终端、整理文件的 Agent。今天用一条演示把它讲明白。',
    tags: ['开头有钩子', '节奏更短', '适合口播', '有画面提示'],
  },
  explanation: 'Skill 不是换一个 AI，而是给 Agent 加一套专业做事方法。',
};

export const mcpDemo: MCPDemo = {
  title: 'MCP：让 Agent 稳定连接外部工具',
  task: '把刚整理好的报名表名单，自动同步到在线表格里，方便老师直接查看。',
  failureLog: 'Agent 找不到在线表格的统一入口，只能停在“请手动复制粘贴”。',
  explanation: '可以把 MCP 理解成工具的统一插座。在线表格、知识库、代码仓库都接到同一种接口后，Agent 才知道怎么稳定使用它们。',
  successLog: 'MCP 已连接在线表格，Agent 已把三份报名表结果同步成一张可查看的名单。',
  connectButton: '连接 MCP',
  tools: [
    { id: 'sheet-tool', name: '在线表格' },
    { id: 'knowledge-tool', name: '知识库工具' },
    { id: 'repo-tool', name: '代码仓库工具' },
  ],
};

export const summaryItems: SummaryItem[] = [
  { term: 'ChatBOT（聊天机器人）', description: '负责对话。' },
  { term: 'Agent（智能体）', description: '负责执行任务。' },
  { term: 'Model（大模型）', description: '负责理解和生成。' },
  { term: 'Token（词元）', description: 'AI 工作时消耗的单位。' },
  { term: 'Skill（技能）', description: '让 Agent 更专业。' },
  { term: 'MCP（模型上下文协议）', description: '让 Agent 更容易连接工具。' },
];

export const stageSubtitles = [
  '先从你最熟悉的聊天 AI 开始。',
  '这类聊天 AI，就是 ChatBOT。',
  'ChatBOT 会回答，也能理解图片。',
  '但它不能直接替你操作电脑。',
  '你需要更高维度的力量。',
];

export const chatScript: ChatScriptStep[] = [
  {
    id: 'plain-qa',
    kind: 'qa',
    prompt: '用大白话解释一下什么是 AI Agent。',
    reply: '可以把 Agent 理解成会自己拆步骤、尝试完成任务的 AI 助手。',
    caption: 'ChatBOT 擅长把问题讲清楚。',
    thinkingStates: ['思考中...', '正在组织解释方式...'],
  },
  {
    id: 'image-understanding',
    kind: 'image',
    prompt: '帮我看一下这张图里主要讲了什么。',
    reply: '这张白板主要在梳理一个产品发布流程：先收集需求，再拆分任务，最后完成测试和上线准备。',
    caption: '它也能理解图片和截图。',
    thinkingStates: ['读取图片内容...', '提取白板关键词...'],
    imageTitle: '会议白板截图.png',
  },
  {
    id: 'thinking-demo',
    kind: 'thinking',
    prompt: '帮我规划一下今天学习 AI 的顺序。',
    reply: '建议先理解 ChatBOT，再认识 Agent，然后看 Model、Token、Skill 和 MCP 如何组成完整工作流。',
    caption: '思考状态让生成过程更像真实产品。',
    thinkingStates: ['正在拆解任务...', '生成学习路径...', '压缩成口播节奏...'],
  },
  {
    id: 'file-boundary',
    kind: 'boundary',
    prompt: '帮我把桌面上的报名表按班级分类，重命名后放进文件夹。',
    reply: '不支持操作文件，但我可以告诉你怎么做。',
    caption: 'ChatBOT 能给建议，不能接管本地文件。',
    thinkingStates: ['尝试理解文件任务...', '检查可执行权限...'],
  },
  {
    id: 'agent-hook',
    kind: 'hook',
    prompt: '',
    reply: '如果你需要的不只是回答，而是让 AI 真的替你干活……',
    caption: '你需要更高维度的力量。',
  },
];

export function containsBannedTerms(text: string) {
  return bannedPlatformTerms.some((term) => text.includes(term));
}
