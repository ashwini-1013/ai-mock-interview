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
import * as faceapi from 'face-api.js'


// Load face-api models
const loadModels = async () => {
  const MODEL_URL = '/models'
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}/ssd_mobilenetv1`),
    faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression`),
    faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`),
  ])
}


function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const webcamRef = useRef(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [warnings, setWarnings] = useState(0)
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
    loadModels()
  }, [])

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

  const detectFaceBehavior = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceExpressions()

      if (detection) {
        const { expressions } = detection
        const suspicious =
          expressions.surprised > 0.05 ||
          expressions.angry > 0.05 ||
          expressions.fearful > 0.05 ||
          expressions.disgusted > 0.05 ||
          expressions.sad > 0.05

        if (suspicious || isLookingAway(detection)) {
          const nextWarnings = warnings + 1
          toast.warning(`⚠️ Suspicious behavior detected (${nextWarnings}/5)`)
          setWarnings(nextWarnings)
        }
      }
    }
  }



  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video
          const detection = await faceapi
            .detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceExpressions()



          if (detection) {
            const { expressions } = detection
            const suspicious =
              expressions.surprised > 0.05 ||
              expressions.angry > 0.05 ||
              expressions.fearful > 0.05 ||
              expressions.disgusted > 0.05 ||
              expressions.sad > 0.05 // 


            console.log("Expression Scores:", expressions)
            if (suspicious) {
              toast.warning("⚠️ You look distracted or unprofessional. Please stay focused.")
            }



            if (suspicious || isLookingAway(detection)) {
              const nextWarnings = warnings + 1
              toast.warning(`⚠️ Suspicious behavior detected (${nextWarnings}/5)`)
              setWarnings(nextWarnings)
            }
          }
        }
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [isRecording, warnings])

  useEffect(() => {
    if (warnings >= 5) {
      stopSpeechToText()
      toast.error('Interview discontinued due to repeated suspicious behavior.')
    }
  }, [warnings])

  const isLookingAway = (detection) => {
    const landmarks = detection.landmarks
    const nose = landmarks.getNose()
    const leftEye = landmarks.getLeftEye()
    const rightEye = landmarks.getRightEye()
    const eyeGap = Math.abs(leftEye[0].x - rightEye[3].x)
    const noseCenter = nose[3].x
    const eyeCenter = (leftEye[0].x + rightEye[3].x) / 2
    return Math.abs(noseCenter - eyeCenter) > eyeGap * 0.3
  }

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText()

      setTimeout(() => {
        detectFaceBehavior()
      }, 1000)

    } else {
      startSpeechToText()
    }
  }

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true)

      await detectFaceBehavior();

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
        toast.success('User Answer recorded successfully')
        setUserAnswer('')
        setResults([])
      }

    } catch (err) {
      console.error('Update answer error:', err)
      toast.error('Something went wrong while saving answer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      {/* <Button onClick={detectFaceBehavior} className="mb-4">
        Test Expression Now
      </Button> */}

      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 relative'>
        <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt='webcam' />
        <Webcam
          mirrored={true}
          audio={false}
          ref={webcamRef}
          style={{ height: 300, width: '100%', zIndex: 10 }}
        />
      </div>

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

      {warnings >= 5 && (
        <div className='text-red-500 font-semibold'>
          Interview discontinued due to suspicious behavior.
        </div>
      )}
    </div>
  )
}

export default RecordAnswerSection
