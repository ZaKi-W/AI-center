import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { summaryItems, type AppStage } from '../data/demoContent';
import styles from './SummaryPage.module.css';

type SummaryPageProps = {
  onReplay: () => void;
  onJump: (stage: AppStage) => void;
};

const jumpTargets: Array<{ label: string; stage: AppStage }> = [
  { label: '跳到 ChatBot', stage: 'chatbot' },
  { label: '跳到 Agent', stage: 'agent-select' },
  { label: '跳到 Token', stage: 'token-restore' },
  { label: '跳到 Skill', stage: 'skill-demo' },
  { label: '跳到 MCP', stage: 'mcp-demo' },
];

export function SummaryPage({ onReplay, onJump }: SummaryPageProps) {
  return (
    <div className={styles.summaryStage}>
      <header>
        <span>Workflow Recap</span>
        <h1>ChatBot → Agent → Model → Token → Skill → MCP</h1>
        <p>你平时用的是 ChatBot。真正进入工作流时，你会遇到 Agent、Model、Token、Skill 和 MCP。</p>
      </header>

      <section className={styles.chain}>
        {summaryItems.map((item, index) => (
          <motion.article
            key={item.term}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <strong>{item.term}</strong>
            <p>{item.description}</p>
          </motion.article>
        ))}
      </section>

      <footer>
        <button type="button" onClick={onReplay}>
          <RotateCcw size={16} />
          重播演示
        </button>
        {jumpTargets.map((target) => (
          <button key={target.stage} type="button" onClick={() => onJump(target.stage)}>
            {target.label}
          </button>
        ))}
      </footer>
    </div>
  );
}
