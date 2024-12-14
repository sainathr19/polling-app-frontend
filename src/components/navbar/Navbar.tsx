import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import axiosInstance from "@/services/api.service";

const Navbar = () => {
  const {isAuthenticated , setIsAuthenticated} = useAuth();

  const handleLogout = async () => {
    try{
      await axiosInstance.get("/auth/logout")
      setIsAuthenticated(false)
    }catch(err){
      console.log(err);
    }
  }
  return (
    <nav className="w-full bg-slate-100 py-3 px-8 flex justify-between">
      <Link href="/" className="text-xl font-medium">
        Survey Sphere
      </Link>
      <div className="flex gap-3 items-center">
        {
          !isAuthenticated ? <Link href="/auth/signin">Sign In</Link> :         
          <>
          <Link
            href="/polls/manage"
            className="px-2 py-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium  bg-secondary text-secondary-foreground shadow hover:bg-secondary/80"
          >
            <span className="text-base">Manage Polls</span>
          </Link>
          <Link
            href="/polls/new"
            className="px-2 py-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium  bg-secondary text-secondary-foreground shadow hover:bg-secondary/80"
          >
            <span className="text-base">Create New</span>
          </Link>

          <Button variant="secondary" onClick={handleLogout}><LogOutIcon/></Button>
          </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
