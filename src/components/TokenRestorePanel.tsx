import { motion } from 'framer-motion';
import { BatteryWarning, CheckCircle2, Gauge, PauseCircle, RotateCw } from 'lucide-react';
import { agentOptions, modelOptions, tokenDemo } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './TokenRestorePanel.module.css';

type TokenRestorePanelProps = {
  selectedAgentId: string;
  selectedModelId: string;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onRestore: () => void;
};

export function TokenRestorePanel({
  selectedAgentId,
  selectedModelId,
  playbackMode,
  advanceSignal,
  onRestore,
}: TokenRestorePanelProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];
  const exhaustedTokenLabel = tokenDemo.exhaustedTokens.toLocaleString('en-US');
  const restoredTokenLabel = tokenDemo.restoredTokens.toLocaleString('en-US');

  useManualAdvance(playbackMode, advanceSignal, onRestore);

  return (
    <div className={styles.tokenStage} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <motion.section
        className={styles.pausedWorkbench}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <header>
          <span>{selectedAgent.badge}</span>
          <div>
            <strong>{selectedAgent.name}</strong>
            <small>{selectedModel.name} / Running → Paused</small>
          </div>
          <em>
            <PauseCircle size={16} />
            Paused
          </em>
        </header>
        <div className={styles.frozenConsole}>
          <code>$ move --by class --confirm</code>
          <code>$ report --summary 文件整理完成</code>
          <code className={styles.blink}>_</code>
        </div>
        <div className={styles.tokenCounter}>
          <div>
            <span>已消耗</span>
            <strong>{exhaustedTokenLabel}</strong>
            <small>token</small>
          </div>
          <div>
            <span>剩余</span>
            <strong>0</strong>
            <small>token</small>
          </div>
        </div>
        <div className={styles.pauseSeal}>
          <BatteryWarning size={28} />
          <strong>{tokenDemo.pausedMessage}</strong>
        </div>
      </motion.section>

      <motion.aside
        className={styles.restorePanel}
        initial={{ opacity: 0, x: 34 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className={styles.panelKicker}>
          <Gauge size={16} />
          Token Concept
        </span>
        <h1>{tokenDemo.title}</h1>
        <p>{tokenDemo.subtitle}</p>
        <div className={styles.restoreAmount}>
          <span>本次补充</span>
          <strong>+ {restoredTokenLabel}</strong>
          <small>token</small>
        </div>
        <div className={styles.factList}>
          {tokenDemo.facts.map((fact) => (
            <span key={fact}>
              <CheckCircle2 size={15} />
              {fact}
            </span>
          ))}
        </div>
        <button type="button" onClick={onRestore}>
          <RotateCw size={17} />
          {tokenDemo.restoreButton}
        </button>
      </motion.aside>
    </div>
  );
}
