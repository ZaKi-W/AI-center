import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings2, RotateCcw, SkipForward } from 'lucide-react';
import { AgentSelect } from './components/AgentSelect';
import { AgentWorkbench } from './components/AgentWorkbench';
import { ChatbotSimulator } from './components/ChatbotSimulator';
import { DimensionTransition } from './components/DimensionTransition';
import { IntroScreen } from './components/IntroScreen';
import { ModelSelect } from './components/ModelSelect';
import { SummaryPage } from './components/SummaryPage';
import { TokenRestorePanel } from './components/TokenRestorePanel';
import { appStages, defaultAgentId, defaultModelId, type AppStage } from './data/demoContent';
import styles from './App.module.css';

export default function App() {
  const [stage, setStage] = useState<AppStage>('intro');
  const [replayKey, setReplayKey] = useState(0);
  const [recordingMode, setRecordingMode] = useState(true);
  const [playbackMode, setPlaybackMode] = useState<'auto' | 'manual'>('manual');
  const [controlsOpen, setControlsOpen] = useState(false);
  const [advanceSignal, setAdvanceSignal] = useState(0);
  const [selectedAgentId, setSelectedAgentId] = useState(defaultAgentId);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [tokenRestored, setTokenRestored] = useState(false);

  const stageLabel = useMemo(() => {
    const labels: Record<AppStage, string> = {
      intro: '00 开场',
      chatbot: '01 ChatBOT',
      transition: '02 进入 Agent 世界',
      'agent-select': '03 Agent 选择',
      'model-select': '04 模型大脑',
      'agent-workbench': '05 Agent 工作台',
      'token-restore': '06 Token 恢复',
      summary: '07 总结',
    };
    return labels[stage];
  }, [stage]);

  const replay = () => {
    setStage('intro');
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
      <header className={styles.toolbar}>
        <div className={styles.controlDock}>
          <button
            type="button"
            className={styles.controlToggle}
            onClick={() => setControlsOpen((open) => !open)}
            aria-expanded={controlsOpen}
          >
            <Settings2 size={16} />
            <span>控制</span>
          </button>
          <AnimatePresence>
            {controlsOpen ? (
              <motion.div
                className={styles.toolbarActions}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
              >
                <div className={styles.stageStatus}>
                  <span className={styles.statusDot} />
                  <strong>{stageLabel}</strong>
                </div>
                <label className={styles.recordSwitch}>
                  <input
                    type="checkbox"
                    checked={recordingMode}
                    onChange={(event) => setRecordingMode(event.target.checked)}
                  />
                  演示模式
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
                <div className={styles.jumpGrid}>
                  {appStages.filter((targetStage) => !['intro', 'chatbot', 'transition'].includes(targetStage)).map((targetStage) => (
                    <button key={targetStage} type="button" onClick={() => setStage(targetStage)}>
                      {targetStage === 'agent-select'
                        ? 'Agent'
                        : targetStage === 'model-select'
                          ? '模型'
                          : targetStage === 'agent-workbench'
                            ? '工作台'
                            : targetStage === 'token-restore'
                              ? 'Token'
                              : '总结'}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
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
          {stage === 'intro' ? (
            <IntroScreen
              playbackMode={playbackMode}
              advanceSignal={advanceSignal}
              onStart={() => setStage('chatbot')}
            />
          ) : null}
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
              onComplete={() => setStage('summary')}
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
                setStage('agent-workbench');
              }}
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
    </main>
  );
}
