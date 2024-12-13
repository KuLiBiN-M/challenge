import PropTypes from "prop-types";
import { FaStar, FaRegStar } from "react-icons/fa";

const Rating = ({ rating }) => {
  const totalStars = 5;

  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: totalStars }, (_, index) => {
        return index < rating ? (
          <FaStar key={index} style={{ color: "gold" }} />
        ) : (
          <FaRegStar key={index} style={{ color: "DarkGrey"}}
          />
        );
      })}
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default Rating;
