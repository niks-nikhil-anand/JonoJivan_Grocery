import React from 'react'

const page = () => {
  return (
    <div className='bg-gray-100'>
      <div className="p-4 border rounded-md shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
        <div className="flex space-x-4">
          {/* Print Button */}
          <button className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
            <FaPrint className="mr-2" />
            Print
          </button>

          {/* Download Invoice Button */}
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
            <FaDownload className="mr-2" />
            Download Invoice
          </button>
        </div>
      </div>
    </div>
      <div>

      </div>
    </div>
  )
}

export default page