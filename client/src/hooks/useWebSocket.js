import { useReducer } from "react";

const useWebSocket = (URL) => {
  if (!URL) {
    throw new Error("Please include URL as an argument!");
  }

  const socketReducer = (state, action) => {
    switch (action.type) {
      case "CONNECT":
        return { ...state, isLoading: true };

      case "CLOSED":
        return {
          ...state,
          socket: null,
          isLoading: false,
          isConnected: false,
          error: true,
        };

      case "CONNECTION_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isConnected: true,
          error: false,
          socket: action.payload,
        };

      case "MESSAGE":
        return { ...state, data: action.payload };

      case "CONNECTION_ERROR":
        return {
          ...state,
          socket: null,
          isLoading: false,
          isConnected: false,
          error: true,
        };

      default:
        throw new Error("Action not supported");
    }
  };

  const initialState = {
    socket: null,
    isConnected: false,
    isLoading: false,
    error: false,
    data: null,
  };

  const [state, dispatch] = useReducer(socketReducer, initialState);

  const connect = () => {
    dispatch({ type: "CONNECT" });
    let socketConnection = new WebSocket(URL);

    socketConnection.onopen = () => {
      console.log("[Web Socket]: Connected!");
      dispatch({ type: "CONNECTION_SUCCESS", payload: socketConnection });
      // Setup timeout to check connection status

      socketConnection.pingTimeout = setTimeout(() => {
        socketConnection.close();
      }, 31000);
    };

    // Use this as middleware
    socketConnection.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case "ping":
          console.log("[Web Socket]: Ping");
          clearTimeout(socketConnection.pingTimeout);
          socketConnection.pingTimeout = setTimeout(() => {
            socketConnection.close();
          }, 31000);
          socketConnection.send(JSON.stringify({ type: "pong" }));
          break;
        default:
          dispatch({ type: "MESSAGE", payload: data.data });
      }
    };

    socketConnection.onclose = () => {
      console.log("[Web Socket]: Closed!");
      dispatch({ type: "CLOSED" });
    };

    socketConnection.onerror = (error) => {
      console.log("[Web Socket]: Error");
      console.error(error);
      dispatch({ type: "CONNECTION_ERROR" });
    };
  };

  return { connect, state };
};

export default useWebSocket;
