import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts as fetchPostsApi } from '../api/api';
import { RootState } from '../redux/store';
import { addPosts, setPage, setLoading, setHasMore } from '../redux/slices/postsSlice';

// One of the requirements was to implement infinite scrolling
// I made this hook to handle that logic and manage the posts state in the redux store
const useInfiniteLoading = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const page = useSelector((state: RootState) => state.posts.page);
  const hasMore = useSelector((state: RootState) => state.posts.hasMore);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // This function fetches posts from the API
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    dispatch(setLoading(true));

    try {
      const newPosts = await fetchPostsApi(page);
      if (newPosts.length === 0) {
        dispatch(setHasMore(false));
      } else {
        dispatch(addPosts(newPosts));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [page, loading, hasMore, dispatch]);

  // Fetch posts when the page loads
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts.length]);

  // Every time there is a new page, fetch more posts
  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  // Use an IntersectionObserver to detect when the loader is in view
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          dispatch(setPage(page + 1));
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.current.observe(loader.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, dispatch]);

  return { loader, posts, hasMore, loading };
};

export default useInfiniteLoading;
