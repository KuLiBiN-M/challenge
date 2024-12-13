import { createSlice } from "@reduxjs/toolkit";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: { list: [] },
  reducers: {
    setReviews: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setReviews } = reviewsSlice.actions;
export const fetchReviews = () => ({ type: "FETCH_REVIEWS" });

export default reviewsSlice.reducer;
