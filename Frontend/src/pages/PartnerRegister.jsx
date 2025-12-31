import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const PartnerRegister = () => {
  const navigate = useNavigate()

  // State for form inputs
  const [formData, setFormData] = useState({
    business: '',
    contactName: '',
    phone: '',
    address: '',
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
      const response = await axios.post(
        'https://food-views-backend.onrender.com/api/auth/foodpartner/register',
        {
          ...formData,           // spread all form fields
          name: formData.business // explicitly set name for backend
        }
      )

      alert('Partner registered successfully!')
      console.log(response.data)

      // If backend returned token, save it and set Authorization header
      if (response?.data?.token) {
        localStorage.setItem('partnerToken', response.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }

      // Redirect to partner create-food page
      navigate('/create-food')
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
            <h2 className="auth-title">Partner sign up</h2>
            <div className="auth-sub">Register your restaurant or cloud kitchen</div>
          </div>
        </header>

        {/* Converted into a form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <li>
            <label htmlFor="business">Business name</label>
            <input
              id="business"
              className="auth-input"
              placeholder="Acme Eats"
              value={formData.business}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="contactName">Contact Name</label>
            <input
              id="contactName"
              className="auth-input"
              placeholder="Contact name"
              value={formData.contactName}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="auth-input"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="auth-input"
              placeholder="123 Street, City, State"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </li>
          <li>
            <label htmlFor="email">Contact email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="contact@business.com"
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
              placeholder="Choose a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </li>

          <li>
            <div className="auth-actions">
              <button type="submit" className="btn btn-primary">Register</button>
              <Link to="/food-partner/login" className="btn btn-ghost">Sign in</Link>
            </div>
          </li>
          <li>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
              <Link to="/user/register" className="muted-link">Register as user</Link>
              <Link to="/food-partner/login" className="muted-link">Already have an account? Sign in</Link>
            </div>
          </li>
        </form>
      </div>
    </div>
  )
}

export default PartnerRegister

