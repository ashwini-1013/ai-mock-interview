'use client'

import React, { useEffect } from 'react'
import * as faceapi from 'face-api.js'
import { toast } from 'sonner'

export default function FaceAnalyzer({ webcamRef, isRecording, warnings, setWarnings }) {
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(`${MODEL_URL}/ssd_mobilenetv1`),
        faceapi.nets.faceExpressionNet.loadFromUri(`${MODEL_URL}/face_expression`),
        faceapi.nets.faceLandmark68Net.loadFromUri(`${MODEL_URL}/face_landmark_68`),
      ])
    }

    loadModels()
  }, [])

  useEffect(() => {
    let interval

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

    if (isRecording) {
      interval = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          const video = webcamRef.current.video
          const detections = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceExpressions()

          if (detections.length > 1) {
            toast.warning('⚠️ Multiple faces detected!', {
              position: 'top-right',
              duration: 3000,
            })
            setWarnings((prev) => prev + 1)
            return
          }

          if (detections.length === 1) {
            const detection = detections[0]
            const { expressions } = detection
            const suspicious =
              expressions.surprised > 0.05 ||
              expressions.angry > 0.05 ||
              expressions.fearful > 0.05 ||
              expressions.disgusted > 0.05 ||
              expressions.sad > 0.05 ||
              isLookingAway(detection)

            if (suspicious) {
              toast.warning('⚠️ Suspicious behavior detected', {
                position: 'top-right',
                duration: 3000,
              })
              setWarnings((prev) => prev + 1)
            }
          }
        }
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [isRecording, webcamRef])

  return null // this component doesn't render UI
}
