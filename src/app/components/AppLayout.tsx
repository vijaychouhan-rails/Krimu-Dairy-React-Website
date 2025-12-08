import React from 'react'
import Header from './Header'

function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Header />
        <main>{children}</main>
    </div>
  )
}

export default AppLayout