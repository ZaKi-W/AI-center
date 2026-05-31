import { describe, expect, it } from 'vitest';
import {
  agentOptions,
  appStages,
  bannedPlatformTerms,
  chatbotProducts,
  chatScript,
  containsBannedTerms,
  defaultAgentId,
  defaultModelId,
  fileTaskSteps,
  mcpDemo,
  modelOptions,
  skillDemo,
  stageSubtitles,
  summaryItems,
  tokenDemo,
} from './demoContent';

describe('demo content contract', () => {
  it('orders the milestone two stages from chatbot to agent workbench', () => {
    expect(appStages).toEqual([
      'chatbot',
      'transition',
      'agent-select',
      'model-select',
      'agent-workbench',
      'token-restore',
      'summary',
    ]);
  });

  it('presents recognizable chatbot products without official clone assets', () => {
    expect(chatbotProducts.map((product) => product.name)).toEqual([
      '豆包',
      'DeepSeek',
      'ChatGPT',
    ]);
    expect(chatbotProducts.every((product) => product.logoKind === 'text')).toBe(true);
  });

  it('orders the chatbot demo as qa, image understanding, thinking, boundary, hook', () => {
    expect(chatScript.map((step) => step.kind)).toEqual([
      'qa',
      'image',
      'thinking',
      'boundary',
      'hook',
    ]);
  });

  it('does not include platform risk words in user-facing subtitles or scripts', () => {
    const userFacingText = [
      ...stageSubtitles,
      ...chatbotProducts.flatMap((product) => [product.name, product.positioning]),
      ...agentOptions.flatMap((agent) => [agent.name, agent.description, agent.badge, agent.logVoice, ...agent.tags]),
      ...modelOptions.flatMap((model) => [
        model.name,
        model.positioning,
        ...model.strengths,
      ]),
      ...fileTaskSteps.flatMap((step) => [
        step.title,
        step.log,
        step.terminal,
      ]),
      tokenDemo.title,
      tokenDemo.subtitle,
      tokenDemo.pausedMessage,
      tokenDemo.restoreButton,
      ...tokenDemo.facts,
      skillDemo.title,
      skillDemo.prompt,
      skillDemo.plainResult.title,
      skillDemo.plainResult.content,
      ...skillDemo.plainResult.tags,
      skillDemo.skilledResult.title,
      skillDemo.skilledResult.content,
      ...skillDemo.skilledResult.tags,
      ...skillDemo.skills.map((skill) => skill.name),
      mcpDemo.title,
      mcpDemo.task,
      mcpDemo.failureLog,
      mcpDemo.explanation,
      mcpDemo.successLog,
      mcpDemo.connectButton,
      ...mcpDemo.tools.map((tool) => tool.name),
      ...summaryItems.flatMap((item) => [item.term, item.description]),
      ...chatScript.flatMap((step) => [
        step.prompt,
        step.reply,
        step.caption,
        ...(step.thinkingStates ?? []),
      ]),
    ].join('\n');

    expect(containsBannedTerms(userFacingText)).toBe(false);
    expect(bannedPlatformTerms).toContain('充值');
  });

  it('defines the required agent choices and defaults to Codex', () => {
    expect(agentOptions.map((agent) => agent.name)).toEqual([
      'Claude Code',
      'Codex',
      'OpenClaw',
      'HermesAgent',
      'Trae Solo',
    ]);
    expect(defaultAgentId).toBe('codex');
    expect(agentOptions.find((agent) => agent.id === defaultAgentId)?.themeColor).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('defines the model brain choices and defaults to GPT5.5', () => {
    expect(modelOptions.map((model) => model.name)).toEqual([
      'GPT5.5',
      'Opus4.7',
      'GLM5.1',
      'DeepSeekV4Pro',
      'Gemini3.1 Pro',
    ]);
    expect(defaultModelId).toBe('gpt-55');
  });

  it('scripts the file task as visible execution steps', () => {
    expect(fileTaskSteps.map((step) => step.kind)).toEqual([
      'scan',
      'read',
      'classify',
      'create',
      'rename',
      'move',
      'complete',
    ]);
  });

  it('defines the token pause and restore copy without transaction language', () => {
    expect(tokenDemo.pausedMessage).toBe('Token 不足，任务已暂停。');
    expect(tokenDemo.restoreButton).toBe('补充 10,000,000 token');
    expect(containsBannedTerms([
      tokenDemo.title,
      tokenDemo.subtitle,
      tokenDemo.pausedMessage,
      tokenDemo.restoreButton,
      ...tokenDemo.facts,
    ].join('\n'))).toBe(false);
  });

  it('defines the skill comparison as weak result then professional result', () => {
    expect(skillDemo.skills.map((skill) => skill.name)).toEqual([
      '短视频口播优化 Skill',
      'PRD 分析 Skill',
      '代码审查 Skill',
      '资料整理 Skill',
    ]);
    expect(skillDemo.selectedSkillId).toBe('short-video-script');
    expect(skillDemo.plainResult.tags).toContain('开头不够抓人');
    expect(skillDemo.skilledResult.tags).toContain('开头有钩子');
  });

  it('defines mcp as a failed tool connection followed by a unified interface', () => {
    expect(mcpDemo.tools.map((tool) => tool.name)).toEqual(['在线表格', '知识库工具', '代码仓库工具']);
    expect(mcpDemo.failureLog).toContain('请手动复制粘贴');
    expect(mcpDemo.connectButton).toBe('连接 MCP');
    expect(mcpDemo.successLog).toContain('在线表格');
  });

  it('summarizes the full concept chain in order', () => {
    expect(summaryItems.map((item) => item.term)).toEqual([
      'ChatBOT（聊天机器人）',
      'Agent（智能体）',
      'Model（大模型）',
      'Token（词元）',
      'Skill（技能）',
      'MCP（模型上下文协议）',
    ]);
  });
});
