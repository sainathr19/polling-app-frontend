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
import { Poll } from "@/types/poll";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/api.service";

export default function ManagePolls() {
  const [userPolls, setUserPolls] = useState<Poll[]>([]);
  const { isLoading, setLoading } = useLoading();
  const { Username } = useAuth();

  const FetchUserPolls = async () => {
    setLoading(true);
    try {
      const {data : Polls} = await axiosInstance.get(`/all?userId=${Username}`);
      setUserPolls(Polls);
    } catch(err : any) {
      toast.error(err.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Username) {
      FetchUserPolls();
    }
  }, []);

  const handlePollReset = async (pollId: string) => {
    try {
      const {data : response} = await axiosInstance.post(`/polls/${pollId}/reset`);
      toast.success(response);
      await FetchUserPolls();
    } catch (error : any) {
      toast.error(error.data?.message);
    }
  };

  const handlePollDelete = async (pollId: string) => {
    try {
      const {data : response} = await axiosInstance.get(`/polls/${pollId}/delete`);
      setUserPolls((prev) => prev.filter((poll) => poll.pollId !== pollId));
      toast.success(response);
    } catch (error : any) {
      toast.error(error.data?.message);
    }
  };

  const handlePollClose = async (pollId: string) => {
    try {
      const {data : response} = await axiosInstance.post(`/polls/${pollId}/close`);
      toast.success(response);
      await FetchUserPolls();
    } catch (error : any) {
      toast.error(error.data?.message);
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