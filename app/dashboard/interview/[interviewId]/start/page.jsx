'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import { MockInterview } from '@/utils/schema'
import QuestionsSection from './_components/QuestionsSection'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const RecordAnswerSection = dynamic(() =>
  import('./_components/RecordAnswerSection'), {
  ssr: false
})

function StartInterview() {
  const [interviewData, setInterviewData] = useState()
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  const params = useParams()

  useEffect(() => {
    GetInterviewDetails()
  }, [])

  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId))
    const jsonMockResp = JSON.parse(result[0].jsonMockResp)

    console.log(jsonMockResp)
    setMockInterviewQuestion(jsonMockResp)
    setInterviewData(result[0])
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} />


        <RecordAnswerSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData} />
      </div>

      <div className='flex justify-end gap-6'>
        {
          activeQuestionIndex > 0 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>
        }

        {
          activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>
        }

        {
          activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
          <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
            <Button>End Interview</Button>
          </Link>
        }

      </div>

    </div>
  )
}

export default StartInterview
