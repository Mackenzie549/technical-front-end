import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostItem from '../components/PostItem';
import styled from 'styled-components';
import { Post } from '../types';
import { useRouter } from 'next/router';
import { fetchPosts as fetchPostsApi } from '../api/api';
import { RootState } from '../redux/store';
import { setPosts, addPosts, setPage, setLoading, setHasMore } from '../redux/slices/postsSlice';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px;
  align-items: center;
`;

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts.posts);
  const page = useSelector((state: RootState) => state.posts.page);
  const hasMore = useSelector((state: RootState) => state.posts.hasMore);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const router = useRouter();
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [highlightedPostId, setHighlightedPostId] = useState<number | null>(null);

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
    if (observer.current) observer.current.disconnect(); // Clean up previous observer

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

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const newPost = JSON.parse(event.data);
      dispatch(setPosts([newPost, ...posts]));
      setHighlightedPostId(newPost.id);

      setTimeout(() => {
        setHighlightedPostId(null);
      }, 5000); // Highlight for 5 seconds
    };

    return () => {
      ws.close();
    };
  }, [dispatch, posts]);

  const handleClick = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  return (
    <PageContainer>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onClick={handleClick} />
      ))}
      {hasMore && <div ref={loader} />} {/* Loader is removed if no more posts */}
    </PageContainer>
  );
};

export default Home;
