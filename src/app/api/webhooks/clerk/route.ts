import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Role } from "@/generated/prisma";

export async function POST(req:NextRequest){
    try {
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp")
        const svix_signature = headerPayload.get("svix-signature")

        if(!svix_id || !svix_signature || !svix_timestamp){
            console.error("SVIX header missing");
            return NextResponse.json({message:"SVIX headers missing"},{status:400});
        }

        if(!process.env.CLERK_WEBHOOK_SECRET){
            console.error("Missing CLERK WEBHOOK SECRET");
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);

        const webhook_ = new Webhook((process.env.CLERK_WEBHOOK_SECRET) as string)

        let event;

        try {
            event = webhook_.verify(body,{
                "svix-id":svix_id,
                "svix-signature":svix_signature,
                "svix-timestamp":svix_timestamp
            }) as WebhookEvent
        } catch (error) {
            console.log("Webhook verification failed");
            console.error(error);
            return NextResponse.json({message:"failed verification."},{status:400});
        }

        const {id} = event.data;
        const eventType = event.type;

        console.log(`Id ${id} has the eventType = ${eventType}`);
        console.log("BOdy::::::");
        console.log(body)

        switch (eventType){
            case "user.created":
                await handleUserCreated(event.data);
                break;
            case "user.updated":
                await handleUserUpdate(event.data);
                break;
            case "user.deleted":
                await handleUserDelete(event.data.id as string);
                break;
            default:
                console.log(`unhandled event type : ${eventType}`);
        }

        return NextResponse.json({message:"Action handled"},{status:200});
    } catch (error) {
        console.log("Error occured at WEBHOOK");
        console.error(error);
        return NextResponse.json({message:"Error Occurec",data:error},{status:500});
    }
}

async function handleUserCreated(data:UserJSON){
    try {
        const {id,first_name,last_name,email_addresses,created_at} = data;

        const fullname = `${first_name?.trim()} ${last_name?.trim()}`

        const userCreation = await prisma.user.create({
            data:{
                clerkId:id,
                email:email_addresses[0]?.email_address,
                fullname:fullname,
                emailVerified:email_addresses[0]?.verification?.status==="verified",
                createdAt:new Date(created_at)
            }
        })

        console.log("User created Successfully",userCreation);
    } catch (error) {
        console.error("Somehow the user creation failed.",error);
    }
}

async function handleUserUpdate(data:UserJSON){
    try {

        const {id,public_metadata,email_addresses,first_name,last_name} = data;

        const existance = await prisma.user.findUnique({
            where:{
                clerkId:id
            },
            select:{
                id:true
            }
        })

        if(!existance){
            throw new Error("User doesn't exists");
        }

        const fullname = `${first_name?.trim()} ${last_name?.trim()}`
        const updateDatabaseResponse = await prisma.user.update({
            where:{clerkId:id},
            data:{
                role:public_metadata?.role as Role,
                fullname:fullname,
                email:email_addresses[0]?.email_address,
                emailVerified:email_addresses[0]?.verification?.status==="verified"
            }
        })

        console.log("User updated:::");
        console.log(updateDatabaseResponse);

        return updateDatabaseResponse;
    } catch (error) {
        console.error("--------Error updating User data--------");
        console.error(error);
    }
}

async function handleUserDelete(id:string){
    try {
        const existance = await prisma.user.findUnique({
            where:{
                clerkId:id
            },
            select:{
                id:true
            }
        })

        if(!existance){
            throw new Error("User doesn't exists");
        }

        const deleteResponse = await prisma.user.delete({
            where:{
                clerkId:id
            }
        })

        if(!deleteResponse){
            throw new Error("Deletion error");
        }

        console.log("User deleted with the database id : ",deleteResponse.id);
    } catch (error) {
        console.error("--------Error deleting User--------");
        console.error(error);
    }
}