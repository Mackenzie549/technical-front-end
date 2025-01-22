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

const PostPage: React.FC = () => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (router.query.post) {
      setPost(JSON.parse(router.query.post as string));
    }
  }, [router.query.post]);

  if (!post) {
    return <div>No post selected</div>;
  }

  return (
    <PostContainer>
      <PostImage src={post.image} alt={post.name} />
      <Name>{post.name}</Name>
      <BodyText>{post.instructions.join(' ')}</BodyText>
      <BackButton onClick={() => router.back()}>Back</BackButton>
    </PostContainer>
  );
};

export default PostPage;