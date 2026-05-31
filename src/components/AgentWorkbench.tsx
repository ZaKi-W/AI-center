import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  Box,
  CheckCircle2,
  Clock3,
  Edit3,
  FileSpreadsheet,
  Folder,
  GitBranch,
  HardDrive,
  Info,
  Mic,
  MoreHorizontal,
  Package,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  TerminalSquare,
  Wand2,
  Workflow,
} from 'lucide-react';
import { agentOptions, fileTaskSteps, mcpDemo, modelOptions, skillDemo } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './AgentWorkbench.module.css';

type AgentWorkbenchProps = {
  selectedAgentId: string;
  selectedModelId: string;
  tokenRestored: boolean;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onTokenDepleted: () => void;
  onComplete: () => void;
};

type StepPhase = 'thinking' | 'executing' | 'done';
type PostTokenPhase =
  | 'waitingSkill'
  | 'skillThinkingPlain'
  | 'skillPlainResult'
  | 'skillOverlay'
  | 'skillReady'
  | 'skillThinkingSkilled'
  | 'skillSkilledResult'
  | 'skillLesson'
  | 'waitingMcp'
  | 'mcpThinkingPlain'
  | 'mcpPlainResult'
  | 'mcpOverlay'
  | 'mcpReady'
  | 'mcpThinkingConnected'
  | 'mcpSuccessResult'
  | 'mcpLesson';

const finalFiles = [
  { folder: '一班', file: '一班_林知夏_报名表.xlsx' },
  { folder: '二班', file: '二班_周亦辰_报名表.xlsx' },
  { folder: '三班', file: '三班_许安宁_报名表.xlsx' },
];

const projectThreads = [
  { title: '重构大模型选择页布局', time: '2 分', active: true },
  { title: 'ai_workflow_realistic...', time: '23 分' },
  { title: 'ai_town_phase1_gam...', time: '2 天' },
  { title: 'ai_town_phase1_prd...', time: '2 天' },
];

