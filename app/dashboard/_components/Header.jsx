'use client'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Dynamically import Clerk UserButton (client-only)
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false, // prevent server-side rendering
  loading: () => <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" /> // fallback UI
})

function Header() {
  const path = usePathname()

  useEffect(() => {
    console.log(path)
  }, [])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={160} height={100} alt="logo" />
      
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard' && 'text-primary font-bold'}`}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/questions' && 'text-primary font-bold'}`}>
          <Link href="/dashboard/questions">Questions</Link>
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path === '/dashboard/feedback' && 'text-primary font-bold'}`}>
          <Link href="/dashboard/feedback">Feedback</Link>
        </li>
      </ul>

      <UserButton />
    </div>
  )
}

export default Header
