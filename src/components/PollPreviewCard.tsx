import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Poll } from "@/types/poll";

type Props = { poll: Poll };

const PollPreview = ({ poll }: Props) => {
  let totalVotes = poll.options.reduce((acc, val) => acc + val.votes, 0);
  return (
    <Link
      href={`/polls/${poll.pollId}`}
      className="hover:bg-slate-200 rounded-lg"
    >
      <Card className="m-2 border border-slate-200 p-3" key={poll.pollId}>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm sm:text-base">
            {poll.title.length < 65
              ? poll.title
              : poll.title.slice(0, 65) + "..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <h6 className="text-base text-muted-foreground">
            by {poll.creatorId}
          </h6>
          <h6 className="text-base text-muted-foreground">
            {totalVotes} votes
          </h6>
          <h6
            className={`text-base text-muted-foreground ${
              poll.status === "CLOSED" ? "text-red-500" : "text-green-500"
            }`}
          >
            {poll.status === "CLOSED" ? "Closed" : "Open"}
          </h6>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PollPreview;
