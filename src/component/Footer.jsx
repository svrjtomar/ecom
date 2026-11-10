import React from 'react'

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-6">
        <ul className="flex justify-center space-x-4 py-4">
            <li><a href="/about" className="text-white hover:text-gray-700">About</a></li>
            <li><a href="/contact" className="text-white hover:text-gray-700">Contact</a></li>
            <li><a href="/privacy" className="text-white hover:text-gray-700">Privacy Policy</a></li>
        </ul>
        <p className="text-center text-white text-sm py-4">
            &copy; 2026 Ecom. All rights reserved.
        </p>
    </div>
  )
}

export default Footer