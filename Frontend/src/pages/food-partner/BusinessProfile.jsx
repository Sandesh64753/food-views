import { React, useState, useEffect } from 'react'
import '../../styles/BusinessProfile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BusinessProfile = () => {
  const { id } = useParams()
  const [profile, setprofile] = useState(null)
  const [videos, setvideos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // If there's no stored token (user or partner), redirect to login and include return path
    const storedToken = localStorage.getItem('token') || localStorage.getItem('partnerToken')
    const partnerPath = `/food-partner/${id}`
    if (!storedToken) {
      const redirect = encodeURIComponent(partnerPath)
      return navigate(`/user/login?redirect=${redirect}`)
    }

    // Fetch profile with credentials and Authorization header (axios.defaults may also contain it)
    const config = {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    }

    axios.get(`https://food-views-backend.onrender.com/api/food-partner/${id}`, config)
      .then(response => {
        setprofile(response.data.foodPartner)
        setvideos(response.data.foodPartner.foodItems)
      }).catch(err => {
        // If backend returns 401 (not authenticated), redirect to login with return path
        const status = err.response?.status
        console.error(err.response?.data || err.message)
        if (status === 401) {
          const redirect = encodeURIComponent(partnerPath)
          return navigate(`/user/login?redirect=${redirect}`)
        }
      })
  }, [id, navigate])

  return (
    <main className="profile-container" role="main">
      <header className="profile-header">
        <img className="profile-logo" src='https://images.unsplash.com/photo-1758183583798-b7038bca9272?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D' aria-hidden="true" />

        <div className="header-right">
          <div className="pills">
            <div className="pill">{profile?.name}</div>
            <div className="pill">{profile?.address}</div>
          </div>

          <div className="profile-stats" aria-label="Business statistics">
            <div className="stat">
              <p className="stat-title">total meals</p>
              <p className="stat-value">{profile?.totalMeals}</p>
            </div>
            <div className="stat">
              <p className="stat-title">{profile?.customerServed}</p>
              <p className="stat-value">15K</p>
            </div>
          </div>
        </div>
      </header>

      <hr className="divider" />

      <section className="video-grid" aria-label="Business videos">
        {videos.length > 0 ? (
          videos.map((v, index) => (
            <div key={index} className="video-card" role="article">
              <video
                src={v.video}
                muted
                autoPlay
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  background: "#000",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out"
                }}
              ></video>
              <div className="video-info">
                <p className="video-title">{v.title}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </section>


    </main >
  )
}

export default BusinessProfile
