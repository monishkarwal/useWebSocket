import React, { useState, useEffect } from "react";
import { Button, Container } from "semantic-ui-react";

const Visualizer = ({ socket, data, isConnected }) => {
  const [receivedData, setReceivedData] = useState([]);

  const startTask = () => {
    socket.send(JSON.stringify({ type: "start-task" }));
  };

  const endTask = () => {
    socket.send(JSON.stringify({ type: "end-task" }));
  };

  useEffect(() => {
    if (data) {
      let temp = receivedData;
      temp.push(data);
      setReceivedData(temp);
    }
  }, [data, receivedData]);

  return (
    <Container style={{ margin: "2rem" }}>
      <div>
        <Button primary disabled={!isConnected} onClick={() => startTask()}>
          Start
        </Button>
        <Button primary disabled={!isConnected} onClick={() => endTask()}>
          End
        </Button>
      </div>
      <div>
        {receivedData.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </div>
    </Container>
  );
};

export default Visualizer;
