"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Loader2, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function RoleSelector() {
    const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER" | "">("")
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const {isLoaded,isSignedIn,user} = useUser();
    const router = useRouter();

    if(!isLoaded || !isSignedIn || (user.publicMetadata?.role === "STUDENT"||user.publicMetadata?.role === "TEACHER")) return;

    const handleRoleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if(!isLoaded || !isSignedIn || !user) return;
            const updateResponse = await fetch('/api/users/set-role/',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:user?.id,
                    role:selectedRole
                })
            })

            if(!updateResponse.ok){
                throw new Error(`HTTP error status : ${updateResponse.status}`)
            }
            console.log("Data updated successfully.")

            setIsDialogOpen(false);

            router.push("/dashboard")
        } catch (error) {
            console.error("Failed due to : ",error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
            background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        }}
        >
            <Card
            className="w-full max-w-lg border-0 shadow-2xl"
            style={{
            background: "linear-gradient(145deg, #1e1e2e, #2a2a3e)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
            }}
            >
                <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold tracking-tight" style={{ color: "#e2e8f0" }}>
                        Which Role Suits you the best?
                    </CardTitle>
                </CardHeader>

                <CardContent className="pb-8">
                    <div className="flex gap-6 justify-center">
                        <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setSelectedRole("STUDENT")}
                        className={`flex flex-col items-center gap-4 h-auto py-8 px-14 border-2 transition-all duration-300 ${
                            selectedRole === "STUDENT"
                            ? "border-blue-400 shadow-lg shadow-blue-400/25"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        style={{
                            background:
                            selectedRole === "STUDENT"
                                ? "linear-gradient(145deg, #1e3a8a, #3b82f6)"
                                : "linear-gradient(145deg, #374151, #4b5563)",
                            color: "#e2e8f0",
                            transform: selectedRole === "STUDENT" ? "scale(1.05)" : "scale(1)",
                        }}
                        >
                            <GraduationCap size={40} className={selectedRole === "STUDENT" ? "text-blue-200" : "text-gray-300"} />
                            <span className="font-semibold text-base">STUDENT</span>
                        </Button>

                        <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setSelectedRole("TEACHER")}
                        className={`flex flex-col items-center gap-4 h-auto py-8 px-14 border-2 transition-all duration-300 ${
                            selectedRole === "TEACHER"
                            ? "border-emerald-400 shadow-lg shadow-emerald-400/25"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        style={{
                            background:
                            selectedRole === "TEACHER"
                                ? "linear-gradient(145deg, #065f46, #10b981)"
                                : "linear-gradient(145deg, #374151, #4b5563)",
                            color: "#e2e8f0",
                            transform: selectedRole === "TEACHER" ? "scale(1.05)" : "scale(1)",
                        }}
                        >
                            <Users size={40} className={selectedRole === "TEACHER" ? "text-emerald-200" : "text-gray-300"} />
                            <span className="font-semibold text-base">TEACHER</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end px-14">
                    <Dialog open={isDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant={"secondary"} disabled={selectedRole===""} onClick={()=>setIsDialogOpen(true)}>Select</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Role selected as {selectedRole}</DialogTitle>
                                <DialogDescription>
                                    Your Role is selected as {selectedRole}, Are you sure? As this will be your final choice, you won't able to change it no more.
                                </DialogDescription>
                            </DialogHeader>
                            <div>
                                <DialogDescription>
                                    {
                                        (selectedRole==="STUDENT")?
                                        "You have selected your role as a Student. You will be able to see and attempt various quizzes based on Subjects and check the score you have secured."
                                        :
                                        "You have selected your role as a Teacher. You will be able to create and share various quizzes based on the Subjects and check the number of students attempted and score of the students."
                                    }
                                </DialogDescription>
                            </div>
                            <DialogFooter>
                                <Button disabled={isLoading} onClick={handleRoleSubmit}>
                                    {
                                        (isLoading)?
                                        <>
                                        <Loader2 className="animate-spin"/>
                                        Loading...
                                        </>:
                                        "SUBMIT"
                                    }
                                </Button>
                                <Button onClick={()=>setIsDialogOpen(false)}>
                                    CANCEL
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}
