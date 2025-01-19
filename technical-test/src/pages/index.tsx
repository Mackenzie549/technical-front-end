import React, { useEffect, useState, useRef, useCallback } from 'react';
import PostItem from '../components/PostItem';
import styled from 'styled-components';
import { Post } from '../types';
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 24px;
  align-items: center;
`;

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    const response = await fetch(`https://dummyjson.com/recipes?limit=10&skip=${(page - 1) * 10}`);
    const data = await response.json();
    setPosts((prevPosts) => [...prevPosts, ...data.recipes]);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  const handleClick = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  return (
    <PageContainer>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onClick={handleClick} />
      ))}
      <div ref={loader} />
    </PageContainer>
  );
};

export default Home;