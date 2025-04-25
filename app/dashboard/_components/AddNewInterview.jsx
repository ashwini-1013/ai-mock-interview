'use client'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import {db} from '@/utils/db'
import { useRouter } from 'next/navigation'


function AddNewInterview() {

  const [openDialog, setOpenDialog] = useState(false)
  const [jobPostion, setJobPosition] = useState()
  const [jobDesc, setJobDesc] = useState()
  const [jobExperience, setJobExperience] = useState()
  const [loading, setLoading] = useState(false)
  const [jsonResponse, setJsonResponse] = useState([])
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    console.log(jobDesc, jobPostion, jobExperience)

    const InputPrompt = "Job Position: " + jobPostion + ", Job Description: " + jobDesc + ", Years of Experience: " + jobExperience + ", According to this information please give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " interview questions with answers in json format. Give Questions and Answers as field in JSON."

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
    console.log(JSON.parse(MockJsonResp))
    setJsonResponse(MockJsonResp)

    if (MockJsonResp) {
      const response = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPostion,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      }).returning({ mockId: MockInterview.mockId })

      console.log("Inserted Id : ", response)
      if(response){
        setOpenDialog(false)
        router.push('/dashboard/interview/' + response[0]?.mockId)
      }
    } else {
      console.log(error)
    }
    setLoading(false)
  }

  const router = useRouter();

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
        <h2 className='font-bold text-lg text-center'
          onClick={() => setOpenDialog(true)}
        >+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader >
            <DialogTitle className='font-bold text-2xl'>Tell us more about Job you are interviewing</DialogTitle>
            <DialogDescription >

              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about your Job position/role, Job description and years of experience </h2>

                  <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Job Description/Tech Stack</label>
                    <Textarea placeholder="Ex. React, Angular, NodeJs, MySQL, etc" required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Years of experience</label>
                    <Input placeholder="Ex. 5" type="number" max="50" required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} >Cancel</Button>
                  <Button type="submit" disabled={loading} >
                    {
                      loading ?
                        <>
                          <LoaderCircle className='animate-spin' />Generating from AI
                        </>
                        : 'Start Interview'
                    }</Button>
                </div>
              </form>
            </DialogDescription>

          </DialogHeader>
        </DialogContent>
      </Dialog>


    </div>
  )
}

export default AddNewInterview

