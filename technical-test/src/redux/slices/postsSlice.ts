import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: number;
  name: string;
  image: string;
  instructions: string[];
}

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