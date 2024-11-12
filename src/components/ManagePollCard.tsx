import { ChartNoAxesCombined, RotateCcw, Trash, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Poll } from "@/types/poll";

type Props = { poll: Poll , handlePollReset : (pollId : string)=> Promise<void>,handlePollDelete : (pollId : string)=> Promise<void>,handlePollClose : (pollId : string)=> Promise<void>};

const ManagePollCard = ({ poll ,handlePollReset,handlePollDelete,handlePollClose}: Props) => {
  let totalVotes = poll.options.reduce((acc, val) => acc + val.votes, 0);
  return (
    <Card className="flex flex-col md:flex-row items-center md:justify-between" key={poll.pollId}>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">
          {poll.title.length < 65
            ? poll.title
            : poll.title.slice(0, 65) + "..."}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-row items-center gap-5">
        <Link href={`/polls/overview/${poll.pollId}`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2">
          <ChartNoAxesCombined />
        </Link>
        <Button variant="secondary" onClick={()=>handlePollReset(poll.pollId)}>
          <RotateCcw />
        </Button>
        <Button variant="secondary" onClick={()=>handlePollClose(poll.pollId)}>
          <X />
        </Button>
        <Button variant="secondary" onClick={()=>handlePollDelete(poll.pollId)}>
          <Trash />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManagePollCard;
