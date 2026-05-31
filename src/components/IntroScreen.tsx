import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';
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
        <h1>AI名词科普</h1>
        <p>
          从 ChatBOT（聊天机器人）的对话能力开始，逐步进入 Agent（智能体）、Model（大模型）、Token（词元）、Skill（技能）和 MCP（模型上下文协议）的完整工作流。
        </p>
        <button type="button" onClick={onStart}>
          <Play size={18} />
          开始演示
          <ChevronRight size={16} />
        </button>
      </motion.section>
    </div>
  );
}
