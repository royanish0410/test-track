import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from 'next/server'

cloudinary.config({
})

export async function GET(request: NextRequest) {
    try {

    } catch (error) {
        console.log('Error at --------- +++++++++ ::::: ');
        console.error(error);
        return NextResponse.json({message:'Something Went Wrong during --------- +++++++++.',error:error},{status:500});
    }
}