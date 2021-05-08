import React from "react";
import { Button, Container, Message } from "semantic-ui-react";

const Header = ({ connect, isLoading, isConnected, error }) => {
  return (
    <Container>
      <div style={{ margin: "2rem" }}>
        <Button
          size="large"
          loading={isLoading}
          primary
          disabled={isConnected}
          onClick={() => {
            connect();
          }}
        >
          Connect
        </Button>
      </div>
      <Message color="black">
        <Message.Header>Connection Info</Message.Header>
        <Message.Content style={{ padding: "1rem" }}>
          <p>Loading: {isLoading ? "True" : "False"}</p>
          <p>Error: {error ? "True" : "False"}</p>
          <p>Connection: {isConnected ? "Connected" : "Not Connected"}</p>
        </Message.Content>
      </Message>
    </Container>
  );
};

export default Header;
