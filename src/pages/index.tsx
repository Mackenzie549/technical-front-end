import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import PostItem from '../components/PostItem';
import useInfiniteLoading from '../hooks/useInfiniteLoading';
import useWebSocket from '../hooks/useWebSocket';
import { Post } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px;
  align-items: center;
`;

const Home: React.FC = () => {
  const router = useRouter();
  // I wanted to keep the index page short and succinct, so I moved the logic to separate hooks.
  // This way, the logic can be reused in other components. And is easier to test.
  const { loader, posts, hasMore } = useInfiniteLoading();
  const { highlightedPostId } = useWebSocket('ws://localhost:8080');

  // I decided to push the post object to the router query
  // This way, the post object can be accessed in the post page without making another api call
  const handleClick = (post: Post) => {
    router.push({
      pathname: `/post/${post.id}`,
      query: { post: JSON.stringify(post) },
    });
  };

  return (
    <PageContainer data-testid={"HomeContainer"}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onClick={handleClick}
          highlighted={post.id === highlightedPostId}
        />
      ))}
      {hasMore && <div ref={loader} data-testid={"HomeLoader"} />} {/* Loader is removed if no more posts */}
    </PageContainer>
  );
};

export default Home;
