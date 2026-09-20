import { SOCKET_ORIGIN, TOKEN_STORAGE_KEY } from '../utils/constants';

/**
 * Creates a managed WebSocket connection with auto-reconnection support.
 * @param {Function} onMessage - Callback invoked when a message is received.
 * @returns {Function} cleanup - Function to close the socket connection.
 */
export function connectProjectSocket(onMessage) {
  let socket = null;
  let reconnectTimer = null;
  let isClosedManually = false;

  function connect() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return;

    try {
      const url = `${SOCKET_ORIGIN}/ws/projects/?token=${encodeURIComponent(token)}`;
      socket = new WebSocket(url);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch {
          onMessage(event.data);
        }
      };

      socket.onclose = () => {
        if (!isClosedManually) {
          // Attempt reconnection after 3 seconds
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      socket.onerror = () => {
        socket?.close();
      };
    } catch (err) {
      console.error('Failed to establish WebSocket connection:', err);
    }
  }

  connect();

  return () => {
    isClosedManually = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (socket) socket.close();
  };
}
