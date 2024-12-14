import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../store/reviewsSlice";
import Filters from "./Filters";
import Rating from "../components/Rating";
import styles from "./ReviewsTable.module.css";

const ReviewsTable = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.list);  
  const hasMore = useSelector((state) => state.reviews.hasMore); // Для проверки наличия новых данных
  const currentPage = useSelector((state) => state.reviews.currentPage); // Текущая страница
  const totalReviews = useSelector((state) => state.reviews.totalReviews);
  

  const [filters, setFilters] = useState({
    platform: "",
    ratingFrom: "",
    ratingTo: "",
    sort: "",
    search: "",
  });

  // Загружаем первую страницу при монтировании, только если это первый запрос
  useEffect(() => {      
    dispatch(fetchReviews(1)); // Передаём номер страницы    
  }, [dispatch]);

  // Функция подгрузки новых данных
  const handleLoadMore = () => {
    if (hasMore) {      
      dispatch(fetchReviews(currentPage + 1));     
    }
  };

  // Применение фильтров
  const applyFilters = (reviews, filters) => {
    return reviews.filter((review) => {
      const matchesPlatform =
        !filters.platform || review.platform === filters.platform;
      const matchesRating =
        (!filters.ratingFrom || review.rating >= Number(filters.ratingFrom)) &&
        (!filters.ratingTo || review.rating <= Number(filters.ratingTo));
      const matchesSearch =
        !filters.search ||
        review.text.toLowerCase().includes(filters.search.toLowerCase());
      return matchesPlatform && matchesRating && matchesSearch;
    });
  };

  // Применение сортировки
  const applySort = (reviews, sort) => {
    return reviews.sort((a, b) => {
      if (sort === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sort === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sort === "rating_desc") return b.rating - a.rating;
      if (sort === "rating_asc") return a.rating - b.rating;
      return 0;
    });
  };

  // Вычисляем отфильтрованные и отсортированные отзывы
  const filteredReviews = useMemo(() => {
    const filtered = applyFilters(reviews, filters);
    return applySort(filtered, filters.sort);
  }, [reviews, filters]);

  return (
    <>
      <div className={styles.reviews}>
        <h1>
          Отзывы <span className={styles.number}>{totalReviews}</span>
        </h1>
      </div>
      <Filters filters={filters} setFilters={setFilters} />
      {filteredReviews.map((review, index) => (
        <div
          className={styles.container}
          key={`${review.id}-${index}`} // Обеспечиваем уникальный ключ
        >
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
      {hasMore && (
        <button onClick={handleLoadMore} className={styles.loadMore}>
          Загрузить ещё
        </button>
      )}
    </>
  );
};

export default ReviewsTable;
