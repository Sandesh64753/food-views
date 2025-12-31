import React, { useEffect, useState, useRef } from "react";
import "../../styles/reels.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaBookmark, FaHome } from "react-icons/fa";

const Saved = () => {
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef(new Map());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedFoods = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/food/save", {
          withCredentials: true,
        });

        const savedFoods = (response.data.savedFoods || []).map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount || 0,
          saveCount: item.food.saveCount || 0,
          foodPartner: item.food.foodPartner, // include if available
        }));

        setVideos(savedFoods);
      } catch (error) {
        console.error("Error fetching saved foods:", error);
      }
    };

    fetchSavedFoods();
  }, []);

  return (
    <div className="reels-container">
      {videos.length === 0 ? (
        <div className="empty-state">
          <p>No saved videos yet.</p>
        </div>
      ) : (
        videos.map((food) => (
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
              <div className="bottom-meta">
                <p className="description">{food.description}</p>
                <div className="bottom-actions">
                  {food.foodPartner && (
                    <button
                      className="visit-btn"
                      onClick={() => navigate(`/food-partner/${food.foodPartner}`)}
                    >
                      Visit Store
                    </button>
                  )}
                  <div className="like-save">
                    <div className="action">
                      <FaHeart /> <span>{food.likeCount}</span>
                    </div>
                    <div className="action">
                      <FaBookmark /> <span>{food.saveCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reel-gradient"></div>
          </section>
        ))
      )}

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/")}>
          <FaHome /> Home
        </button>
        <button onClick={() => navigate("/saved")}>
          <FaBookmark /> Saved
        </button>
      </nav>
    </div>
  );
};

export default Saved;
