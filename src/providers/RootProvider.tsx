import { AuthProvider } from "@/hooks/useAuth"
import { ReactNode } from "react"
import { Toaster } from "react-hot-toast"

type Props = {
    children : ReactNode
}
const RootProvider = ({children} : Props)=>{
    return <AuthProvider>
        <Toaster/>
        {children}
    </AuthProvider>
}

export default RootProvider;