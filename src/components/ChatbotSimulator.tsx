import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bot, FileSpreadsheet, Image, Lock, Send, Sparkles } from 'lucide-react';
import { chatbotProducts, chatScript, type ChatScriptStep } from '../data/demoContent';
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

const stepDurations: Record<ChatScriptStep['kind'], number> = {
  qa: 5200,
  image: 5600,
  thinking: 5600,
  boundary: 6600,
  hook: 3600,
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
  const [activeProductId, setActiveProductId] = useState('chatgpt');
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingPrompt, setTypingPrompt] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const activeStep = chatScript[stepIndex];
  const activeProduct = chatbotProducts.find((product) => product.id === activeProductId) ?? chatbotProducts[2];
  const typedPrompt = useTypewriter(typingPrompt, 18);
  const typedReply = useTypewriter(replyDraft, 18);
  const showBoundary = activeStep.kind === 'boundary' || stepIndex > 3;
  const showHook = activeStep.kind === 'hook';

  useEffect(() => {
    setStepIndex(0);
    setMessages([]);
  }, []);

  useEffect(() => {
    const step = chatScript[stepIndex];
    setThinkingIndex(0);
    setTypingPrompt(step.prompt);
    setReplyDraft('');

    if (step.kind === 'hook') {
      setTypingPrompt('');
      if (playbackMode === 'manual') return;
      const timer = window.setTimeout(onEnterAgentWorld, 3100);
      return () => window.clearTimeout(timer);
    }

    const promptTimer = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `${step.id}-user`, role: 'user', text: step.prompt, imageTitle: step.imageTitle },
      ]);
      setTypingPrompt('');
    }, Math.min(1600, step.prompt.length * 18 + 280));

    const thinkingTimer = window.setInterval(() => {
      setThinkingIndex((current) => {
        const total = step.thinkingStates?.length ?? 1;
        return current + 1 >= total ? current : current + 1;
      });
    }, 780);

    const replyTimer = window.setTimeout(() => {
      setReplyDraft(step.reply);
    }, 2200);

    const commitReplyTimer = window.setTimeout(() => {
      setMessages((current) => [...current, { id: `${step.id}-assistant`, role: 'assistant', text: step.reply }]);
      setReplyDraft('');
    }, Math.min(stepDurations[step.kind] - 900, 2200 + step.reply.length * 18 + 450));

    const nextTimer = playbackMode === 'auto'
      ? window.setTimeout(() => {
          if (stepIndex < chatScript.length - 1) setStepIndex((current) => current + 1);
        }, stepDurations[step.kind])
      : undefined;

    return () => {
      window.clearTimeout(promptTimer);
      window.clearInterval(thinkingTimer);
      window.clearTimeout(replyTimer);
      window.clearTimeout(commitReplyTimer);
      if (nextTimer) window.clearTimeout(nextTimer);
    };
  }, [onEnterAgentWorld, playbackMode, stepIndex]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (showHook) {
      onEnterAgentWorld();
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
      <aside className={styles.productRail} aria-label="ChatBot 产品列表">
        <div className={styles.railHeader}>
          <Bot size={18} />
          <span>ChatBot 入口</span>
        </div>
        {chatbotProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            className={`${styles.productItem} ${product.id === activeProductId ? styles.productActive : ''}`}
            style={{ '--accent': product.accent } as React.CSSProperties}
            onClick={() => setActiveProductId(product.id)}
          >
            <span className={styles.productLogo}>{product.name.slice(0, 1)}</span>
            <span>
              <strong>{product.name}</strong>
              <small>{product.positioning}</small>
            </span>
          </button>
        ))}
        <div className={styles.chapterList}>
          <span>演示节奏</span>
          {chatScript.slice(0, 4).map((step, index) => (
            <button key={step.id} type="button" className={index <= stepIndex ? styles.chapterDone : ''}>
              {String(index + 1).padStart(2, '0')} {step.kind === 'boundary' ? '边界' : step.caption.slice(0, 8)}
            </button>
          ))}
        </div>
      </aside>

      <section className={`${styles.chatPanel} ${showHook ? styles.chatPanelReceded : ''}`}>
        <header className={styles.chatHeader}>
          <div>
            <span className={styles.windowDots}>
              <i />
              <i />
              <i />
            </span>
            <strong>{activeProduct.name} 模拟窗口</strong>
          </div>
          <span className={styles.headerBadge}>教学演示 Demo</span>
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

          {activeStep.kind !== 'hook' && !replyDraft ? (
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
            <span>{typedPrompt || '等待下一段演示...'}</span>
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
            <strong>你需要更高维度的力量。</strong>
            <button type="button" onClick={onEnterAgentWorld}>进入 Agent 世界</button>
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
