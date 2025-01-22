import { PostItemProps } from '../types/index';
import React from 'react';
import styled from 'styled-components';

const PostContainer = styled.div<{isHighlighted: Boolean}>`
  background-color: ${({ isHighlighted }) => (isHighlighted ? `white` : `black`)};
  color: ${({ isHighlighted }) => (isHighlighted ? `black` : `white`)};
  border: ${({ isHighlighted }) => (isHighlighted ? `1px solid red` : `1px solid white`)};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 12px;
  width: 500px;
  height: 150px;
  &:hover {
    border: 1px solid yellow;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Name = styled.h3`
  align-content: center;
  margin: 0;
`;

const BodyText = styled.p`
  margin: 0;
  grid-column: 2;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostItem: React.FC<PostItemProps> = ({ post, onClick, isHighlighted=false }) => {
  return (
      <PostContainer data-testid={`PostItem-${post.id}`} onClick={() => onClick(post)} isHighlighted={isHighlighted}>
        <Avatar src={post.image} alt={post.name} />
        <Name>{post.name}</Name>
        <BodyText>{post.instructions.join(' ')}</BodyText>
      </PostContainer>
  );
};

export default PostItem;