"use client"
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Switch } from "@/components/ui/switch";
import { Activity, User } from 'lucide-react';
import { Poll, PollUpdate, VoteData } from '@/types/poll';
import axiosInstance from '@/services/api.service';
import { useParams } from 'next/navigation';
import { useSSE } from '@/hooks/useSSE';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL || 'http://localhost:5000';

const PollOverview = () => {
  const [isLiveUpdates, setIsLiveUpdates] = useState(false);
  const [pollData, setPollData] = useState<Poll | null>(null);
  const [recentVotes, setRecentVotes] = useState<VoteData[]>([]);
  const { pollId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [LiveData,setLiveData] = useState<Poll>();

  const sseUrl = pollId ? `${SSE_BASE_URL}/${pollId}/live` : null;
  const { data: liveData, setData } = useSSE<PollUpdate>(sseUrl, {});

  const fetchPollData = useCallback(async () => {
    if (!pollId) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`polls/${pollId as string}/overview`);
      setPollData(response.data.poll_data);
      setRecentVotes(response.data.last_10_votes);
    } catch (error) {
      console.error('Error fetching poll data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPollData();
  }, []);

  useEffect(() => {
    if (isLiveUpdates && liveData) {
      setPollData(liveData.poll_data);
      setRecentVotes(liveData.last_10_votes);
    }
  }, [isLiveUpdates, liveData]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <g>
        <text
          x={x + width + 5}
          y={y + height / 2}
          fill="#666"
          dominantBaseline="middle"
          fontSize={14}
        >
          {`${value.toFixed(1)}%`}
        </text>
      </g>
    );
  };

  if (isLoading || !pollData) {
    return <Loader />;
  }

  const totalVotes = pollData.options.reduce((acc, option) => acc + option.votes, 0);
  const chartData = pollData.options.map(option => ({
    ...option,
    percentage: totalVotes ? (option.votes / totalVotes) * 100 : 0
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6">
        {/* Poll Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <Badge variant="outline" className="mb-2">
                  #{pollData.pollId}
                </Badge>
                <CardTitle className="text-2xl">{pollData.title}</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isLiveUpdates}
                    onCheckedChange={setIsLiveUpdates}
                  />
                  <span className="text-sm">Live Updates</span>
                </div>
                <Badge variant="secondary">
                  <Activity className="w-4 h-4 mr-1" />
                  {totalVotes} votes
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Results Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='h-max'>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  barSize={40}
                >
                  <XAxis
                    dataKey="optionText"
                    textAnchor="middle"
                    height={60}
                    tick={{ fontSize: 18 }}
                    tickMargin={10}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => (
                      <div className="bg-white shadow-lg p-2">
                        <div className="font-medium">{payload?.[0]?.payload?.optionText}</div>
                        <div className="font-bold">{payload?.[0]?.payload?.votes} votes</div>
                        <div className="text-sm text-muted-foreground">
                          {payload?.[0]?.payload?.percentage.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  />
                  <Bar
                    dataKey="votes"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <LabelList
                    content={CustomLabel}
                    position="right"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Votes */}
        <Card>
          <CardHeader>
            <CardTitle>Last 10 Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {recentVotes.map((vote,index) => (
                <div key={index} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{vote.userId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge>{vote.optionId}</Badge>
                    <span>{formatTimestamp(vote.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PollOverview;