import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostItem from '../components/PostItem';
import { Post } from '../types';

const mockPost: Post = {
  id: 1,
  name: 'Test Post',
  image: 'Test Image',
  instructions: ['Step 1', 'Step 2', 'Step 3'],
};

describe('PostItem', () => {
  it('renders PostItem details correctly', () => {
    render(<PostItem post={mockPost} onClick={() => {}} />);

    expect(screen.getByTestId(`PostItem-${mockPost.id}`)).not.toBeNull();
    expect(screen.getByTestId(`PostItem-${mockPost.id}-Avatar`)).not.toBeNull();
    expect(screen.getByTestId(`PostItem-${mockPost.id}-Name`)).not.toBeNull();
    expect(screen.getByTestId(`PostItem-${mockPost.id}-BodyText`)).not.toBeNull();
  });

  it('calls onClick when PostItem clicked', () => {
    const handleClick = jest.fn();
    render(<PostItem post={mockPost} onClick={handleClick} />);

    fireEvent.click(screen.getByTestId(`PostItem-${mockPost.id}`));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies highlighted styles when isHighlighted is true', () => {
    render(<PostItem post={mockPost} onClick={() => {}} highlighted={true} />);

    const postItem = screen.getByTestId(`PostItem-${mockPost.id}`);
    expect(postItem).toHaveStyle('background-color: white');
  });
});