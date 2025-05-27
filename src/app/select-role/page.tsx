'use client'

import { Card,CardTitle,CardContent } from '@/components/ui/card';
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';

const StudentCard = () => {
    return (
        <Card className='bg-neutral-100 h-[12rem] w-[15rem] flex flex-col items-center justify-center hover:bg-neutral-50 hover:shadow-lg transition ease-in'>
            <CardContent>
                <div>
                    <Image src={'/student.svg'} alt='STUDENT' width={100} height={100}/>
                </div>
            </CardContent>
            <CardTitle>STUDENT</CardTitle>
        </Card>
    )
}
const TeacherCard = () => {
    return (
        <Card className='bg-neutral-100 h-[12rem] w-[15rem] flex flex-col items-center justify-center hover:bg-neutral-50 hover:shadow-lg transition ease-in'>
            <CardContent>
                <div>
                    <Image src={'/teacher.svg'} alt='Teacher' width={100} height={100}/>
                </div>
            </CardContent>
            <CardTitle>TEACHER</CardTitle>
        </Card>
    )
}

const page = () => {
    const [role, setrole] = useState("");

    return (
        <div className='bg-slate-950 w-full min-h-screen flex flex-row items-center justify-center'>
            <div className='flex flex-row items-center justify-evenly h-[24rem] w-[48rem] bg-slate-900 rounded-md'>
                <StudentCard/>
                <TeacherCard/>
            </div>
        </div>
    )
}

export default page
