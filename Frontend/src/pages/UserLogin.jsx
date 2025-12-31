import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const redirectTo = params.get('redirect') || '/'

  // State for form inputs
  const [formData, setFormData] = useState({
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
      const response = await axios.post('https://food-views-backend.onrender.com/api/auth/user/login', formData, { withCredentials: true })

      // Save token (if backend returns it)
      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }

  alert('Login successful!')
  navigate(redirectTo)
    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid credentials, please try again.')
    }
  }

  return (
    <div className="auth-shell text-white">
      <div className="auth-card">
        <header className="auth-header">
          <div>
            <h2 className="auth-title">Welcome back</h2>
            <div className="auth-sub">Log in to your user account</div>
          </div>
        </header>

        {/* Converted into form */}
        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <div className="auth-actions">
              <button type="submit" className="btn btn-primary">Log in</button>
              <Link to="/user/register" className="btn btn-ghost">Create account</Link>
            </div>
          </li>
          <li>
            <div className="muted-link">Forgot password? Contact support.</div>
          </li>
          <li>
            <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:8}}>
              <Link to="/user/register" className="muted-link">Register as user</Link>
              <Link to="/food-partner/login" className="muted-link">Partner login</Link>
            </div>
          </li>
        </form>
      </div>
    </div>
  )
}

export default UserLogin

