import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cable, CheckCircle2, PlugZap, Unplug } from 'lucide-react';
import { agentOptions, mcpDemo, modelOptions } from '../data/demoContent';
import { useManualAdvance } from '../hooks/useManualAdvance';
import styles from './MCPDemo.module.css';

type MCPDemoProps = {
  selectedAgentId: string;
  selectedModelId: string;
  playbackMode: 'auto' | 'manual';
  advanceSignal: number;
  onContinue: () => void;
};

export function MCPDemo({
  selectedAgentId,
  selectedModelId,
  playbackMode,
  advanceSignal,
  onContinue,
}: MCPDemoProps) {
  const selectedAgent = agentOptions.find((agent) => agent.id === selectedAgentId) ?? agentOptions[1];
  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? modelOptions[0];
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(false);
  }, [selectedAgentId, selectedModelId]);

  useManualAdvance(playbackMode, advanceSignal, () => {
    if (!connected) {
      setConnected(true);
      return;
    }
    onContinue();
  });

  return (
    <div className={styles.mcpStage} style={{ '--agent-color': selectedAgent.themeColor } as React.CSSProperties}>
      <header className={styles.mcpHeader}>
        <span>
          <PlugZap size={16} />
          MCP Connector
        </span>
        <h1>{mcpDemo.title}</h1>
        <p>{mcpDemo.explanation}</p>
      </header>

      <section className={styles.mcpWorkspace}>
        <aside className={styles.agentNode}>
          <span>{selectedAgent.badge}</span>
          <strong>{selectedAgent.name}</strong>
          <small>{selectedModel.name}</small>
          <p>{mcpDemo.task}</p>
        </aside>

        <div className={styles.connectorArea}>
          <div className={`${styles.cableField} ${connected ? styles.connected : ''}`}>
            {mcpDemo.tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                className={styles.toolNode}
                animate={connected ? { x: 0, opacity: 1 } : { x: index % 2 ? 20 : -20, opacity: 0.52 }}
              >
                {connected ? <CheckCircle2 size={18} /> : <Unplug size={18} />}
                {tool.name}
              </motion.div>
            ))}
            <motion.div
              className={styles.mcpHub}
              animate={connected ? { scale: 1.08, boxShadow: '0 0 70px rgba(127, 205, 182, 0.32)' } : { scale: 1 }}
            >
              <Cable size={30} />
              <strong>MCP</strong>
              <span>统一接口</span>
            </motion.div>
          </div>
        </div>

        <aside className={styles.logPanel}>
          <span>连接日志</span>
          <motion.p key={connected ? 'success' : 'fail'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {connected ? mcpDemo.successLog : mcpDemo.failureLog}
          </motion.p>
          {connected ? (
            <button type="button" onClick={onContinue}>进入总结页</button>
          ) : (
            <button type="button" onClick={() => setConnected(true)}>{mcpDemo.connectButton}</button>
          )}
        </aside>
      </section>
    </div>
  );
}
