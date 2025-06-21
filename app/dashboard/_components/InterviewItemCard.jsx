'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function InterviewItemCard({ interview }) {
  const { mockId, jobPosition, jobExperience, createdAt } = interview || {}

  return (
    <div className='border shadow-sm rounded-lg p-4 bg-white dark:bg-gray-800'>
      <h2 className='font-bold text-primary text-lg'>{jobPosition}</h2>
      <p className='text-sm text-gray-600 dark:text-gray-300'>{jobExperience} Years of Experience</p>
      <p className='text-xs text-gray-400 mt-1'>Created At: {createdAt}</p>

      <div className='flex justify-between items-center mt-4 gap-3'>
        <Link href={`/dashboard/interview/${mockId}/feedback`} passHref>
          <Button size="sm" variant="outline" className="w-full">
            Feedback
          </Button>
        </Link>

        <Link href={`/dashboard/interview/${mockId}/start`} passHref>
          <Button size="sm" className="w-full">
            Start
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default InterviewItemCard
