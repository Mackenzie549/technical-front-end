"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Post } from '../../types';

const PostContainer = styled.div`
  padding: 16px;
  margin: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const PostImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Name = styled.h3`
  margin: 0;
`;

const BodyText = styled.p`
  margin: 0 48px;
  text-align: center;
`;

const BackButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const PostDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    const postId = parseInt(id as string);
    try {
      const response = await fetch(`https://dummyjson.com/recipes/${postId}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <PostContainer>
      <PostImage src={post.image} alt={post.name} />
      <Name>{post.name}</Name>
      <BodyText>{post.instructions.join('\n')}</BodyText>
      <BackButton onClick={handleBackClick}>Back</BackButton>
    </PostContainer>
  );
};

export default PostDetails;