export function AgentWorkbench({
  selectedAgentId,
  selectedModelId,
  tokenRestored,
  playbackMode,
  advanceSignal,
  onTokenDepleted,
  onComplete,
}: AgentWorkbenchProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];
  const [stepIndex, setStepIndex] = useState(0);
  const [taskSent, setTaskSent] = useState(playbackMode !== 'manual' || tokenRestored);
  const [responseReady, setResponseReady] = useState(tokenRestored);
  const [stepPhase, setStepPhase] = useState<StepPhase>(tokenRestored ? 'done' : 'thinking');
  const [postTokenPhase, setPostTokenPhase] = useState<PostTokenPhase>('waitingSkill');
  const [awaitingTokenRestore, setAwaitingTokenRestore] = useState(false);
  const activeStep = fileTaskSteps[stepIndex];

  useEffect(() => {
    setTaskSent(playbackMode !== 'manual' && !tokenRestored);
    setResponseReady(false);
    setStepIndex(tokenRestored ? fileTaskSteps.length - 1 : 0);
    setStepPhase(tokenRestored ? 'done' : 'thinking');
    setPostTokenPhase('waitingSkill');
    setAwaitingTokenRestore(false);
  }, [playbackMode, selectedAgentId, selectedModelId, tokenRestored]);

  useEffect(() => {
    if (!taskSent || responseReady) return;
    const timer = window.setTimeout(() => {
      setResponseReady(true);
      setStepPhase('thinking');
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [responseReady, taskSent]);

  useEffect(() => {
    if (!taskSent || !responseReady) return;
    if (tokenRestored && stepIndex >= fileTaskSteps.length - 1) return;

    if (stepPhase === 'thinking') {
      const timer = window.setTimeout(() => setStepPhase('executing'), 980);
      return () => window.clearTimeout(timer);
    }

    if (stepPhase === 'executing') {
      const timer = window.setTimeout(() => setStepPhase('done'), 1040);
      return () => window.clearTimeout(timer);
    }

    if (stepIndex >= fileTaskSteps.length - 1) return;

    const timer = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, fileTaskSteps.length - 1));
      setStepPhase('thinking');
    }, 520);
    return () => window.clearTimeout(timer);
  }, [responseReady, stepIndex, stepPhase, taskSent, tokenRestored]);

  useEffect(() => {
    if (!taskSent || !responseReady) return;
    if (tokenRestored || stepPhase !== 'done' || stepIndex < fileTaskSteps.length - 1) return;
    const timer = window.setTimeout(() => {
      if (playbackMode === 'manual') {
        setAwaitingTokenRestore(true);
        return;
      }
      onTokenDepleted();
    }, 1350);
    return () => window.clearTimeout(timer);
  }, [onTokenDepleted, playbackMode, responseReady, stepIndex, stepPhase, taskSent, tokenRestored]);

  useEffect(() => {
    if (!tokenRestored) return;

    const autoStart = (next: PostTokenPhase) => {
      if (playbackMode === 'manual') return undefined;
      const timer = window.setTimeout(() => setPostTokenPhase(next), 900);
      return () => window.clearTimeout(timer);
    };

    if (postTokenPhase === 'waitingSkill') return autoStart('skillThinkingPlain');
    if (postTokenPhase === 'skillReady') return autoStart('skillThinkingSkilled');
    if (postTokenPhase === 'waitingMcp') return autoStart('mcpThinkingPlain');
    if (postTokenPhase === 'mcpReady') return autoStart('mcpThinkingConnected');
    if (postTokenPhase === 'skillOverlay' && playbackMode !== 'manual') return autoStart('skillReady');
    if (postTokenPhase === 'skillLesson' && playbackMode !== 'manual') return autoStart('waitingMcp');
    if (postTokenPhase === 'mcpOverlay' && playbackMode !== 'manual') return autoStart('mcpReady');
    if (postTokenPhase === 'mcpLesson' && playbackMode !== 'manual') {
      const timer = window.setTimeout(onComplete, 1200);
      return () => window.clearTimeout(timer);
    }

    const timedNext: Partial<Record<PostTokenPhase, { next: PostTokenPhase; delay: number }>> = {
      skillThinkingPlain: { next: 'skillPlainResult', delay: 1500 },
      skillThinkingSkilled: { next: 'skillSkilledResult', delay: 1600 },
      mcpThinkingPlain: { next: 'mcpPlainResult', delay: 1500 },
      mcpThinkingConnected: { next: 'mcpSuccessResult', delay: 1600 },
    };
    const transition = timedNext[postTokenPhase];
    if (!transition) return;
    const timer = window.setTimeout(() => setPostTokenPhase(transition.next), transition.delay);
    return () => window.clearTimeout(timer);
  }, [playbackMode, postTokenPhase, tokenRestored]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (tokenRestored) {
      const manualNext: Partial<Record<PostTokenPhase, PostTokenPhase>> = {
        waitingSkill: 'skillThinkingPlain',
        skillPlainResult: 'skillOverlay',
        skillOverlay: 'skillReady',
        skillReady: 'skillThinkingSkilled',
        skillSkilledResult: 'skillLesson',
        skillLesson: 'waitingMcp',
        waitingMcp: 'mcpThinkingPlain',
        mcpPlainResult: 'mcpOverlay',
        mcpOverlay: 'mcpReady',
        mcpReady: 'mcpThinkingConnected',
        mcpSuccessResult: 'mcpLesson',
      };
      const nextPhase = manualNext[postTokenPhase];
      if (nextPhase) setPostTokenPhase(nextPhase);
      if (postTokenPhase === 'mcpLesson') onComplete();
      return;
    }

    if (awaitingTokenRestore) {
      onTokenDepleted();
      return;
    }

    if (!taskSent) {
      setTaskSent(true);
      setResponseReady(false);
      setStepIndex(0);
      setStepPhase('thinking');
      return;
    }
  });

  const completedStepCount = stepPhase === 'done' ? stepIndex + 1 : stepIndex;
  const visibleSteps = useMemo(() => fileTaskSteps.slice(0, completedStepCount), [completedStepCount]);
  const runningStep = stepPhase === 'executing' ? activeStep : null;
  const filesMoved = stepIndex >= 5;
  const elapsedSeconds = 38 + stepIndex * 24;
  const elapsed = `${Math.floor(elapsedSeconds / 60)}m ${String(elapsedSeconds % 60).padStart(2, '0')}s`;
  const processLabel = stepPhase === 'thinking'
    ? `思考中：正在判断“${activeStep.title}”需要哪些文件和命令`
    : stepPhase === 'executing'
      ? `执行中：${activeStep.terminal}`
      : activeStep.log;
  const postTokenThinking = ['skillThinkingPlain', 'skillThinkingSkilled', 'mcpThinkingPlain', 'mcpThinkingConnected'].includes(postTokenPhase);
  const postTokenComposerText = getPostTokenComposerText(postTokenPhase);

  return (
    <div className={styles.codexShell} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <aside className={styles.sidebar}>
        <div className={styles.windowDots}>
          <i />
          <i />
          <i />
          <span><PanelLeft size={15} /></span>
          <span><ArrowLeft size={15} /></span>
          <span><ArrowRight size={15} /></span>
        </div>

        <nav className={styles.primaryNav} aria-label="Codex navigation">
          <button type="button"><Edit3 size={17} />新对话</button>
          <button type="button"><Search size={17} />搜索</button>
          <button type="button"><Package size={17} />插件</button>
          <button type="button"><Clock3 size={17} />自动化</button>
        </nav>

        <div className={styles.projectList}>
          <span className={styles.sectionLabel}>项目</span>
          <div className={styles.projectGroup}>
            <strong><Folder size={16} />AI-center</strong>
            {projectThreads.map((thread) => (
              <button key={thread.title} type="button" className={thread.active ? styles.activeThread : ''}>
                <span>{thread.title}</span>
                <small>{thread.time}</small>
              </button>
            ))}
          </div>
          <div className={styles.projectGroup}>
            <strong><Folder size={16} />demo</strong>
            <button type="button"><span>我现在想搞一个网页...</span><small>2 天</small></button>
            <button type="button"><span>你能使用 image2 模型...</span><small>1 周</small></button>
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <button type="button"><Settings size={18} />设置</button>
        </div>
      </aside>

      <main className={styles.mainStage}>
        <header className={styles.titleBar}>
          <div>
            <strong>Agent 工作台仿真</strong>
            <MoreHorizontal size={18} />
          </div>
          <div className={styles.titleActions}>
            <button type="button"><Box size={15} /></button>
            <button type="button"><Info size={16} /></button>
            <button type="button"><PanelRight size={16} /></button>
          </div>
        </header>

        <section className={styles.conversation}>
          {tokenRestored ? (
            <PostTokenConversation
              phase={postTokenPhase}
              selectedAgentName={selectedAgent.name}
              selectedModelName={selectedModel.name}
            />
          ) : taskSent ? (
            <>
              <div className={styles.userBubble}>
                用 Codex 的样子演示一个 Agent 怎么整理桌面报名表
              </div>

              {!responseReady ? (
                <motion.div className={styles.thinkingBubble} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <span />
                  <span />
                  <span />
                  <em>正在读取任务和环境...</em>
                </motion.div>
              ) : (
              <motion.article className={styles.assistantMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className={styles.elapsed}>
                  <span>已处理 {elapsed}</span>
                  <ChevronRightTiny />
                </div>

                <p>
                  我正在用 <strong>{selectedAgent.name}</strong> 连接 <strong>{selectedModel.name}</strong> 执行文件整理任务。
                  当前步骤是：<strong>{activeStep.title}</strong>。
                </p>

                <div className={`${styles.processRow} ${styles[stepPhase]}`}>
                  <span />
                  <strong>{stepPhase === 'thinking' ? '思考过程' : stepPhase === 'executing' ? '执行过程' : '步骤完成'}</strong>
                  <em>{processLabel}</em>
                </div>

                <div className={styles.planList}>
                  {fileTaskSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={[
                        index < completedStepCount ? styles.doneStep : '',
                        index === stepIndex && stepPhase !== 'done' ? styles.activeStep : '',
                      ].join(' ')}
                    >
                      <CheckCircle2 size={16} />
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.commandCard}>
                  <div className={styles.commandHeader}>
                    <span><TerminalSquare size={16} />已执行 {visibleSteps.length} 条命令</span>
                    <small>zsh</small>
                  </div>
                  {visibleSteps.map((step) => (
                    <code key={step.id}>{step.terminal}</code>
                  ))}
                  {runningStep ? <code className={styles.runningCommand}>{runningStep.terminal}</code> : null}
                  {tokenRestored ? <code>$ continue --from paused-task --status running</code> : null}
                </div>

                <div className={styles.fileCard}>
                  <div>
                    <FileSpreadsheet size={18} />
                    <span>桌面报名表</span>
                  </div>
                  <small>{filesMoved ? '已移动到 一班 / 二班 / 三班' : '等待分类移动'}</small>
                  {filesMoved ? (
                    finalFiles.map((item) => <p key={item.file}>{item.folder} / {item.file}</p>)
                  ) : (
                    ['报名表_1.xlsx', '报名表_2.xlsx', '报名表_3.xlsx'].map((file) => <p key={file}>未分类 / {file}</p>)
                  )}
                </div>

                <div className={styles.messageActions}>
                  <span>复制</span>
                  <span>赞</span>
                  <span>踩</span>
                  <span>10:22</span>
                </div>
              </motion.article>
              )}
              {awaitingTokenRestore ? (
                <motion.div className={styles.tokenPauseCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <AlertTriangle size={18} />
                  <strong>Token 不足，任务已暂停。</strong>
                  <span>进入 Token 补充页面。</span>
                </motion.div>
              ) : null}
            </>
          ) : (
            <div className={styles.waitingState}>
              <strong>准备发送任务</strong>
              <p>手动模式下，继续后会先把底部输入框里的任务发送出去，再开始模拟 Agent 处理。</p>
            </div>
          )}
        </section>

        <div className={styles.composer}>
          <span>{tokenRestored ? postTokenComposerText : taskSent ? '要求后续变更' : '用 Codex 的样子演示一个 Agent 怎么整理桌面报名表'}</span>
          <div>
            <button type="button"><Plus size={20} /></button>
            <button type="button" className={styles.reviewMode}><Workflow size={16} />{postTokenThinking ? '执行中' : '自动审查'}</button>
            <em>{selectedModel.name.replace('GPT-', '')} 中</em>
            <button type="button"><Mic size={18} /></button>
            <button type="button" className={styles.sendButton}><ArrowUp size={20} /></button>
          </div>
        </div>
      </main>

      <aside className={styles.environmentCard}>
        <div className={styles.envHeader}>
          <strong>环境信息</strong>
          <SlidersHorizontal size={17} />
        </div>
        <div className={styles.envRow}>
          <Package size={17} />
          <span>变更</span>
          <em className={styles.added}>+{520 + stepIndex * 11}</em>
          <em className={styles.removed}>-{160 + stepIndex * 6}</em>
        </div>
        <div className={styles.envRow}>
          <HardDrive size={17} />
          <span>本地</span>
        </div>
        <div className={styles.envRow}>
          <GitBranch size={17} />
          <span>main</span>
        </div>
        <div className={styles.envRow}>
          <Workflow size={17} />
          <span>提交</span>
        </div>
        <div className={styles.envMuted}>GitHub CLI 未通过身份验证</div>
        <hr />
        <strong className={styles.sourceTitle}>来源</strong>
        <p>暂无来源</p>
      </aside>
      <ConceptOverlay phase={postTokenPhase} />
    </div>
  );
}

function ChevronRightTiny() {
  return <span aria-hidden="true">›</span>;
}

function PostTokenConversation({
  phase,
  selectedAgentName,
  selectedModelName,
}: {
  phase: PostTokenPhase;
  selectedAgentName: string;
  selectedModelName: string;
}) {
  if (phase === 'waitingSkill') {
    return (
      <div className={styles.waitingState}>
        <strong>Token 已补充，准备发送下一个任务</strong>
        <p>继续在 Agent 工作台里下达一个需要依赖 Skill 的短视频口播任务。</p>
      </div>
    );
  }

  if (phase === 'waitingMcp') {
    return (
      <div className={styles.waitingState}>
        <strong>Skill 已讲清楚，准备进入 MCP 任务</strong>
        <p>继续在 Agent 工作台里尝试把报名表名单同步到在线表格。</p>
      </div>
    );
  }

  if (phase.startsWith('mcp')) {
    return <McpTaskConversation phase={phase} selectedAgentName={selectedAgentName} selectedModelName={selectedModelName} />;
  }

  return (
    <>
      <div className={styles.userBubble}>
        {skillDemo.prompt}
      </div>

      {phase === 'skillThinkingPlain' ? (
        <motion.div className={styles.thinkingBubble} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span />
          <span />
          <span />
          <em>正在直接生成，没有调用专业 Skill...</em>
        </motion.div>
      ) : null}

      {phase === 'skillPlainResult' || phase === 'skillOverlay' || phase === 'skillReady' || phase === 'skillThinkingSkilled' || phase === 'skillSkilledResult' || phase === 'skillLesson' ? (
        <motion.article className={styles.assistantMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.elapsed}>
            <span>10,000,000 token ready</span>
            <ChevronRightTiny />
          </div>

          <p>
            我正在用 <strong>{selectedAgentName}</strong> 连接 <strong>{selectedModelName}</strong> 处理口播稿任务。
          </p>

          <div className={`${styles.processRow} ${phase === 'skillThinkingSkilled' ? styles.executing : ''}`}>
            <span />
            <strong>{phase === 'skillReady' || phase === 'skillThinkingSkilled' || phase === 'skillSkilledResult' || phase === 'skillLesson' ? '调用短视频口播优化 Skill 执行' : '未使用 Skill'}</strong>
            <em>
              {phase === 'skillReady'
                ? '等待你确认使用短视频口播优化 Skill。'
                : phase === 'skillThinkingSkilled'
                  ? '正在套用短视频口播优化 Skill：压缩节奏、强化钩子、补足画面感。'
                  : phase === 'skillSkilledResult' || phase === 'skillLesson'
                    ? 'Skill 已生效，结果更贴合短视频口播场景。'
                    : 'Agent 只有通用生成能力，缺少短视频口播的专业方法。'}
            </em>
          </div>

          <div className={styles.commandCard}>
            <div className={styles.commandHeader}>
              <span><TerminalSquare size={16} />Agent 执行记录</span>
              <small>zsh</small>
            </div>
            <code>$ generate_script --mode general</code>
            {phase === 'skillReady' || phase === 'skillThinkingSkilled' || phase === 'skillSkilledResult' || phase === 'skillLesson' ? (
              <code className={phase === 'skillThinkingSkilled' ? styles.runningCommand : ''}>$ use-skill short-video-script</code>
            ) : null}
          </div>

          <div className={phase === 'skillSkilledResult' || phase === 'skillLesson' ? styles.resultCompareGrid : undefined}>
            <div className={`${styles.skillResultCard} ${styles.badSkillResult}`}>
              <strong>{skillDemo.plainResult.title}</strong>
              <p>{skillDemo.plainResult.content}</p>
              <div>
                {skillDemo.plainResult.tags.map((tag) => (
                  <span key={tag}>
                    <AlertTriangle size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {phase === 'skillSkilledResult' || phase === 'skillLesson' ? (
              <div className={`${styles.skillResultCard} ${styles.goodSkillResult}`}>
                <strong>{skillDemo.skilledResult.title}</strong>
                <p>{skillDemo.skilledResult.content}</p>
                <div>
                  {skillDemo.skilledResult.tags.map((tag) => (
                    <span key={tag}>
                      <CheckCircle2 size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {phase === 'skillReady' ? (
            <div className={styles.skillPromptCard}>
              <Wand2 size={18} />
              <span>已关闭提示</span>
              <strong>Agent 会使用 Skill 重新执行这个任务。</strong>
            </div>
          ) : null}
        </motion.article>
      ) : null}
    </>
  );
}

function McpTaskConversation({
  phase,
  selectedAgentName,
  selectedModelName,
}: {
  phase: PostTokenPhase;
  selectedAgentName: string;
  selectedModelName: string;
}) {
  return (
    <>
      <div className={styles.userBubble}>
        {mcpDemo.task}
      </div>

      {phase === 'mcpThinkingPlain' ? (
        <motion.div className={styles.thinkingBubble} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <span />
          <span />
          <span />
          <em>正在直接寻找在线表格入口，没有使用 MCP...</em>
        </motion.div>
      ) : null}

      {phase !== 'mcpThinkingPlain' ? (
        <motion.article className={styles.assistantMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.elapsed}>
            <span>工具连接任务</span>
            <ChevronRightTiny />
          </div>

          <p>
            我正在用 <strong>{selectedAgentName}</strong> 连接 <strong>{selectedModelName}</strong> 尝试同步在线表格。
          </p>

          <div className={`${styles.processRow} ${phase === 'mcpThinkingConnected' ? styles.executing : ''}`}>
            <span />
            <strong>{phase === 'mcpReady' || phase === 'mcpThinkingConnected' || phase === 'mcpSuccessResult' || phase === 'mcpLesson' ? '调用 MCP 执行' : '未使用 MCP'}</strong>
            <em>
              {phase === 'mcpReady'
                ? '等待你确认使用 MCP 统一工具接口。'
                : phase === 'mcpThinkingConnected'
                  ? '正在通过 MCP 标准接口连接在线表格。'
                  : phase === 'mcpSuccessResult' || phase === 'mcpLesson'
                    ? mcpDemo.successLog
                    : mcpDemo.failureLog}
            </em>
          </div>

          <div className={styles.commandCard}>
            <div className={styles.commandHeader}>
              <span><TerminalSquare size={16} />Agent 执行记录</span>
              <small>zsh</small>
            </div>
            <code>$ sync-students --target online-sheet</code>
            {phase === 'mcpReady' || phase === 'mcpThinkingConnected' || phase === 'mcpSuccessResult' || phase === 'mcpLesson' ? (
              <code className={phase === 'mcpThinkingConnected' ? styles.runningCommand : ''}>$ connect-mcp online-sheet</code>
            ) : null}
          </div>

          <div className={phase === 'mcpSuccessResult' || phase === 'mcpLesson' ? styles.resultCompareGrid : undefined}>
            <div className={`${styles.skillResultCard} ${styles.badSkillResult}`}>
              <strong>普通连接结果</strong>
              <p>{mcpDemo.failureLog}</p>
              <div>
                  {['找不到表格入口', '需要手动复制', '无法自动同步'].map((tag) => (
                  <span key={tag}>
                    <AlertTriangle size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {phase === 'mcpSuccessResult' || phase === 'mcpLesson' ? (
              <div className={`${styles.skillResultCard} ${styles.goodSkillResult}`}>
                <strong>使用 MCP 后</strong>
                <p>{mcpDemo.successLog}</p>
                <div>
                  {['接口已统一', '工具状态在线', '同步完成'].map((tag) => (
                    <span key={tag}>
                      <CheckCircle2 size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {phase === 'mcpReady' ? (
            <div className={styles.skillPromptCard}>
              <Workflow size={18} />
              <span>已关闭提示</span>
              <strong>Agent 会使用 MCP 重新同步在线表格。</strong>
            </div>
          ) : null}
        </motion.article>
      ) : null}
    </>
  );
}

function ConceptOverlay({ phase }: { phase: PostTokenPhase }) {
  const overlays: Partial<Record<PostTokenPhase, { title: string; description: string }>> = {
    skillOverlay: {
      title: '结果不尽人意，调用短视频口播优化 Skill 执行',
      description: 'Skill 是给 Agent 的专业方法包。它让 Agent 不只是泛泛回答，而是按特定场景的标准流程做事。',
    },
    skillLesson: {
      title: 'Skill：让 Agent 更专业',
      description: skillDemo.explanation,
    },
    mcpOverlay: {
      title: '同步失败，调用 MCP 执行',
      description: 'MCP 像统一插座，让 Agent 知道在线表格、知识库这类工具该怎么接、怎么用。',
    },
    mcpLesson: {
      title: 'MCP：连接工具的统一接口',
      description: mcpDemo.explanation,
    },
  };
  const overlay = overlays[phase];

  return (
    <AnimatePresence>
      {overlay ? (
        <motion.div
          className={styles.conceptOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.conceptOverlayCard}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
          >
            <span>{overlay.title}</span>
            <strong>{overlay.description}</strong>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function getPostTokenComposerText(phase: PostTokenPhase) {
  if (phase.startsWith('mcp')) return phase === 'waitingMcp' ? mcpDemo.task : 'Agent 正在处理 MCP 工具任务...';
  return phase === 'waitingSkill' ? skillDemo.prompt : 'Agent 正在处理 Skill 任务...';
}
