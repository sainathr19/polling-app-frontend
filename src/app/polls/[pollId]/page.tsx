"use client";

import PollResultGraph from "@/components/PollResultGraph";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { castVote, fetchWithPollId } from "@/services/poll.service";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import useLoading from "@/hooks/useLoading";
import { useSSE } from "@/hooks/useSSE";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import { Poll, PollUpdate } from "@/types/poll";

const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL || 'http://localhost:5000';

const ViewPoll = () => {
  const [pollData, setPollData] = useState<Poll | null>(null);
  const [LiveData , setLiveData] = useState<Poll>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { isLoading, setLoading } = useLoading();
  const { pollId } = useParams();

  const sseUrl = pollId ? `${SSE_BASE_URL}/polls/${pollId}/live` : null;
  const isPollClosed = pollData?.status === "CLOSED";

  const { data, setData } = useSSE<PollUpdate>(sseUrl, {
    onError: () => toast.error("Lost connection to live updates"),
  });
  useEffect(()=>{
    setLiveData(data?.poll_data)
  },[data])
  const fetchPollData = useCallback(async () => {
    if (!pollId) return;
    setLoading(true);
    try {
      const data = await fetchWithPollId(pollId as string);
      setPollData(data);
    } catch (error) {
      toast.error("Failed to load poll data");
    } finally {
      setLoading(false);
    }
  }, [pollId, setLoading]);

  useEffect(() => {
    fetchPollData();
  }, []);

  const handleVote = async () => {
    if (!selectedOption || !pollId) {
      toast.error("Please select an option to vote.");
      return;
    }
    try {
      await castVote(pollId as string, selectedOption);
      toast.success("Vote cast successfully!");
      setHasVoted(false);
    } catch (error) {
      toast.error("Failed to cast vote. Please try again.");
    }
  };

  if (isLoading || !pollData) {
    return <Loader />;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full place-content-center">
      <div className="h-full w-full flex justify-center items-center">
        <Card className="outline-none border-none rounded-none shadow-none">
          <CardHeader className="text-4xl">{pollData.title}</CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedOption || ""}
              onValueChange={setSelectedOption}
              disabled={isPollClosed}
            >
              {pollData.options.map((option) => (
                <div className="flex items-center space-x-2" key={option.optionId}>
                  <RadioGroupItem 
                    value={option.optionId} 
                    id={option.optionId}
                    disabled={isPollClosed} 
                  />
                  <Label className="text-xl" htmlFor={option.optionId}>{option.optionText}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            {isPollClosed ? (
              <span className="text-muted-foreground">Poll Closed</span>
            ) : (
              <Button
                variant="secondary"
                onClick={handleVote}
                disabled={!selectedOption || hasVoted}
              >
                {hasVoted ? "Voted" : "Vote"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <Card className="outline-none border-none rounded-none shadow-none flex justify-center items-center h-full">
        {isPollClosed ? (
          <PollResultGraph PollData={pollData} />
        ) : LiveData ? (
          <PollResultGraph PollData={LiveData} />
        ) : (
          <span>Vote to view Results</span>
        )}
      </Card>
    </section>
  );
};

export default ViewPoll;
