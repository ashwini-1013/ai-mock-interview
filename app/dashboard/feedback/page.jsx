'use client'
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([])
  const router = useRouter()

  useEffect(() => {
    GetFeedback()
  }, [])

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .orderBy(UserAnswer.mockIdRef, UserAnswer.id)
    setFeedbackList(result)
  }

  const groupedFeedback = feedbackList.reduce((acc, item) => {
    const key = item.mockIdRef
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-4">All Interview Feedback</h2>

      {Object.keys(groupedFeedback).length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>No Feedback Record Found</h2>
      ) : (
        Object.entries(groupedFeedback).map(([mockId, feedbacks]) => (
          <div key={mockId} className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Interview ID: {mockId}</h2>

            {feedbacks.map((item, index) => (
              <Collapsible key={index} className='mt-4'>
                <CollapsibleTrigger className='p-3 bg-secondary rounded-lg my-2 flex justify-between'>
                  <span>{item.question}</span>
                  <ChevronDown className='h-5 w-5' />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className='flex flex-col gap-2 p-3'>
                    <div className='text-sm bg-red-50 border p-2 rounded'><strong>Your Answer:</strong> {item.userAns}</div>
                    <div className='text-sm bg-blue-50 border p-2 rounded'><strong>Correct Answer:</strong> {item.correctAns}</div>
                    <div className='text-sm bg-green-50 border p-2 rounded'><strong>Feedback:</strong> {item.feedback}</div>
                    <div className='text-sm text-gray-500'><strong>Rating:</strong> {item.rating}/10</div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        ))
      )}

      <Button onClick={() => router.replace("/dashboard")} className="mt-6">
        Go Back to Dashboard
      </Button>
    </div>
  )
}

export default FeedbackPage
