import React from 'react'

const About = () => {
  return (
    <div className='flex flex-col justify-center items-center'><h1 className='text-3xl font-bold'>About Us</h1>
      <div className="w-full text-center bg-slate-200 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ecom</h1>
        <p className="text-lg text-gray-700">
          Your one-stop shop for all your needs.
        </p>
        <div className="flex justify-center mt-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg mr-4 hover:bg-blue-600 transition duration-300">
            Shop Now
          </button>
          <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default About