import { motion } from 'framer-motion';
import { Play, RadioTower, Workflow } from 'lucide-react';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './IntroScreen.module.css';

type IntroScreenProps = {
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onStart: () => void;
};

export function IntroScreen({ playbackMode, advanceSignal, onStart }: IntroScreenProps) {
  useManualAdvance(playbackMode, advanceSignal, onStart);

  return (
    <div className={styles.introStage}>
      <motion.section
        className={styles.heroPanel}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className={styles.kicker}>
          <RadioTower size={16} />
          AI 工作流演示 Demo
        </span>
        <h1>写实仿真 AI 工作流演示</h1>
        <p>
          从聊天机器人(ChatBOT)的对话能力开始，逐步进入 Agent、Model、Token、Skill 和 MCP 的完整工作流。
        </p>
        <button type="button" onClick={onStart}>
          <Play size={18} />
          开始演示
        </button>
        {playbackMode === 'manual' ? <small>也可以按 Space / Enter / → 开始</small> : null}
      </motion.section>

      <motion.aside
        className={styles.flowPreview}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.16, duration: 0.55 }}
      >
        <span>
          <Workflow size={16} />
          本次演示路径
        </span>
        {['聊天机器人(ChatBOT)', 'Agent', 'Model', 'Token', 'Skill', 'MCP', '总结'].map((item, index) => (
          <div key={item}>
            <i>{String(index + 1).padStart(2, '0')}</i>
            <strong>{item}</strong>
          </div>
        ))}
      </motion.aside>
    </div>
  );
}
