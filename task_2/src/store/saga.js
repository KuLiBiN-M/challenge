import { call, put, select, takeEvery } from "redux-saga/effects";
import {
  appendReviews,
  setHasMore,
  setPage,
  setTotalReviews,
} from "./reviewsSlice";

const pageSize = 3; // Количество элементов на странице

// Селектор для получения текущего состояния
const selectCurrentPage = (state) => state.reviews.currentPage;

function* fetchReviewsSaga() {
  try {  
    const currentPage = yield select(selectCurrentPage);
    const pageToFetch = currentPage + 1;
    
    const response = yield call(fetch, "/api/reviews.json");
    const data = yield response.json();
    
    const totalReviews = data.length;

    const start = (pageToFetch - 1) * pageSize;
    const end = start + pageSize;
    const pageData = data.slice(start, end);

    const hasMore = end < totalReviews;
    yield put(setHasMore(hasMore));
    
    if (pageData.length > 0) {
      yield put(appendReviews(pageData));
      yield put(setPage(pageToFetch));
    }
    yield put(setTotalReviews(totalReviews));
  } catch (error) {
    console.error("Ошибка загрузки отзывов:", error);
  }
}

export default function* saga() {
  yield takeEvery("FETCH_REVIEWS", fetchReviewsSaga);
}
