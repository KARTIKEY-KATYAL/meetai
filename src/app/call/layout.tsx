import React, { ReactNode } from 'react'
interface Props{
    children : ReactNode
}

const layout = ({children}:Props) => {
  return (
    <div className='h-screen bg-black'>
        {children}
    </div>
  )
}

export default layout