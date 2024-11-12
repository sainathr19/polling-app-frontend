import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const Navbar = () => {
  const {isAuthenticated} = useAuth();
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
          </>
        }
      </div>
    </nav>
  );
};

export default Navbar;
