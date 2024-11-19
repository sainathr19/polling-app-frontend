"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  ClosePollByID,
  DeletPollById,
  FetchUserPolls,
  ResetPollByID,
} from "@/services/poll.service";
import { Poll } from "@/types/poll";
import { toast } from "react-hot-toast";

export default function ManagePolls() {
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const { isLoading, setLoading } = useLoading();
  const { Username } = useAuth();

  const fetchUserPolls = async () => {
    if (!Username) {
      return;
    }
    setLoading(true);
    try {
      const polls = await FetchUserPolls(Username);
      setUserPolls(polls);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch polls";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Username) {
      fetchUserPolls();
    }
  }, []);

  const handlePollReset = async (pollId: string) => {
    try {
      await ResetPollByID(pollId);
      toast.success("Poll has been reset successfully");
      await fetchUserPolls();
    } catch (error) {
      toast.error("Failed to reset poll");
    }
  };

  const handlePollDelete = async (pollId: string) => {
    try {
      await DeletPollById(pollId);
      setUserPolls((prev) => prev.filter((poll) => poll.pollId !== pollId));
      toast.success("Poll has been deleted successfully");
    } catch (error) {
      toast.error("Failed to delete poll");
    }
  };

  const handlePollClose = async (pollId: string) => {
    try {
      await ClosePollByID(pollId);
      await fetchUserPolls();
      toast.success("Poll has been closed successfully");
    } catch (error) {
      toast.error("Failed to close poll");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Manage Your Polls</CardTitle>
        <CardDescription>View, edit, and manage your created polls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          {userPolls.length > 0 ? (
            userPolls.map((poll) => (
              <ManagePollCard
                key={poll.pollId}
                poll={poll}
                actions={{
                  reset: () => handlePollReset(poll.pollId),
                  close: () => handlePollClose(poll.pollId),
                  delete: () => handlePollDelete(poll.pollId)
                }}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No polls found</p>
            </div>
          )}
        </CardContent>
    </Card>
  );
}