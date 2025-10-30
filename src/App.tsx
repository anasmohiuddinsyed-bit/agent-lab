import React, { useState } from "react";

export default function App() {
  const [goal, setGoal] = useState("Read the main content of this page and summarize it.");
  const [steps, setSteps] = useState<string[]>([]);
  const runAgent = async () => {
    setSteps(["Thinking...", "Fetching data...", "Done!"]);
  };
  return (
    <div style={{padding:"2rem",background:"#0f172a",color:"white",minHeight:"100vh"}}>
      <h1>BrowserOS Agent Lab</h1>
      <textarea value={goal} onChange={e=>setGoal(e.target.value)} style={{width:"100%",height:"100px"}}/>
      <button onClick={runAgent}>Run Agent</button>
      <ul>{steps.map((s,i)=><li key={i}>{s}</li>)}</ul>
    </div>
  );
}
