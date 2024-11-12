export interface PollOption {
    optionText: string;
    optionId: string;
    votes: number;
  }
  
export interface Poll {
    title: string;
    creatorId: string;
    pollId: string;
    options: PollOption[];
    status: "OPEN" | "CLOSED";
    createdAt: string;
    updatedAt: string;
  }
export interface VoteData{
  optionId : string,
  pollId : string,
  userId : string,
  createdAt : string
}
  
export interface PollUpdate{
  poll_data : Poll,
  last_10_votes : VoteData[]
}