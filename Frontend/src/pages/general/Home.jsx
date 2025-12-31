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
  // quick check for partner login (used to show ADD button)
  const [partnerToken, setPartnerToken] = useState(
    localStorage.getItem("partnerToken")
  );
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));

  // 🔐 AUTH CHECK (Redirect if not logged in)
  // Home is public. Partner profiles are gated when requested.
  // (Removed automatic redirect to login so Home is viewable by guests.)

  // 🍔 FETCH FOOD ITEMS
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("partnerToken");

        const config = {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };

        const response = await axios.get(
          "https://food-views-backend.onrender.com/api/food",
          config
        );

        setFoods(response.data.foodItems || []);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchFoodItems();
  }, []);

  // Keep partnerToken reactive across tabs/windows and when login sets it
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "partnerToken") setPartnerToken(e.newValue);
      if (e.key === "token") setUserToken(e.newValue);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Logout handler visible for both users and partners
  const handleLogout = async () => {
    try {
      // call backend logout to clear httpOnly cookie (if set)
      if (userToken) {
        await axios.get("http://localhost:3000/api/auth/user/logout", {
          withCredentials: true,
        });
      }
      if (partnerToken) {
        await axios.get("http://localhost:3000/api/auth/foodpartner/logout", {
          withCredentials: true,
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
      // proceed to clear local tokens anyway
    }

    // clear local storage and state
    localStorage.removeItem("token");
    localStorage.removeItem("partnerToken");
    setUserToken(null);
    setPartnerToken(null);
    // navigate to home
    navigate("/");
  };

  // ❤️ LIKE VIDEO
  async function likeVideo(food) {
    // require user login before liking
    const userToken = localStorage.getItem("token")
    const partnerPath = `/food-partner/${food.foodPartner}`
    if (!userToken) {
      const redirect = encodeURIComponent(partnerPath)
      return navigate(`/user/login?redirect=${redirect}`)
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/like",
        { foodId: food._id },
        { withCredentials: true }
      )

      setFoods((prev) =>
        prev.map((f) =>
          f._id === food._id
            ? {
                ...f,
                isLiked: response.data.like,
                likes: response.data.like
                  ? (f.likes || 0) + 1
                  : (f.likes || 1) - 1,
              }
            : f
        )
      )
    } catch (err) {
      console.error("Error liking video:", err)
    }
  }

  // 🔖 SAVE VIDEO
  async function saveVideo(food) {
    // require user login before saving
    const userToken = localStorage.getItem("token")
    const partnerPath = `/food-partner/${food.foodPartner}`
    if (!userToken) {
      const redirect = encodeURIComponent(partnerPath)
      return navigate(`/user/login?redirect=${redirect}`)
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        { foodId: food._id },
        { withCredentials: true }
      )

      setFoods((prev) =>
        prev.map((f) =>
          f._id === food._id
            ? {
                ...f,
                isSaved: response.data.save,
                saves: response.data.save
                  ? (f.saves || 0) + 1
                  : (f.saves || 1) - 1,
              }
            : f
        )
      )
    } catch (err) {
      console.error("Error saving video:", err)
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {/* top-right logout button (same styling as visit-btn) */}
      {(userToken || partnerToken) && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}>
          <button className="visit-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

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
            <div className="bottom-meta">
              <p className="description">{food.description}</p>

              <div className="bottom-actions">
                <button
                  className="visit-btn"
                  onClick={() => {
                    const token =
                      localStorage.getItem("token") ||
                      localStorage.getItem("partnerToken")

                    const partnerPath = `/food-partner/${food.foodPartner}`
                    if (token) {
                      navigate(partnerPath)
                    } else {
                      // redirect to user login and return to partner page after login
                      const redirect = encodeURIComponent(partnerPath)
                      navigate(`/user/login?redirect=${redirect}`)
                    }
                  }}
                >
                  Visit Store
                </button>

                {/* ADD button for food-partner to go to CreateFood (visible only to partners) */}
                {partnerToken && (
                  <button
                    className="visit-btn"
                    onClick={() => {
                      const createPath = `/create-food`
                      navigate(createPath)
                    }}
                  >
                    ADD
                  </button>
                )}

                <div className="like-save">
                  {/* Like */}
                  <div
                    className="action"
                    onClick={() => likeVideo(food)}
                  >
                    {food.isLiked ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{food.likes || 0}</span>
                  </div>

                  {/* Save */}
                  <div
                    className="action"
                    onClick={() => saveVideo(food)}
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

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/")}>
          <FaHome /> Home
        </button>
        <button onClick={() => navigate("/save")}>
          <FaBookmark /> Saved
        </button>
      </nav>
    </div>
    </div>
  );
};

export default Home;
