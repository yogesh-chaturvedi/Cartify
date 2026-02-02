import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'

const Cancel = () => {

  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="border-2 border-black py-3 px-5">
          <h2 className="text-xl font-semibold">Payment Cancel</h2>
          <button onClick={() => { navigate('/') }}>Return home</button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Cancel
