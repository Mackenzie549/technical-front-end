import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import PostItem from '../components/PostItem';
import { setPosts } from '../redux/slices/postsSlice';
import { Post } from '../types';
import useInfiniteLoading from '../hooks/useInfiniteLoading';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px;
  align-items: center;
`;

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loader, posts, hasMore } = useInfiniteLoading();
  const [highlightedPostId, setHighlightedPostId] = useState<number | null>(null);

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
    router.push({
      pathname: `/post/${post.id}`,
      query: { post: JSON.stringify(post) },
    });
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
