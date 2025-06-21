import React from 'react'
import Header from './_components/Header'

function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <div className='mx-5 md:mx-20 lg:mx-36 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
