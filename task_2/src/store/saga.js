import { call, put, takeEvery } from "redux-saga/effects";
import { setReviews } from "./reviewsSlice";

function* fetchReviewsSaga() {
  const response = yield call(fetch, "/api/reviews.json"); // Запрос к мок-данным
  const data = yield response.json();
  yield put(setReviews(data));
}

export default function* saga() {
  yield takeEvery("FETCH_REVIEWS", fetchReviewsSaga);
}