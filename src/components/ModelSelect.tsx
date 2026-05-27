import { motion } from 'framer-motion';
import { BrainCircuit, CheckCircle2, Cpu, Route, Sparkles } from 'lucide-react';
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
        <p>Agent 像“执行身体”，大模型像“思考大脑”。Agent 要先接上大模型，才能理解任务、判断下一步、生成命令和总结结果。</p>
      </div>

      <div className={styles.layoutShell}>
        <aside className={styles.selectionPanel} aria-label="当前连接状态">
          <section className={styles.agentCore}>
            <span className={styles.agentBadge}>{selectedAgent.badge}</span>
            <div>
              <small>当前 Agent</small>
              <strong>{selectedAgent.name}</strong>
            </div>
            <i aria-hidden="true" />
            <div>
              <small>接入模型</small>
              <em>{selectedModel.name}</em>
            </div>
          </section>

          <section className={styles.brainIntro} aria-label="Agent 接入大模型说明">
            <div>
              <Cpu size={18} />
              <strong>Agent 负责执行</strong>
              <span>读文件、跑命令、移动结果、记录进度。</span>
            </div>
            <div>
              <BrainCircuit size={18} />
              <strong>大模型负责判断</strong>
              <span>理解目标，判断下一步，并生成可执行动作。</span>
            </div>
            <div>
              <Route size={18} />
              <strong>接上以后才完整</strong>
              <span>一个会想，一个会做，组合起来才是工作流。</span>
            </div>
          </section>

          <motion.div className={styles.embedPanel} layout>
            <span>模型核心已准备嵌入</span>
            <strong>{selectedModel.provider} · {selectedModel.region}</strong>
            <p>{selectedModel.positioning}</p>
            <button type="button" onClick={onConfirm}>
              <CheckCircle2 size={17} />
              进入 Agent 工作台
            </button>
          </motion.div>
        </aside>

        <section className={styles.modelCatalog} aria-label="大模型选择列表">
          <div className={styles.catalogHeader}>
            <div>
              <span>Model Catalog</span>
              <h2>选择模型大脑</h2>
            </div>
            <small>{modelOptions.length} 个候选模型</small>
          </div>

          <div className={styles.modelList}>
            {modelOptions.map((model) => {
              const isSelected = model.id === selectedModelId;
              return (
                <motion.button
                  key={model.id}
                  type="button"
                  className={`${styles.modelRow} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSelectModel(model.id)}
                  animate={isSelected ? { x: 4 } : { x: 0 }}
                >
                  <span className={styles.modelLogo} aria-hidden="true">{model.logoMark}</span>
                  <div className={styles.modelMain}>
                    <div className={styles.modelRowTop}>
                      <span className={styles.modelIdentity}>
                        <strong className={styles.modelName}>{model.name}</strong>
                        <small className={styles.provider}>{model.provider} · {model.region}</small>
                      </span>
                      <span className={styles.rankBadge}>
                        <Sparkles size={12} />
                        #{model.rank} · {model.rankNote}
                      </span>
                    </div>
                    <div className={styles.modelSummary}>
                      <p>{model.positioning}</p>
                      <div className={styles.strengths}>
                        {model.strengths.map((strength) => (
                          <span key={strength}>{strength}</span>
                        ))}
                      </div>
                    </div>
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
        </section>
      </div>
    </div>
  );
}
