import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../Dealers/Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import Header from '../Header/Header';

const sentimentIcon = (s) => {
  if (s === "positive") return positive_icon;
  if (s === "negative") return negative_icon;
  return neutral_icon;
};

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/djangoapp/dealer/" + id);
      const retobj = await res.json();
      if (retobj.status === 200) {
        const arr = Array.from(retobj.dealer);
        if (arr.length > 0) setDealer(arr[0]);
      }
      const res2 = await fetch("/djangoapp/reviews/dealer/" + id);
      const retobj2 = await res2.json();
      if (retobj2.status === 200) {
        const list = retobj2.reviews ? Array.from(retobj2.reviews) : [];
        if (list.length > 0) {
          setReviews(list);
        } else {
          setUnreviewed(true);
        }
      }
    };
    load();
  }, [id]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>{dealer.full_name}</h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <span>Loading Reviews....</span>
        ) : unreviewed === true ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review._id}>
              <img src={sentimentIcon(review.sentiment)} className="emotion_icon" alt="Sentiment" />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
