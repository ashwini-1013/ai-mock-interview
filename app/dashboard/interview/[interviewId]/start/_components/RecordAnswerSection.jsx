'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import dynamic from 'next/dynamic'

// Dynamically import the FaceAnalyzer to avoid build-time issues
const FaceAnalyzer = dynamic(() => import('@/components/FaceAnalyzer'), { ssr: false })

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const webcamRef = useRef(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [warnings, setWarnings] = useState(0)
  const [interviewEnded, setInterviewEnded] = useState(false)
  const { user } = useUser()

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    language: 'en-IN',
  })

  useEffect(() => {
    results.forEach((result) => {
      setUserAnswer(prev => prev + result?.transcript)
    })
  }, [results])

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer()
    }
  }, [userAnswer])

  useEffect(() => {
    if (warnings >= 5) {
      stopSpeechToText()
      setInterviewEnded(true)
      toast.error('Interview discontinued due to repeated suspicious behavior.', {
        position: 'top-right',
        duration: 3000,
      })
    }
  }, [warnings])


  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
    }
  }

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true)

      const feedbackPrompt = `Please return *only* a valid JSON object with two fields: "rating" (1-5) and "feedback" (a string of 3-5 lines) for the following: Question: ${mockInterviewQuestion[activeQuestionIndex]?.Question} User Answer: ${userAnswer}`

      const result = await chatSession.sendMessage(feedbackPrompt)
      const mockJsonResp = result.response.text().replace('```json', '').replace('```', '')
      const JsonFeedbackResp = JSON.parse(mockJsonResp)

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.Question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      })

      if (resp) {
        toast.success('User Answer recorded successfully', {
          position: 'top-right',
          duration: 3000,
        })
        setUserAnswer('')
        setResults([])
      }
    } catch (err) {
      console.error('Update answer error:', err)
      toast.error('Something went wrong while saving answer.', {
        position: 'top-right',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 relative'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt='webcam' />
        <Webcam
          mirrored={true}
          audio={false}
          ref={webcamRef}
          style={{ height: 300, width: '100%', zIndex: 10 }}
        />
      </div>

      {/* Face Behavior Analysis Component (dynamically loaded) */}
      <FaceAnalyzer
        webcamRef={webcamRef}
        isRecording={isRecording}
        warnings={warnings}
        setWarnings={setWarnings}
      />

      <Button
        disabled={loading}
        variant='outline'
        className='my-10 flex gap-2 items-center'
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <span className='text-red-600 font-semibold flex gap-2'><StopCircle /> Stop Recording</span>
        ) : (
          <h2 className='text-primary flex gap-2 items-center'><Mic /> Record Answer</h2>
        )}
      </Button>

      {warnings > 0 && warnings < 5 && (
        <div className='text-yellow-500 font-semibold'>
          Warning {warnings} of 5: Please maintain eye contact and behave professionally.
        </div>
      )}

      {interviewEnded && (
        <div className='text-red-500 font-semibold'>
          Interview discontinued due to suspicious behavior.
        </div>
      )}

    </div>
  )
}

export default RecordAnswerSection
