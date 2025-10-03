import React, { Profiler } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import PartnerRegister from '../pages/PartnerRegister'
import PartnerLogin from '../pages/PartnerLogin'
import Home from '../pages/general/Home'
import CreateFood from '../pages/food-partner/CreateFood'
import BusinessProfile from '../pages/food-partner/BusinessProfile'
import Saved from '../pages/general/Saved'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<UserRegister/>} />
        <Route path="/user/login" element={<UserLogin/>} />
        <Route path="/food-partner/register" element={<PartnerRegister/>} />
        <Route path="/food-partner/login" element={<PartnerLogin/>} />
        <Route path='/' element={<Home/>}/>
        <Route path='/create-food' element={<CreateFood/>}/>
        <Route path="/food-partner/:id" element={<BusinessProfile />} />
        <Route path="/save" element={<Saved />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
