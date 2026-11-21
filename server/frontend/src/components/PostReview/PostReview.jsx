import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../Dealers/Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/djangoapp/dealer/" + id);
      const retobj = await res.json();
      if (retobj.status === 200) {
        const arr = Array.from(retobj.dealer);
        if (arr.length > 0) setDealer(arr[0]);
      }
      const res2 = await fetch("/djangoapp/get_cars");
      const retobj2 = await res2.json();
      setCarmodels(Array.from(retobj2.CarModels));
    };
    load();
  }, [id]);

  const postreview = async () => {
    let name = sessionStorage.getItem("username");
    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }
    const parts = model.split(" ");
    const make_chosen = parts[0];
    const model_chosen = parts.slice(1).join(" ");
    const jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });
    const res = await fetch("/djangoapp/add_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });
    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    } else {
      alert("Could not post the review. Are you logged in?");
    }
  };

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>
        <textarea id="review" cols="50" rows="7" placeholder="Write your review here" onChange={(e) => setReview(e.target.value)}></textarea>
        <div className="input_field">
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="input_field">
          Car Make
          <select name="cars" id="cars" defaultValue="" onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, i) => (
              <option key={i} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>
        <div className="input_field">
          Car Year <input type="int" max={2023} min={2015} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div>
          <button className="postreview" onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
