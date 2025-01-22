import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';

interface PostsState {
  posts: Post[];
  page: number;
  loading: boolean;
  hasMore: boolean;
}

const initialState: PostsState = {
  posts: [],
  page: 1,
  loading: false,
  hasMore: true,
};

// I created a postsSlice to manage the posts state in the Redux store
// The slice contains actions to set the posts, add posts, set the page, set loading state, and set hasMore state mostly to be used in my hooks
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPosts(state, action: PayloadAction<Post[]>) {
      state.posts = [...state.posts, ...action.payload];
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
  },
});

export const { setPosts, addPosts, setPage, setLoading, setHasMore } = postsSlice.actions;
export default postsSlice.reducer;