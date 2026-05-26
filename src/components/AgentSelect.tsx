import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { agentOptions, defaultAgentId } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './AgentSelect.module.css';

type AgentSelectProps = {
  selectedAgentId: string;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onSelectAgent: (agentId: string) => void;
  onConfirm: () => void;
};

export function AgentSelect({ selectedAgentId, playbackMode, advanceSignal, onSelectAgent, onConfirm }: AgentSelectProps) {
  const [autoIndex, setAutoIndex] = useState(0);
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];

  useEffect(() => {
    if (playbackMode === 'manual') return;
    const timers = agentOptions.map((agent, index) =>
      window.setTimeout(() => {
        setAutoIndex(index);
        onSelectAgent(index === agentOptions.length - 1 ? defaultAgentId : agent.id);
      }, 520 + index * 520),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [onSelectAgent, playbackMode]);

  useManualAdvance(playbackMode, advanceSignal, onConfirm);

  return (
    <div className={styles.agentStage}>
      <div className={styles.stageHeader}>
        <span>
          <Sparkles size={16} />
          Agent World
        </span>
        <h1>欢迎来到 Agent 的世界</h1>
        <p>请选择你的 Agent。它们代表能接任务、拆步骤、调用工具并推进结果的执行形态。</p>
      </div>

      <div className={styles.agentGrid} aria-label="Agent 选择">
        {agentOptions.map((agent, index) => {
          const isSelected = agent.id === selectedAgentId;
          const isScanning = index === autoIndex;
          return (
            <motion.button
              key={agent.id}
              type="button"
              className={`${styles.agentCard} ${isSelected ? styles.selected : ''} ${isScanning ? styles.scanning : ''}`}
              style={{ '--agent-color': agent.themeColor } as React.CSSProperties}
              onClick={() => onSelectAgent(agent.id)}
              animate={isSelected ? { scale: 1.035 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <span className={styles.agentBadge}>{agent.badge}</span>
              <strong>{agent.name}</strong>
              <p>{agent.description}</p>
              <span className={styles.tagList}>
                {agent.tags.map((tag) => (
                  <i key={tag}>{tag}</i>
                ))}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.aside
        className={styles.confirmPanel}
        style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}
        key={selectedAgent.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.confirmBadge}>
          <Cpu size={18} />
          已选择 {selectedAgent.name}
        </div>
        <p>{selectedAgent.logVoice}</p>
        <button type="button" onClick={onConfirm}>
          <CheckCircle2 size={17} />
          使用这个 Agent
        </button>
      </motion.aside>
    </div>
  );
}
