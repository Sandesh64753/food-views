import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
  const navigate = useNavigate()
  // State for form inputs
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  })

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://food-views-backend.onrender.com/api/auth/user/register', formData,{
        withCredentials:true
      })
      alert('User registered successfully!')
      console.log(response.data)
      // If backend returned a token, save it and set Authorization header so user is authenticated
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }
      navigate("/")
    } catch (error) {
      console.error('Registration error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <header className="auth-header">
          <div>
            <h2 className="auth-title">Create your account</h2>
            <div className="auth-sub">Sign up as a user to discover restaurants</div>
          </div>
        </header>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <li>
            <label htmlFor="name">Full name</label>
            <input 
              id="fullname" 
              className="auth-input" 
              placeholder="Jane Doe" 
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              className="auth-input" 
              placeholder="you@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className="auth-input" 
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </li>

          <li>
            <div className="auth-actions">
              <button type="submit" className="btn btn-primary">Create account</button>
              <Link to="/user/login" className="btn btn-ghost">Sign in</Link>
            </div>
          </li>

          <li>
            <div className="muted-link">By continuing you agree to our terms and privacy policy.</div>
          </li>
          <li>
            <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:8}}>
              <Link to="/food-partner/register" className="muted-link">Register as food partner</Link>
              <Link to="/user/login" className="muted-link">Already have an account? Sign in</Link>
            </div>
          </li>
        </form>
      </div>
    </div>
  )
}

export default UserRegister

