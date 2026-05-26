import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, FileSpreadsheet, Folder, ListChecks, TerminalSquare } from 'lucide-react';
import { agentOptions, fileTaskSteps, modelOptions } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './AgentWorkbench.module.css';

type AgentWorkbenchProps = {
  selectedAgentId: string;
  selectedModelId: string;
  tokenRestored: boolean;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onTokenDepleted: () => void;
};

const finalFiles = [
  { folder: '一班', file: '一班_林知夏_报名表.xlsx' },
  { folder: '二班', file: '二班_周亦辰_报名表.xlsx' },
  { folder: '三班', file: '三班_许安宁_报名表.xlsx' },
];

export function AgentWorkbench({
  selectedAgentId,
  selectedModelId,
  tokenRestored,
  playbackMode,
  advanceSignal,
  onTokenDepleted,
}: AgentWorkbenchProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];
  const [stepIndex, setStepIndex] = useState(0);
  const activeStep = fileTaskSteps[stepIndex];

  useEffect(() => {
    setStepIndex(tokenRestored ? fileTaskSteps.length - 1 : 0);
    if (playbackMode === 'manual') return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => (current >= fileTaskSteps.length - 1 ? current : current + 1));
    }, 1450);
    return () => window.clearInterval(timer);
  }, [playbackMode, selectedAgentId, selectedModelId, tokenRestored]);

  useEffect(() => {
    if (playbackMode === 'manual') return;
    if (tokenRestored || stepIndex < fileTaskSteps.length - 1) return;
    const timer = window.setTimeout(onTokenDepleted, 1350);
    return () => window.clearTimeout(timer);
  }, [onTokenDepleted, playbackMode, stepIndex, tokenRestored]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (stepIndex < fileTaskSteps.length - 1) {
      setStepIndex((current) => Math.min(current + 1, fileTaskSteps.length - 1));
      return;
    }
    if (!tokenRestored) onTokenDepleted();
  });

  const visibleSteps = useMemo(() => fileTaskSteps.slice(0, stepIndex + 1), [stepIndex]);
  const foldersReady = stepIndex >= 3;
  const filesMoved = stepIndex >= 5;

  return (
    <div className={styles.workbench} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <header className={styles.workbenchTop}>
        <div className={styles.agentIdentity}>
          <span>{selectedAgent.badge}</span>
          <div>
            <strong>{selectedAgent.name}</strong>
            <small>{selectedModel.name} / 整理桌面报名表</small>
          </div>
        </div>
        <div className={`${styles.tokenMeter} ${tokenRestored ? styles.tokenRestored : ''}`}>
          <span>演示 Token</span>
          <i><b style={{ width: tokenRestored ? '100%' : `${Math.max(0, 86 - stepIndex * 14)}%` }} /></i>
          <em>{tokenRestored ? '100%' : `${Math.max(0, 86 - stepIndex * 14)}%`}</em>
        </div>
      </header>

      <aside className={styles.fileTree}>
        <h2>
          <Folder size={17} />
          桌面文件
        </h2>
        <div className={styles.folderBlock}>
          <strong>未分类</strong>
          {filesMoved ? <small>已清空</small> : ['报名表_1.xlsx', '报名表_2.xlsx', '报名表_3.xlsx'].map((file) => (
            <motion.span key={file} animate={stepIndex >= 4 ? { x: [0, 10, 0], opacity: 0.68 } : {}}>
              <FileSpreadsheet size={14} />
              {file}
            </motion.span>
          ))}
        </div>
        {foldersReady ? (
          <div className={styles.folderGrid}>
            {finalFiles.map((item, index) => (
              <motion.div key={item.folder} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <strong>{item.folder}</strong>
                {filesMoved ? <span><FileSpreadsheet size={14} />{item.file}</span> : <small>等待移动</small>}
              </motion.div>
            ))}
          </div>
        ) : null}
      </aside>

      <section className={styles.taskBoard}>
        <div className={styles.taskHeader}>
          <span>
            <ListChecks size={18} />
            当前任务
          </span>
          <strong>按班级分类、批量重命名，并移动到对应文件夹。</strong>
        </div>
        <div className={styles.progressTrack}>
          <motion.b animate={{ width: `${activeStep.progress}%` }} />
        </div>
        <div className={styles.stepTimeline}>
          {fileTaskSteps.map((step, index) => (
            <div key={step.id} className={index <= stepIndex ? styles.stepDone : ''}>
              <CheckCircle2 size={16} />
              <span>{step.title}</span>
            </div>
          ))}
        </div>
      </section>

      <aside className={styles.logPanel}>
        <h2>
          <Activity size={17} />
          执行日志
        </h2>
        <p className={styles.agentVoice}>{selectedAgent.logVoice}</p>
        {visibleSteps.map((step) => (
          <motion.div key={step.id} className={styles.logLine} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
            <span>{step.kind}</span>
            <p>{step.log}</p>
          </motion.div>
        ))}
      </aside>

      <footer className={styles.terminal}>
        <span>
          <TerminalSquare size={16} />
          terminal
        </span>
        {visibleSteps.map((step) => (
          <motion.code key={step.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {step.terminal}
          </motion.code>
        ))}
        {tokenRestored ? (
          <motion.code initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            $ continue --from paused-task --status running
          </motion.code>
        ) : null}
      </footer>
    </div>
  );
}
