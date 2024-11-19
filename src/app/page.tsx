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
import { FetchAllPolls } from "@/services/poll.service";
import { Poll } from "@/types/poll";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [availablePolls, setAvailablePolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);
  const {isLoading,setLoading} = useLoading();
  const FetchPolls = async () => {
    setLoading(true);
    try {
      const polls = await FetchAllPolls();
      setAvailablePolls(polls);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch polls";
      setError(errorMessage);
      console.log(err);
    }finally{
        setLoading(false);
    }
  };
  useEffect(() => {
    FetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!availablePolls.length) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>No Polls Available</CardTitle>
          <CardDescription>
            There are currently no active polls. Check back later!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="rounded-none shadow-nnone bg-none h-full">
      <CardHeader className="text-center">
        <CardTitle>Available Polls</CardTitle>
        <CardDescription>Browse and participate in active polls</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {availablePolls.map((poll) => {
          return <PollPreview poll={poll} key={poll.pollId} />;
        })}
      </CardContent>
    </Card>
  );
}
