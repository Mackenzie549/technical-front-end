import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import Home from '../pages/index';
import { Post } from '../types';
import useInfiniteLoading from '../hooks/useInfiniteLoading';
import useWebSocket from '../hooks/useWebSocket';

jest.mock('../hooks/useInfiniteLoading');
jest.mock('../hooks/useWebSocket');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPosts: Post[] = [
  {
    id: 1,
    name: 'Test Post 1',
    image: 'Test Image',
    instructions: ['Step 1', 'Step 2', 'Step 3'],
  },
  {
    id: 2,
    name: 'Test Post 2',
    image: 'Test Image',
    instructions: ['Step 1', 'Step 2', 'Step 3'],
  },
];

describe('Home', () => {
  beforeEach(() => {
    (useInfiniteLoading as jest.Mock).mockReturnValue({
      loader: jest.fn(),
      posts: mockPosts,
      hasMore: true,
    });

    (useWebSocket as jest.Mock).mockReturnValue({
      highlightedPostId: 1,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('renders posts correctly', () => {
    render(<Home />);

    expect(screen.getByTestId('HomeContainer')).toBeInTheDocument();
    expect(screen.getByTestId(`PostItem-${mockPosts[0].id}`)).not.toBeNull();
  });

  it('calls router.push with the correct post when a post is clicked', () => {
    const { push } = useRouter();
    render(<Home />);

    fireEvent.click(screen.getByTestId(`PostItem-${mockPosts[0].id}`));
    expect(push).toHaveBeenCalledWith({
      pathname: `/post/${mockPosts[0].id}`,
      query: { post: JSON.stringify(mockPosts[0]) },
    });
  });

  it('renders the loader when hasMore is true', () => {
    render(<Home />);
    expect(screen.getByTestId('HomeLoader')).toBeInTheDocument();
  });
});