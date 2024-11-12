import { useState } from "react"

const useLoading = ()=>{
    const [isLoading , setLoading] = useState<boolean>(false);
    return {isLoading,setLoading}
}

export default useLoading;