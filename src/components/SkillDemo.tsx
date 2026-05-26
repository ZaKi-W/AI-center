import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, PenLine, Sparkles, Wand2 } from 'lucide-react';
import { agentOptions, modelOptions, skillDemo } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './SkillDemo.module.css';

type SkillDemoProps = {
  selectedAgentId: string;
  selectedModelId: string;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onContinue: () => void;
};

export function SkillDemo({
  selectedAgentId,
  selectedModelId,
  playbackMode,
  advanceSignal,
  onContinue,
}: SkillDemoProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];
  const [phase, setPhase] = useState<'plain' | 'selecting' | 'skilled'>('plain');

  useEffect(() => {
    setPhase('plain');
    if (playbackMode === 'manual') return;
    const timers = [
      window.setTimeout(() => setPhase('selecting'), 1900),
      window.setTimeout(() => setPhase('skilled'), 3700),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [playbackMode, selectedAgentId, selectedModelId]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (phase === 'plain') {
      setPhase('selecting');
      return;
    }
    if (phase === 'selecting') {
      setPhase('skilled');
      return;
    }
    onContinue();
  });

  return (
    <div className={styles.skillStage} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <header className={styles.skillHeader}>
        <span>
          <Wand2 size={16} />
          Skill Upgrade
        </span>
        <h1>Skill 让 Agent 更专业</h1>
        <p>{skillDemo.explanation}</p>
      </header>

      <aside className={styles.agentStrip}>
        <span>{selectedAgent.badge}</span>
        <strong>{selectedAgent.name}</strong>
        <i>{selectedModel.name}</i>
        <em>任务：短视频口播稿优化</em>
      </aside>

      <section className={styles.promptPanel}>
        <span>
          <PenLine size={16} />
          专业任务
        </span>
        <strong>{skillDemo.prompt}</strong>
      </section>

      <section className={styles.compareGrid}>
        <ResultCard
          tone="plain"
          active={phase === 'plain' || phase === 'selecting' || phase === 'skilled'}
          title={skillDemo.plainResult.title}
          content={skillDemo.plainResult.content}
          tags={skillDemo.plainResult.tags}
        />

        <div className={styles.skillPicker}>
          <span>选择一个专业 Skill</span>
          {skillDemo.skills.map((skill) => {
            const selected = skill.id === skillDemo.selectedSkillId && phase !== 'plain';
            return (
              <motion.div
                key={skill.id}
                className={selected ? styles.skillSelected : ''}
                animate={selected ? { scale: 1.04 } : { scale: 1 }}
              >
                {selected ? <CheckCircle2 size={15} /> : <Sparkles size={15} />}
                {skill.name}
              </motion.div>
            );
          })}
        </div>

        <ResultCard
          tone="skilled"
          active={phase === 'skilled'}
          title={skillDemo.skilledResult.title}
          content={skillDemo.skilledResult.content}
          tags={skillDemo.skilledResult.tags}
        />
      </section>

      <button className={styles.nextButton} type="button" onClick={onContinue}>
        继续连接专业工具
      </button>
    </div>
  );
}

function ResultCard({
  active,
  title,
  content,
  tags,
  tone,
}: {
  active: boolean;
  title: string;
  content: string;
  tags: string[];
  tone: 'plain' | 'skilled';
}) {
  return (
    <motion.article
      className={`${styles.resultCard} ${tone === 'skilled' ? styles.skilled : styles.plain} ${active ? styles.active : ''}`}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0.36, y: 12 }}
    >
      <span>{title}</span>
      <p>{content}</p>
      <div>
        {tags.map((tag) => (
          <i key={tag}>{tag}</i>
        ))}
      </div>
    </motion.article>
  );
}
