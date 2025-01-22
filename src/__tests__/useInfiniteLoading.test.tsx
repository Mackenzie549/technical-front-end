import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import useInfiniteLoading from "../hooks/useInfiniteLoading";
import { fetchPosts as fetchPostsApi } from "../api/api";
import React from "react";
import "intersection-observer";

jest.mock("../api/api", () => ({
  fetchPosts: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe("useInfiniteLoading", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      posts: {
        posts: [],
        page: 1,
        hasMore: true,
        loading: false,
      },
    });
    jest.clearAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should fetch posts on initial render", async () => {
    const mockPosts = [
      {
        id: 1,
        name: "Test Post",
        image: "Test Image",
        instructions: ["Step 1", "Step 2", "Step 3"],
      },
    ];

    (fetchPostsApi as jest.Mock).mockResolvedValueOnce(mockPosts);

    const { result } = renderHook(() => useInfiniteLoading(), { wrapper });

    // Wait for the fetchPostsApi call to complete and state updates to occur
    await waitFor(() => {
      expect(fetchPostsApi).toHaveBeenCalledWith(1);
    });

    expect(store.getActions()).toContainEqual({
      type: "posts/setLoading",
      payload: true,
    });
    expect(store.getActions()).toContainEqual({
      type: "posts/addPosts",
      payload: mockPosts,
    });
    expect(store.getActions()).toContainEqual({
      type: "posts/setLoading",
      payload: false,
    });
  });

  it("should update page when intersection observer triggers", () => {
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    // Mock IntersectionObserver
    window.IntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    })) as any;

    const { result } = renderHook(() => useInfiniteLoading(), { wrapper });

    // Simulate the IntersectionObserver callback
    act(() => {
      const entries = [{ isIntersecting: true }];
      (window.IntersectionObserver as jest.Mock).mock.calls[0][0](entries);
    });

    expect(store.getActions()).toContainEqual({
      type: "posts/setPage",
      payload: 2,
    });
    delete window.IntersectionObserver;
  });

  it("should not fetch posts if already loading", async () => {
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    })) as any;

    store = mockStore({
      posts: {
        posts: [],
        page: 1,
        hasMore: true,
        loading: true,
      },
    });

    const { result } = renderHook(() => useInfiniteLoading(), { wrapper });

    act(() => {
        const entries = [{ isIntersecting: true }];
        (window.IntersectionObserver as jest.Mock).mock.calls[0][0](entries);
      });

    expect(fetchPostsApi).not.toHaveBeenCalled();
  });

  it("should not fetch posts if there are no more posts", async () => {
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    window.IntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    })) as any;

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
        page: 1,
        hasMore: false,
        loading: false,
      },
    });

    const { result } = renderHook(() => useInfiniteLoading(), { wrapper });

    act(() => {
      const entries = [{ isIntersecting: true }];
      (window.IntersectionObserver as jest.Mock).mock.calls[0][0](entries);
    });

    expect(fetchPostsApi).not.toHaveBeenCalled();
  });
});
