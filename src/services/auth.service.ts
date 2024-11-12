import toast from "react-hot-toast";
import axiosInstance from "./api.service";

async function startRegistration(username : string){
    try{
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/register/start/${username}`)
        const response = await axiosInstance.post(`/auth/register/start/${username}`);
        return response.data;
    }catch(err){
        console.log(err);
    }
}


async function startAuthenticationWithUsername(username: string) {
    try {
      const response = await axiosInstance.post(`/auth/authenticate/start/${username}`);
      return response.data.publicKey;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to retrieve registration options from backend");
    }
  }

async function finishAuthenticationwithUsername(username: string, credentials: any) {
  try {
    const response = await axiosInstance.post(`/auth/authenticate/finish/${username}`, credentials);
    console.log(response);
    if (response.status === 200) {
      toast.success("SignIn successful!");
    } else {
      toast.error("SignIn failed, please try again.");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to retrieve Authentication options from backend");
  }
}

  async function startRegistrationWithUsername(username: string) {
    try {
      const response = await axiosInstance.post(`/auth/register/start/${username}`);
      return response.data.publicKey;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to retrieve registration options from backend");
    }
  }

  async function finishRegistrationwithUsername(username : string , credentials : any){
    try {
      const response = await axiosInstance.post(`/auth/register/finish/${username}`);
      if (response.status === 200) {
        toast.success("Registration successful!");
      } else {
        toast.error("Registration failed, please try again.");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Failed to retrieve registration options from backend");
    }
  }
export {startRegistrationWithUsername,finishRegistrationwithUsername, startAuthenticationWithUsername,finishAuthenticationwithUsername};