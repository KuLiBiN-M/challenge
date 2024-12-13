import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../store/reviewsSlice";
import Filters from "./Filters";
import Rating from "../components/Rating";
import styles from "./ReviewsTable.module.css";

const ReviewsTable = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.list);
  const [filters, setFilters] = useState({
    platform: "",
    ratingFrom: "",
    ratingTo: "",
    sort: "",
    search: "",
  });

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);
 
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(
        (review) =>
          (!filters.platform || review.platform === filters.platform) &&
          (!filters.ratingFrom ||
            review.rating >= Number(filters.ratingFrom)) &&
          (!filters.ratingTo || review.rating <= Number(filters.ratingTo)) &&
          (!filters.search ||
            review.text.toLowerCase().includes(filters.search.toLowerCase()))
      )
      .sort((a, b) => {
        if (filters.sort === "date_desc")
          return new Date(b.date) - new Date(a.date);
        if (filters.sort === "date_asc")
          return new Date(a.date) - new Date(b.date);
        if (filters.sort === "rating_desc") return b.rating - a.rating;
        if (filters.sort === "rating_asc") return a.rating - b.rating;
        return 0;
      });
  }, [reviews, filters]);

  return (
    <>
      <div className={styles.reviews}>
        <h1>
          Отзывы <span className={styles.number}>{filteredReviews.length}</span>
        </h1>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      {filteredReviews.map((review) => (
        <div className={styles.container} key={review.id}>
          <div className={styles.content}>
            <div className={styles.platform}>{review.platform}</div>
            <div className={styles.details}>
              <div className={styles.date}>
                {new Date(review.date).toLocaleString().split(",")[0]}
              </div>
              <div className={styles.rating}>
                <Rating rating={review.rating} />
              </div>
            </div>
          </div>
          <div className={styles.text}>{review.text}</div>
        </div>
      ))}
    </>
  );
};

export default ReviewsTable;
