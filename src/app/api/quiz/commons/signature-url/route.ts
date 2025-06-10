import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from 'next/server'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    
})

export async function GET(_: NextRequest) {
    try {
        const timeStamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timeStamp,
            folder: 'MockQuiz',
            max_file_size: 7000000,
            resource_type: 'image',
            expires_at: timeStamp + 600
        }, process.env.CLOUDINARY_API_SECRET);

        return NextResponse.json({
            signature:signature,
            timestamp:timeStamp,
            folder:'MockQuiz',
            max_file_size:7000000,
            resource_type: 'image',
            expires_at: timeStamp + 600,
            api_key:process.env.CLOUDINARY_API_KEY,
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME
        })
    } catch (error) {
        console.log('Error at generating signed-url ::::: ');
        console.error(error);
        return NextResponse.json({message:'Something Went Wrong during generating signed-url.',error:error},{status:500});
    }
}