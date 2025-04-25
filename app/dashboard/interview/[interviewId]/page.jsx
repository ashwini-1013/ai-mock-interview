'use client'

import React, { useEffect, useState } from 'react'
import { MockInterview } from '@/utils/schema'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [webCamEnabled, setWebCamEnabled] = useState(false)

  useEffect(() => {
    GetInterviewDetails()
  }, [])

  const GetInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))

      if (result.length === 0) {
        throw new Error('Interview not found')
      }

      setInterviewData(result[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className='my-10 flex justify-center'>Loading interview data...</div>
  }

  if (error) {
    return <div className='my-10 flex justify-center'>Error: {error}</div>
  }

  if (!interviewData) {
    return <div className='my-10 flex justify-center'>No interview data found</div>
  }

  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}</h2>
            <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
          </div>

          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Instructions</strong></h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
              <Button variant='ghost' className='w-full' onClick={() => setWebCamEnabled(true)}>
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='flex justify-end items-end mt-5'>
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview
