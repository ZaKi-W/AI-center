import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Zap } from 'lucide-react';
import { agentOptions, modelOptions } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './ModelSelect.module.css';

type ModelSelectProps = {
  selectedAgentId: string;
  selectedModelId: string;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onSelectModel: (modelId: string) => void;
  onConfirm: () => void;
};

const barLabels = {
  reasoning: '理解',
  coding: '代码',
  multimodal: '多模态',
  speed: '速度',
};

export function ModelSelect({
  selectedAgentId,
  selectedModelId,
  playbackMode,
  advanceSignal,
  onSelectModel,
  onConfirm,
}: ModelSelectProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];

  useManualAdvance(playbackMode, advanceSignal, onConfirm);

  return (
    <div className={styles.modelStage} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <div className={styles.modelHeader}>
        <span>
          <BrainCircuit size={16} />
          Model Brain
        </span>
        <h1>为你的 Agent 挑选一个合适的大脑吧</h1>
        <p>Agent 负责执行，模型负责理解、判断和生成。以下内容仅用于演示，不做权威排名。</p>
      </div>

      <div className={styles.agentCore}>
        <span>{selectedAgent.badge}</span>
        <strong>{selectedAgent.name}</strong>
        <i />
        <em>{selectedModel.name}</em>
      </div>

      <div className={styles.modelGrid}>
        {modelOptions.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <motion.button
              key={model.id}
              type="button"
              className={`${styles.modelCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectModel(model.id)}
              animate={isSelected ? { y: -6 } : { y: 0 }}
            >
              <span className={styles.modelName}>
                <Zap size={15} />
                {model.name}
              </span>
              <p>{model.positioning}</p>
              <div className={styles.strengths}>
                {model.strengths.map((strength) => (
                  <span key={strength}>{strength}</span>
                ))}
              </div>
              <div className={styles.bars}>
                {Object.entries(model.bars).map(([key, value]) => (
                  <label key={key}>
                    <span>{barLabels[key as keyof typeof barLabels]}</span>
                    <i>
                      <b style={{ width: `${value}%` }} />
                    </i>
                  </label>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div className={styles.embedPanel} layout>
        <span>模型核心嵌入中</span>
        <strong>{selectedModel.name} → {selectedAgent.name}</strong>
        <button type="button" onClick={onConfirm}>
          <CheckCircle2 size={17} />
          进入 Agent 工作台
        </button>
      </motion.div>
    </div>
  );
}
