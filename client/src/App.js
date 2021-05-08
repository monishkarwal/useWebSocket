import React from "react";

import Header from "./components/Header";
import Visualizer from "./components/Visualizer";

import useWebSocket from "./hooks/useWebSocket";

function App() {
  const {
    connect,
    state: { isLoading, isConnected, data, socket, error },
  } = useWebSocket("ws://localhost:8080");

  return (
    <div className="App">
      <Header
        connect={connect}
        isLoading={isLoading}
        isConnected={isConnected}
        error={error}
      />
      <Visualizer socket={socket} data={data} isConnected={isConnected} />
    </div>
  );
}

export default App;
