import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowRight, Braces, FolderTree, MonitorCog, TerminalSquare } from 'lucide-react';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './DimensionTransition.module.css';

export function DimensionTransition({
  playbackMode,
  advanceSignal,
  onContinue,
}: {
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onContinue: () => void;
}) {
  const panels = [
    { icon: FolderTree, label: '文件树' },
    { icon: TerminalSquare, label: '终端' },
    { icon: MonitorCog, label: '浏览器预览' },
    { icon: Braces, label: '任务日志' },
  ];

  useManualAdvance(playbackMode, advanceSignal, onContinue);

  return (
    <div className={styles.transitionStage}>
      <div className={styles.dataTunnel}>
        {Array.from({ length: 18 }).map((_, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -180, scale: 0.7 }}
            animate={{ opacity: [0, 1, 0], x: 180, scale: [0.7, 1.15, 0.9] }}
            transition={{ repeat: Infinity, duration: 2.6, delay: index * 0.11 }}
          />
        ))}
      </div>

      <motion.div
        className={styles.centerCopy}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span>ChatBot 的气泡正在变成任务流</span>
        <h1>进入 Agent 世界</h1>
        <p>接下来会出现任务窗口、终端、文件树和浏览器面板，AI 不只回答，而是开始执行。</p>
        <button type="button" onClick={onContinue}>
          <ArrowRight size={16} />
          选择 Agent
        </button>
      </motion.div>

      <div className={styles.panelCloud}>
        {panels.map((panel, index) => {
          const Icon = panel.icon;
          return (
            <motion.div
              key={panel.label}
              className={styles.floatingPanel}
              initial={{ opacity: 0, y: 46, rotate: index % 2 ? 5 : -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.35 + index * 0.16 }}
            >
              <Icon size={20} />
              <span>{panel.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
