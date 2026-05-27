import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, FileSpreadsheet, Image, Lock, Send, Sparkles } from 'lucide-react';
import { chatScript, type ChatScriptStep } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './ChatbotSimulator.module.css';

type ChatbotSimulatorProps = {
  recordingMode: boolean;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onEnterAgentWorld: () => void;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imageTitle?: string;
};

type ManualOverlayKey = 'intro' | 'image' | 'thinking' | 'file-action' | 'file-unsupported';

const stepDurations: Record<ChatScriptStep['kind'], number> = {
  qa: 5200,
  image: 5600,
  thinking: 5600,
  boundary: 6600,
  hook: 3600,
};

const capabilityExplainers: Record<ChatScriptStep['kind'], { title: string; description: string; tone?: 'warning' }> = {
  qa: {
    title: '问答能力',
    description: '聊天机器人(ChatBOT)可以把概念讲清楚，适合回答问题、解释知识。',
  },
  image: {
    title: '图文理解能力',
    description: '它可以读取图片、截图、白板或表格，并总结里面的信息。',
  },
  thinking: {
    title: '思考与规划能力',
    description: '它会把问题拆成步骤，给出学习路径、计划或建议。',
  },
  boundary: {
    title: '重点：聊天机器人(ChatBOT)不能操作电脑文件',
    description: '它可以告诉你怎么整理，但不能直接接管本地桌面、重命名文件或移动文件。',
    tone: 'warning',
  },
  hook: {
    title: '',
    description: '',
  },
};

const manualExplainers: Record<ManualOverlayKey, { title: string; description: string; tone?: 'warning' }> = {
  intro: {
    title: '先从你最熟悉的聊天机器人开始',
    description: '它最典型的工作方式，就是你问一句，它答一句。',
  },
  image: {
    title: '图文理解能力',
    description: '除了文字，它也可以看图片、截图和表格，并总结里面的信息。',
  },
  thinking: {
    title: '思考能力',
    description: '它会把问题拆成步骤，再组织成更容易理解的回答。',
  },
  'file-action': {
    title: '文件操纵能力',
    description: '接下来试着让聊天机器人(ChatBOT)整理电脑里的报名表。',
  },
  'file-unsupported': {
    title: '聊天机器人不支持对电脑文件的操纵',
    description: '它可以告诉你怎么做，但不能直接重命名、移动或创建本地文件夹。',
    tone: 'warning',
  },
};

const nextManualOverlayByStep: Partial<Record<ChatScriptStep['kind'], ManualOverlayKey>> = {
  qa: 'image',
  image: 'thinking',
  thinking: 'file-action',
};

function useTypewriter(text: string, pace = 24) {
  const [visibleText, setVisibleText] = useState('');

  useEffect(() => {
    setVisibleText('');
    if (!text) return;
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, pace);
    return () => window.clearInterval(timer);
  }, [pace, text]);

  return visibleText;
}

