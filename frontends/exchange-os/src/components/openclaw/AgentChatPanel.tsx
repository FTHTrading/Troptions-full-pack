export function AgentChatPanel() {
  return (
    <section className="openclaw-panel">
      <h3>Agent Chat</h3>
      <p>Chat is simulation-safe. Agents cannot approve, sign, settle, transfer funds, or enable live execution.</p>
      <div className="openclaw-chatbox">
        <p>Ask: &quot;What is broken on the site?&quot;</p>
        <p>Ask: &quot;What x402 routes are ready?&quot;</p>
        <p>Ask: &quot;Draft a remediation checklist.&quot;</p>
      </div>
    </section>
  );
}
