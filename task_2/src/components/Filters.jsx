import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";
import styles from "./Filters.module.css";

const Filters = ({ filters, setFilters }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const reviews = useSelector((state) => state.reviews.list);
  
  const platforms = useMemo(() =>
    reviews.length ? [...new Set(reviews.map((review) => review.platform))] : [], [reviews]
  );

  
  useEffect(() => {    
    const timeoutId = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);    
    return () => clearTimeout(timeoutId);
  }, [searchInput, setFilters]);

  
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;    
    const parsedValue =
      name.includes("rating") && value ? Number(value) : value;
    setFilters((prev) => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <div className={styles.filters}>
      <select
        name="platform"
        value={filters.platform || ""}
        onChange={handleFilterChange}
      >
        <option value="">Все платформы</option>
        {platforms.map((platform) => (
          <option key={platform} value={platform}>
            {platform}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="ratingFrom"
        placeholder="Рейтинг от"
        value={filters.ratingFrom || ""}
        onChange={handleFilterChange}
      />
      <input
        type="number"
        name="ratingTo"
        placeholder="Рейтинг до"
        value={filters.ratingTo || ""}
        onChange={handleFilterChange}
      />
      <select
        name="sort"
        value={filters.sort || ""}
        onChange={handleFilterChange}
      >
        <option value="">Сортировка</option>
        <option value="date_desc">Сначала новые</option>
        <option value="date_asc">Сначала старые</option>
        <option value="rating_desc">Рейтинг по убыванию</option>
        <option value="rating_asc">Рейтинг по возрастанию</option>
      </select>
      <input
        type="text"
        name="search"
        placeholder="Поиск отзывов"
        value={searchInput}
        onChange={handleInputChange}
      />
    </div>
  );
};

Filters.propTypes = {
  filters: PropTypes.shape({
    platform: PropTypes.string,
    ratingFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ratingTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sort: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default Filters;
