import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const PartnerLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const redirectTo = params.get('redirect') || '/'

  // State for login inputs
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
      const response = await axios.post('https://food-views-backend.onrender.com/api/auth/foodpartner/login', formData, { withCredentials: true })

      // Save token (if backend sends it)
      if (response?.data?.token) {
        localStorage.setItem('partnerToken', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }

  alert('Partner login successful!')
  navigate(redirectTo) // redirect to requested page after login
    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid credentials, please try again.')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <header className="auth-header">
          <div>
            <h2 className="auth-title">Partner login</h2>
            <div className="auth-sub">Access your partner dashboard</div>
          </div>
        </header>

        {/* Changed ul → form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <li>
            <label htmlFor="email">Business email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="partner@business.com"
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
              <button type="submit" className="btn btn-primary">Sign in</button>
              <Link to="/food-partner/register" className="btn btn-ghost">Create account</Link>
            </div>
          </li>
          <li>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
              <Link to="/food-partner/register" className="muted-link">Register as food partner</Link>
              <Link to="/user/login" className="muted-link">User login</Link>
            </div>
          </li>
        </form>
      </div>
    </div>
  )
}

export default PartnerLogin

