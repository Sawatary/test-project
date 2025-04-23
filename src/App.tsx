import React from "react";
import Timeline from "./components/Timeline";

const App: React.FC = () => {
  return (
    <div className="app">
      <Timeline periods={[]} />
    </div>
  );
};

export default App;
