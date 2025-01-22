import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import useWebSocket from "../hooks/useWebSocket";
import { setPosts } from "../redux/slices/postsSlice";
import { thunk } from "redux-thunk";

// Mock the Redux store and WebSocket
jest.mock("../redux/slices/postsSlice", () => ({
  setPosts: jest.fn(),
}));

describe("useWebSocket", () => {
  const mockStore = configureStore([thunk]);
  const mockUrl = "ws://localhost:8080";
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      posts: {
        posts: [
          {
            id: 1,
            name: "Test Post",
            image: "Test Image",
            instructions: ["Step 1", "Step 2", "Step 3"],
          },
        ],
      },
    });
    jest.clearAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should close WebSocket on unmount", () => {
    const mockWebSocket = {
      close: jest.fn(),
      onmessage: null as ((event: MessageEvent) => void) | null,
    };

    // Mock the WebSocket constructor
    global.WebSocket = jest.fn(() => mockWebSocket as any) as any;
    Object.defineProperty(global.WebSocket, "CONNECTING", { value: 0 });
    Object.defineProperty(global.WebSocket, "OPEN", { value: 1 });
    Object.defineProperty(global.WebSocket, "CLOSING", { value: 2 });
    Object.defineProperty(global.WebSocket, "CLOSED", { value: 3 });

    // Render the hook
    const { unmount } = renderHook(() => useWebSocket(mockUrl), { wrapper });

    // Unmount the hook
    unmount();

    // Assert that the WebSocket was closed
    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it("should handle invalid WebSocket message", () => {
    const mockWebSocket = {
      close: jest.fn(),
      onmessage: null as ((event: MessageEvent) => void) | null,
    };

    // Mock the WebSocket constructor
    global.WebSocket = jest.fn(() => mockWebSocket as any) as any;
    Object.defineProperty(global.WebSocket, "CONNECTING", { value: 0 });
    Object.defineProperty(global.WebSocket, "OPEN", { value: 1 });
    Object.defineProperty(global.WebSocket, "CLOSING", { value: 2 });
    Object.defineProperty(global.WebSocket, "CLOSED", { value: 3 });

    // Render the hook
    renderHook(() => useWebSocket(mockUrl), { wrapper });

    // Simulate receiving an invalid WebSocket message
    const invalidMessage = "{ invalid json }";
    act(() => {
      mockWebSocket.onmessage?.({
        data: invalidMessage,
      } as MessageEvent);
    });

    // Assert that no actions were dispatched
    expect(setPosts).not.toHaveBeenCalled();
  });
});
