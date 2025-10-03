import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/variables.css'
import './styles/auth.css'
import axios from 'axios'

// Apply stored token (if any) to axios default headers so protected endpoints receive it
const storedToken = localStorage.getItem('token') || localStorage.getItem('partnerToken')
if (storedToken) axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App />
)
