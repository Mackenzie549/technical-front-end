import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/slices/postsSlice";
import { Post } from "../types";
import { RootState } from "../redux/store";

const useWebSocket = (url: string) => {
  const dispatch = useDispatch();
  const [highlightedPostId, setHighlightedPostId] = useState<number | null>(
    null
  );

  // Select current posts from the Redux store
  const posts = useSelector((state: RootState) => state.posts.posts);

  const handleNewPost = useCallback(
    (newPost: Post) => {
      dispatch(setPosts([newPost, ...posts])); // Use current posts state
      setHighlightedPostId(newPost.id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setHighlightedPostId(null);
      }, 3000); // Highlight for 3 seconds
    },
    [dispatch, posts]
  );

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      try {
        const newPost = JSON.parse(event.data);
        handleNewPost(newPost);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => {
      ws.close();
    };
  }, [url, handleNewPost]);

  return { highlightedPostId };
};

export default useWebSocket;
