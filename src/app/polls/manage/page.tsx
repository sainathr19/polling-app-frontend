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
import useLoading from "@/hooks/useLoading";
import {
  closePollByID,
  deletPollById,
  fetch_all_polls,
  resetPollByID,
} from "@/services/poll.service";
import { Poll } from "@/types/poll";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ManagePolls() {
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const { isLoading, setLoading } = useLoading();
  const FetchUserPolls = async () => {
    setLoading(true);
    try {
      const polls = await fetch_all_polls();
      setUserPolls(polls);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchUserPolls();
  }, []);
  const handlePollReset = async (pollId: string) => {
    const confirmation = confirm(
      "Are you sure you want to reset this poll? All votes will be cleared, but the poll will remain open."
    );
    if (!confirmation) return;
    try {
      const response = await resetPollByID(pollId);
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
      const response = await deletPollById(pollId);
      FetchUserPolls();
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
      const response = await closePollByID(pollId);
      FetchUserPolls();
    } catch (err) {
      toast.error("Unknown Error Occured");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polls</CardTitle>
        <CardDescription>Explore through our interesting Polls</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
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
      </CardContent>
    </Card>
  );
}
