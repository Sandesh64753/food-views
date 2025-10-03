import React, { useEffect, useRef, useState } from "react";
import "../../styles/reels.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaHome,
} from "react-icons/fa";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const videoRefs = useRef(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("partnerToken");
        const config = { withCredentials: true };
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          "http://localhost:3000/api/food",
          config
        );
        setFoods(response.data.foodItems || []);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoodItems();
  }, []);

  // --- Like function ---
  async function likeVideo(food) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: food._id },
        { withCredentials: true },
        console.log("successfully liked")
      );

      setFoods((prev) =>
        prev.map((f) =>
          f._id === food._id
            ? {
                ...f,
                isLiked: response.data.like,
                likes: response.data.like ? f.likes + 1 : f.likes - 1,
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error liking video:", err);
    }
  }

  // --- Save function ---
  async function saveVideo(food) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: food._id },
        { withCredentials: true },
        console.log("video saved")
      );

      setFoods((prev) =>
        prev.map((f) =>
          f._id === food._id
            ? {
                ...f,
                isSaved: response.data.save,
                saves: response.data.save ? f.saves + 1 : f.saves - 1,
              }
            : f
        )
      );
    } catch (err) {
      console.error("Error saving video:", err);
    }
  }

  return (
    <div className="reels-container">
      {foods.map((food) => (
        <section className="reel" key={food._id}>
          <video
            src={food.video}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            ref={(el) => videoRefs.current.set(food._id, el)}
          />

          {/* Overlay */}
          <div className="reel-overlay">
            {/* Bottom-left meta */}
            <div className="bottom-meta">
              <p className="description">{food.description}</p>
              <div className="bottom-actions">
                <button
                  className="visit-btn"
                  onClick={() => navigate(`/food-partner/${food.foodPartner}`)}
                >
                  Visit Store
                </button>
                <div className="like-save">
                  {/* Like button */}
                  <div
                    onClick={() => likeVideo(food)}
                    className="action"
                  >
                    {food.isLiked ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{food.likes || 0}</span>
                  </div>

                  {/* Save button */}
                  <div
                    onClick={() => saveVideo(food)}
                    className="action"
                  >
                    {food.isSaved ? (
                      <FaBookmark color="gold" />
                    ) : (
                      <FaRegBookmark />
                    )}
                    <span>{food.saves || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="reel-gradient"></div>
        </section>
      ))}

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/")}>
          <FaHome /> home
        </button>
        <button onClick={() => navigate("/save")}>
          <FaBookmark /> saved
        </button>
      </nav>
    </div>
  );
};

export default Home;
