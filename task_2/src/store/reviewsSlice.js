import { createSlice } from "@reduxjs/toolkit";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    list: [],
    currentPage: 0,
    hasMore: true,
    totalReviews: 0,
  },
  reducers: {
    setReviews: (state, action) => {
      state.list = action.payload;
    },
    appendReviews: (state, action) => {
      state.list = [...state.list, ...action.payload];
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setTotalReviews(state, action) {
      state.totalReviews = action.payload;     
    },
  },
});

export const { setReviews, appendReviews, setPage, setHasMore, setTotalReviews } =
  reviewsSlice.actions;
export const fetchReviews = (page) => ({  
  type: "FETCH_REVIEWS",
  payload: page,
});

export default reviewsSlice.reducer;
