export type AppStage =
  | 'chatbot'
  | 'transition'
  | 'agent-select'
  | 'model-select'
  | 'agent-workbench'
  | 'token-restore'
  | 'skill-demo'
  | 'mcp-demo'
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
  badge: string;
  logVoice: string;
};

export type ModelOption = {
  id: string;
  name: string;
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
  'chatbot',
  'transition',
  'agent-select',
  'model-select',
  'agent-workbench',
  'token-restore',
  'skill-demo',
  'mcp-demo',
  'summary',
];
export const defaultAgentId = 'codex';
export const defaultModelId = 'gpt-55';

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
    badge: 'CC',
    logVoice: '我会先读懂项目，再拆成可执行步骤。',
  },
  {
    id: 'codex',
    name: 'Codex',
    tags: ['代码任务', '工程执行', '自动修复'],
    themeColor: '#7cc7ff',
    description: '适合把明确任务推进成文件、命令和检查结果。',
    badge: 'CX',
    logVoice: '我会按任务清单执行，并把每一步结果记录下来。',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tags: ['工具操作', '抓取执行', '自动化'],
    themeColor: '#8fdbb7',
    description: '适合跨窗口、跨工具完成结构化操作。',
    badge: 'OC',
    logVoice: '我会连接可用工具，把重复动作自动化。',
  },
  {
    id: 'hermes-agent',
    name: 'HermesAgent',
    tags: ['流程执行', '多步骤任务', '助手形态'],
    themeColor: '#b6a7ff',
    description: '适合把一个目标拆成连续流程并持续推进。',
    badge: 'HA',
    logVoice: '我会保持任务上下文，逐步推进流程。',
  },
  {
    id: 'trae-solo',
    name: 'Trae Solo',
    tags: ['开发协作', '项目任务', 'IDE 助手'],
    themeColor: '#f0c66a',
    description: '适合贴近开发环境完成项目协作任务。',
    badge: 'TS',
    logVoice: '我会围绕项目任务给出可见的执行反馈。',
  },
];

export const modelOptions: ModelOption[] = [
  {
    id: 'gpt-55',
    name: 'GPT5.5',
    positioning: '综合能力强，适合复杂推理和通用任务演示。',
    strengths: ['复杂推理', '通用生成', '多步骤规划'],
    bars: { reasoning: 96, coding: 92, multimodal: 90, speed: 82 },
  },
  {
    id: 'opus-47',
    name: 'Opus4.7',
    positioning: '长文档理解强，适合项目分析和写作演示。',
    strengths: ['长上下文', '写作润色', '需求理解'],
    bars: { reasoning: 93, coding: 86, multimodal: 78, speed: 76 },
  },
  {
    id: 'glm-51',
    name: 'GLM5.1',
    positioning: '中文场景友好，适合本土化工作流演示。',
    strengths: ['中文表达', '结构总结', '任务规划'],
    bars: { reasoning: 88, coding: 82, multimodal: 78, speed: 88 },
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeekV4Pro',
    positioning: '代码和推理表现突出，适合工程任务演示。',
    strengths: ['代码理解', '推理拆解', '终端任务'],
    bars: { reasoning: 94, coding: 95, multimodal: 72, speed: 84 },
  },
  {
    id: 'gemini-31-pro',
    name: 'Gemini3.1 Pro',
    positioning: '多模态和资料理解突出，适合跨内容任务演示。',
    strengths: ['多模态', '资料整理', '跨内容理解'],
    bars: { reasoning: 90, coding: 84, multimodal: 96, speed: 80 },
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
  subtitle: '输入越长、输出越多、任务越复杂，消耗通常越大。',
  pausedMessage: 'Token 不足，任务已暂停。',
  restoreButton: '恢复任务能量',
  facts: [
    'Agent 执行多步骤任务时，也会持续消耗 Token。',
    '任务暂停不是失败，而是当前演示资源已经用完。',
    '恢复后，Agent 会从暂停位置继续执行。',
  ],
};

export const skillDemo: SkillDemo = {
  title: '选择一个专业 Skill',
  prompt: '帮我优化这段抖音口播稿，让它更适合短视频开头。',
  selectedSkillId: 'short-video-script',
  skills: [
    { id: 'short-video-script', name: '短视频口播优化 Skill' },
    { id: 'prd-analysis', name: 'PRD 分析 Skill' },
    { id: 'code-review', name: '代码审查 Skill' },
    { id: 'research整理', name: '资料整理 Skill' },
  ],
  plainResult: {
    title: '普通输出',
    content: '大家好，今天我们来聊一聊 ChatBot 和 Agent 的区别。ChatBot 可以回答问题，Agent 可以执行任务。',
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
  title: 'MCP：让 Agent 连接工具的统一接口',
  task: '现在让 Agent 使用一个专业工具，把报名表结果同步到数据表工具。',
  failureLog: '工具接口不兼容，无法继续。',
  explanation: '可以把 MCP 理解成一个标准插座，工具接进来，Agent 才更容易使用。',
  successLog: '工具状态已在线，Agent 已完成数据表同步。',
  connectButton: '连接 MCP',
  tools: [
    { id: 'sheet-tool', name: '数据表工具' },
    { id: 'knowledge-tool', name: '知识库工具' },
    { id: 'repo-tool', name: '代码仓库工具' },
  ],
};

export const summaryItems: SummaryItem[] = [
  { term: 'ChatBot', description: '负责对话。' },
  { term: 'Agent', description: '负责执行任务。' },
  { term: 'Model', description: '负责理解和生成。' },
  { term: 'Token', description: 'AI 工作时消耗的单位。' },
  { term: 'Skill', description: '让 Agent 更专业。' },
  { term: 'MCP', description: '让 Agent 更容易连接工具。' },
];

export const stageSubtitles = [
  '先从你最熟悉的聊天 AI 开始。',
  '这类聊天 AI，就是 ChatBot。',
  'ChatBot 会回答，也能理解图片。',
  '但它不能直接替你操作电脑。',
  '你需要更高维度的力量。',
];

export const chatScript: ChatScriptStep[] = [
  {
    id: 'plain-qa',
    kind: 'qa',
    prompt: '用大白话解释一下什么是 AI Agent。',
    reply: '可以把 Agent 理解成会自己拆步骤、尝试完成任务的 AI 助手。',
    caption: 'ChatBot 擅长把问题讲清楚。',
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
    reply: '建议先理解 ChatBot，再认识 Agent，然后看 Model、Token、Skill 和 MCP 如何组成完整工作流。',
    caption: '思考状态让生成过程更像真实产品。',
    thinkingStates: ['正在拆解任务...', '生成学习路径...', '压缩成口播节奏...'],
  },
  {
    id: 'file-boundary',
    kind: 'boundary',
    prompt: '帮我把桌面上的报名表按班级分类，重命名后放进文件夹。',
    reply: '我可以告诉你怎么整理，但我不能直接操作你的本地电脑文件。',
    caption: 'ChatBot 能给建议，不能接管本地文件。',
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
