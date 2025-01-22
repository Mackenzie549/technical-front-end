import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts as fetchPostsApi } from '../api/api';
import { RootState } from '../redux/store';
import { addPosts, setPage, setLoading, setHasMore } from '../redux/slices/postsSlice';

const useInfiniteLoading = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const page = useSelector((state: RootState) => state.posts.page);
  const hasMore = useSelector((state: RootState) => state.posts.hasMore);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts.length]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

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
