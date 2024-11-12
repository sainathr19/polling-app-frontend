"use client";
import Loader from "@/components/Loader";
import ManagePollCard from "@/components/ManagePollCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import useLoading from "@/hooks/useLoading";
import {
  ClosePollByID,
  DeletPollById,
  FetchAllPolls,
  FetchUserPolls,
  ResetPollByID,
} from "@/services/poll.service";
import { Poll } from "@/types/poll";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManagePolls() {
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const { isLoading, setLoading } = useLoading();
  const {Username} = useAuth();
  const UserPolls = async () => {
    if(!Username){
      return;
    }
    setLoading(true);
    try {
      const polls = await FetchUserPolls(Username);
      setUserPolls(polls);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    UserPolls();
  }, []);
  const handlePollReset = async (pollId: string) => {
    const confirmation = confirm(
      "Are you sure you want to reset this poll? All votes will be cleared, but the poll will remain open."
    );
    if (!confirmation) return;
    try {
      const response = await ResetPollByID(pollId);
      toast.success("Poll Reset Successfull");
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };
  const handlePollDelete = async (pollId: string) => {
    const confirmation = confirm(
      "Are you sure you want to delete this poll? This action cannot be undone, and all data associated with the poll will be permanently removed."
    );
    if (!confirmation) return;
    try {
      const response = await DeletPollById(pollId);
      setUserPolls((prev)=>prev.filter((poll)=>poll.pollId!=pollId))
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  const handlePollClose = async (pollId: string) => {
    const confirmation = confirm(
      "Are you sure you want to close this poll? This action cannot be undone, and poll cannot be voted from now ."
    );
    if (!confirmation) return;
    try {
      const response = await ClosePollByID(pollId);
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Polls</CardTitle>
        <CardDescription>Explore through our interesting Polls</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {
          userPolls.length> 0 ?         <>
          {userPolls.map((poll) => {
            return (
              <ManagePollCard
                poll={poll}
                key={poll.pollId}
                handlePollReset={handlePollReset}
                handlePollDelete={handlePollDelete}
                handlePollClose={handlePollClose}
              />
            );
          })}
          </>: <span className="text-center">No Polls Found</span>
        }
      </CardContent>
    </Card>
  );
}
