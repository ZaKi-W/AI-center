import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, ScanLine, SkipForward } from 'lucide-react';
import { AgentSelect } from './components/AgentSelect';
import { AgentWorkbench } from './components/AgentWorkbench';
import { ChatbotSimulator } from './components/ChatbotSimulator';
import { DimensionTransition } from './components/DimensionTransition';
import { MCPDemo } from './components/MCPDemo';
import { ModelSelect } from './components/ModelSelect';
import { SkillDemo } from './components/SkillDemo';
import { SummaryPage } from './components/SummaryPage';
import { TokenRestorePanel } from './components/TokenRestorePanel';
import { appStages, defaultAgentId, defaultModelId, type AppStage } from './data/demoContent';
import styles from './App.module.css';

export default function App() {
  const [stage, setStage] = useState<AppStage>('chatbot');
  const [replayKey, setReplayKey] = useState(0);
  const [recordingMode, setRecordingMode] = useState(true);
  const [playbackMode, setPlaybackMode] = useState<'auto' | 'manual'>('auto');
  const [advanceSignal, setAdvanceSignal] = useState(0);
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [tokenRestored, setTokenRestored] = useState(false);

  const stageLabel = useMemo(() => {
    const labels: Record<AppStage, string> = {
      chatbot: '01 ChatBot 幕',
      transition: '02 进入 Agent 世界',
      'agent-select': '03 Agent 选择',
      'model-select': '04 模型大脑',
      'agent-workbench': '05 Agent 工作台',
      'token-restore': '06 Token 恢复',
      'skill-demo': '07 Skill 对比',
      'mcp-demo': '08 MCP 连接',
      summary: '09 总结',
    };
    return labels[stage];
  }, [stage]);

  const replay = () => {
    setStage('chatbot');
    setTokenRestored(false);
    setReplayKey((key) => key + 1);
  };

  const advanceManualStep = () => {
    setAdvanceSignal((signal) => signal + 1);
  };

  useEffect(() => {
    if (playbackMode !== 'manual') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ([' ', 'Enter', 'ArrowRight', 'n', 'N'].includes(event.key)) {
        event.preventDefault();
        advanceManualStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackMode]);

  return (
    <main className={styles.appShell}>
      <div className={styles.safeFrame} aria-hidden="true" />
      <header className={styles.toolbar}>
        <div className={styles.brandBlock}>
          <span className={styles.statusDot} />
          <span>AI Workflow Demo</span>
          <strong>{stageLabel}</strong>
        </div>
        <div className={styles.toolbarActions}>
          <label className={styles.recordSwitch}>
            <input
              type="checkbox"
              checked={recordingMode}
              onChange={(event) => setRecordingMode(event.target.checked)}
            />
            录屏模式
          </label>
          <label className={styles.recordSwitch}>
            <input
              type="checkbox"
              checked={playbackMode === 'manual'}
              onChange={(event) => setPlaybackMode(event.target.checked ? 'manual' : 'auto')}
            />
            手动模式
          </label>
          {playbackMode === 'manual' ? (
            <button type="button" className={styles.nextStepButton} onClick={advanceManualStep}>
              下一步
              <span>Space / Enter / →</span>
            </button>
          ) : null}
          <button type="button" onClick={replay}>
            <RotateCcw size={16} />
            重播
          </button>
          <button type="button" onClick={() => setStage('transition')}>
            <SkipForward size={16} />
            跳到转场
          </button>
          {appStages.slice(2).map((targetStage) => (
            <button key={targetStage} type="button" onClick={() => setStage(targetStage)}>
              {targetStage === 'agent-select'
                ? 'Agent'
                : targetStage === 'model-select'
                  ? '模型'
                  : targetStage === 'agent-workbench'
                    ? '工作台'
                    : targetStage === 'token-restore'
                      ? 'Token'
                      : targetStage === 'skill-demo'
                        ? 'Skill'
                        : targetStage === 'mcp-demo'
                          ? 'MCP'
                          : '总结'}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={`${stage}-${stage === 'chatbot' ? replayKey : ''}`}
          className={styles.stage}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
          transition={{ duration: 0.45 }}
        >
          {stage === 'chatbot' ? (
            <ChatbotSimulator
              recordingMode={recordingMode}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onEnterAgentWorld={() => setStage('transition')}
            />
          ) : null}
          {stage === 'transition' ? (
            <DimensionTransition
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onContinue={() => setStage('agent-select')}
            />
          ) : null}
          {stage === 'agent-select' ? (
            <AgentSelect
              selectedAgentId={selectedAgentId}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onSelectAgent={setSelectedAgentId}
              onConfirm={() => setStage('model-select')}
            />
          ) : null}
          {stage === 'model-select' ? (
            <ModelSelect
              selectedAgentId={selectedAgentId}
              selectedModelId={selectedModelId}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onSelectModel={setSelectedModelId}
              onConfirm={() => {
                setTokenRestored(false);
                setStage('agent-workbench');
              }}
            />
          ) : null}
          {stage === 'agent-workbench' ? (
            <AgentWorkbench
              selectedAgentId={selectedAgentId}
              selectedModelId={selectedModelId}
              tokenRestored={tokenRestored}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onTokenDepleted={() => setStage('token-restore')}
            />
          ) : null}
          {stage === 'token-restore' ? (
            <TokenRestorePanel
              selectedAgentId={selectedAgentId}
              selectedModelId={selectedModelId}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onRestore={() => {
                setTokenRestored(true);
                setStage('skill-demo');
              }}
            />
          ) : null}
          {stage === 'skill-demo' ? (
            <SkillDemo
              selectedAgentId={selectedAgentId}
              selectedModelId={selectedModelId}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onContinue={() => setStage('mcp-demo')}
            />
          ) : null}
          {stage === 'mcp-demo' ? (
            <MCPDemo
              selectedAgentId={selectedAgentId}
              selectedModelId={selectedModelId}
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onContinue={() => setStage('summary')}
            />
          ) : null}
          {stage === 'summary' ? (
            <SummaryPage
              onReplay={replay}
              onJump={(targetStage) => setStage(targetStage)}
            />
          ) : null}
        </motion.section>
      </AnimatePresence>

      <div className={styles.scanBar}>
        <ScanLine size={14} />
        中央 9:16 裁切安全区已保留关键字幕与聊天主体
      </div>
    </main>
  );
}
