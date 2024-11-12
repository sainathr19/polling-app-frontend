"use client";
import Loader from "@/components/Loader";
import PollPreview from "@/components/PollPreviewCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLoading from "@/hooks/useLoading";
import { fetch_all_polls } from "@/services/poll.service";
import { useEffect, useState } from "react";
interface PollOption {
  optionText: string;
  optionId: string;
  votes: number;
}

interface PollInfo {
  title: string;
  creatorId: string;
  pollId: string;
  options: PollOption[];
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [availablePolls, setAvailablePolls] = useState<PollInfo[]>([]);
  const {isLoading,setLoading} = useLoading();
  const FetchAllPolls = async () => {
    setLoading(true);
    try {
      const polls = await fetch_all_polls();
      setAvailablePolls(polls);
    } catch (err) {
      console.log(err);
    }finally{
        setLoading(false);
    }
  };
  useEffect(() => {
    FetchAllPolls();
  }, []);
  if(isLoading){
    return <Loader/>
  }
  return (
    <Card className="rounded-none shadow-nnone bg-none h-full">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {availablePolls.map((poll) => {
          return <PollPreview poll={poll} key={poll.pollId} />;
        })}
      </CardContent>
    </Card>
  );
}
