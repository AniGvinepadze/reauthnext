import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export default async function LoggedOutLayout({children}:{
    children:React.ReactNode
}){

const session = await auth()

if(!!session?.user?.id){
    redirect("/myAccount")
}

    return children
}