export function ChatbotSimulator({ recordingMode, playbackMode, advanceSignal, onEnterAgentWorld }: ChatbotSimulatorProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingPrompt, setTypingPrompt] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [showExplainer, setShowExplainer] = useState(true);
  const [manualOverlayKey, setManualOverlayKey] = useState<ManualOverlayKey>('intro');
  const activeStep = chatScript[stepIndex];
  const typedPrompt = useTypewriter(typingPrompt, 18);
  const typedReply = useTypewriter(replyDraft, 18);
  const showBoundary = activeStep.kind === 'boundary' || stepIndex > 3;
  const showHook = activeStep.kind === 'hook';
  const activeExplainer = playbackMode === 'manual'
    ? manualExplainers[manualOverlayKey]
    : capabilityExplainers[activeStep.kind];
  const activeUserMessageId = `${activeStep.id}-user`;
  const activeAssistantMessageId = `${activeStep.id}-assistant`;
  const hasActiveUserMessage = messages.some((message) => message.id === activeUserMessageId);
  const hasActiveAssistantMessage = messages.some((message) => message.id === activeAssistantMessageId);

  useEffect(() => {
    setStepIndex(0);
    setMessages([]);
  }, []);

  useEffect(() => {
    const step = chatScript[stepIndex];
    const explainerDuration = step.kind === 'boundary' ? 2600 : 2200;
    setThinkingIndex(0);
    setTypingPrompt('');
    setReplyDraft('');
    if (playbackMode === 'auto') setShowExplainer(step.kind !== 'hook');

    const explainerTimer = playbackMode === 'auto' && step.kind !== 'hook'
      ? window.setTimeout(() => {
          setShowExplainer(false);
        }, explainerDuration)
      : undefined;

    if (step.kind === 'hook') {
      setTypingPrompt('');
      if (playbackMode === 'manual') return;
      const timer = window.setTimeout(onEnterAgentWorld, 3100);
      return () => {
        if (explainerTimer) window.clearTimeout(explainerTimer);
        window.clearTimeout(timer);
      };
    }

    if (playbackMode === 'manual') {
      return () => {
        if (explainerTimer) window.clearTimeout(explainerTimer);
      };
    }

    const autoStartDelay = explainerDuration + 220;
    const promptTypeDuration = Math.min(1600, step.prompt.length * 18 + 280);

    const typingTimer = window.setTimeout(() => {
      setTypingPrompt(step.prompt);
    }, autoStartDelay);

    const promptTimer = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `${step.id}-user`, role: 'user', text: step.prompt, imageTitle: step.imageTitle },
      ]);
      setTypingPrompt('');
    }, autoStartDelay + promptTypeDuration);

    const thinkingTimer = window.setInterval(() => {
      setThinkingIndex((current) => {
        const total = step.thinkingStates?.length ?? 1;
        return current + 1 >= total ? current : current + 1;
      });
    }, 780);

    const replyTimer = window.setTimeout(() => {
      setReplyDraft(step.reply);
    }, autoStartDelay + 2200);

    const commitReplyTimer = window.setTimeout(() => {
      setMessages((current) => [...current, { id: `${step.id}-assistant`, role: 'assistant', text: step.reply }]);
      setReplyDraft('');
    }, autoStartDelay + Math.min(stepDurations[step.kind] - 900, 2200 + step.reply.length * 18 + 450));

    const nextTimer = playbackMode === 'auto'
      ? window.setTimeout(() => {
          if (stepIndex < chatScript.length - 1) setStepIndex((current) => current + 1);
        }, autoStartDelay + stepDurations[step.kind])
      : undefined;

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(promptTimer);
      window.clearInterval(thinkingTimer);
      window.clearTimeout(replyTimer);
      window.clearTimeout(commitReplyTimer);
      if (nextTimer) window.clearTimeout(nextTimer);
      if (explainerTimer) window.clearTimeout(explainerTimer);
    };
  }, [onEnterAgentWorld, playbackMode, stepIndex]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (showHook) {
      onEnterAgentWorld();
      return;
    }
    if (showExplainer) {
      if (manualOverlayKey === 'file-unsupported') {
        setShowExplainer(false);
        setStepIndex(chatScript.findIndex((step) => step.kind === 'hook'));
        return;
      }
      setShowExplainer(false);
      return;
    }

    if (!hasActiveUserMessage) {
      setMessages((current) => {
        if (current.some((message) => message.id === activeUserMessageId)) return current;
        return [
          ...current,
          {
            id: activeUserMessageId,
            role: 'user',
            text: activeStep.prompt,
            imageTitle: activeStep.imageTitle,
          },
        ];
      });
      setTypingPrompt('');
      return;
    }

    if (!hasActiveAssistantMessage) {
      setMessages((current) => {
        if (current.some((message) => message.id === activeAssistantMessageId)) return current;
        return [...current, { id: activeAssistantMessageId, role: 'assistant', text: activeStep.reply }];
      });
      setReplyDraft('');
      return;
    }

    if (activeStep.kind === 'boundary') {
      setManualOverlayKey('file-unsupported');
      setShowExplainer(true);
      return;
    }

    const nextOverlayKey = nextManualOverlayByStep[activeStep.kind];
    if (nextOverlayKey) {
      setManualOverlayKey(nextOverlayKey);
      setStepIndex((current) => Math.min(current + 1, chatScript.length - 1));
      setShowExplainer(true);
      return;
    }

    setStepIndex((current) => Math.min(current + 1, chatScript.length - 1));
  });

  const currentThinking = useMemo(() => {
    const states = activeStep.thinkingStates ?? ['思考中...'];
    return states[Math.min(thinkingIndex, states.length - 1)];
  }, [activeStep.thinkingStates, thinkingIndex]);

  return (
    <div className={`${styles.simulator} ${recordingMode ? styles.recordingMode : ''}`}>
      <section className={`${styles.chatPanel} ${showHook ? styles.chatPanelReceded : ''}`}>
        <header className={styles.chatHeader}>
          <div>
            <span className={styles.windowDots}>
              <i />
              <i />
              <i />
            </span>
            <strong>ChatGPT 模拟窗口</strong>
          </div>
          <span className={styles.headerBadge}>演示 Demo</span>
        </header>

        <div className={styles.messages}>
          <div className={styles.welcomeCard}>
            <Sparkles size={18} />
            <span>先从你最熟悉的聊天 AI 开始。</span>
          </div>

          {messages.map((message) => (
            <motion.article
              key={message.id}
              className={`${styles.message} ${styles[message.role]}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message.imageTitle ? (
                <div className={styles.uploadChip}>
                  <Image size={16} />
                  {message.imageTitle}
                </div>
              ) : null}
              <p>{message.text}</p>
            </motion.article>
          ))}

          <AnimatePresence>
            {replyDraft ? (
              <motion.article
                className={`${styles.message} ${styles.assistant}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p>{typedReply}</p>
              </motion.article>
            ) : null}
          </AnimatePresence>

          {activeStep.kind !== 'hook' && hasActiveUserMessage && !hasActiveAssistantMessage && !replyDraft ? (
            <motion.div className={styles.thinkingPill} layout>
              <span />
              {currentThinking}
            </motion.div>
          ) : null}
        </div>

        <div className={styles.inputDock}>
          {activeStep.imageTitle && !messages.some((message) => message.imageTitle === activeStep.imageTitle) ? (
            <motion.div className={styles.pendingUpload} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Image size={16} />
              {activeStep.imageTitle}
            </motion.div>
          ) : null}
          <div className={styles.inputBox}>
            <span>{typedPrompt || (playbackMode === 'manual' ? '按下一步发送这句话...' : '等待下一段演示...')}</span>
            <button type="button" aria-label="发送演示消息">
              <Send size={16} />
            </button>
          </div>
        </div>
      </section>

      <aside className={styles.contextPanel}>
        <div className={styles.capabilityCard}>
          <span>当前字幕</span>
          <strong>{activeStep.caption}</strong>
        </div>
        <div className={styles.capabilityGrid}>
          <span className={stepIndex >= 0 ? styles.capabilityOn : ''}>问答</span>
          <span className={stepIndex >= 1 ? styles.capabilityOn : ''}>图文</span>
          <span className={stepIndex >= 2 ? styles.capabilityOn : ''}>思考</span>
          <span className={showBoundary ? styles.capabilityWarn : ''}>本地文件</span>
        </div>
        <FilePermissionWall active={showBoundary} />
      </aside>

      <AnimatePresence>
        {showHook ? (
          <motion.div
            className={styles.agentHook}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>如果你需要的不只是回答，</p>
            <p>而是让 AI 真的替你干活……</p>
            <strong>你需要更高维的力量：Agent</strong>
            <button type="button" onClick={onEnterAgentWorld}>进入 Agent 世界</button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showExplainer ? (
          <motion.div
            key={activeStep.kind}
            className={`${styles.capabilityOverlay} ${activeExplainer.tone === 'warning' ? styles.capabilityOverlayWarning : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <motion.div
              className={styles.capabilityOverlayCard}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
            >
              <span>{activeExplainer.title}</span>
              <strong>{activeExplainer.description}</strong>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilePermissionWall({ active }: { active: boolean }) {
  return (
    <div className={`${styles.fileWindow} ${active ? styles.fileBlocked : ''}`}>
      <header>
        <span>桌面 / 报名表</span>
        <small>{active ? '仅能给出建议，无法直接执行' : '等待文件任务'}</small>
      </header>
      <div className={styles.fileList}>
        {['报名表_1.xlsx', '报名表_2.xlsx', '报名表_3.xlsx', '未分类文件夹'].map((file, index) => (
          <motion.div
            key={file}
            className={styles.fileRow}
            animate={active && index < 3 ? { x: [0, 6, 0], opacity: 0.58 } : { x: 0, opacity: 1 }}
            transition={{ repeat: active ? Infinity : 0, duration: 1.8, delay: index * 0.14 }}
          >
            <FileSpreadsheet size={16} />
            <span>{file}</span>
          </motion.div>
        ))}
      </div>
      {active ? (
        <motion.div className={styles.permissionOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Lock size={30} />
          <strong>无法操作本地文件</strong>
          <span>
            <AlertTriangle size={14} />
            鼠标停住，文件窗口已变灰
          </span>
        </motion.div>
      ) : null}
    </div>
  );
}
