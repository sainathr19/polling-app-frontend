import { ChartNoAxesCombined, RotateCcw, Trash, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Poll } from "@/types/poll";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = { 
  poll: Poll, 
  actions: {
    reset: (PollId : string) => Promise<void>,
    close: (PollId : string) => Promise<void>,
    delete: (PollId : string) => Promise<void>
  }
};

const ManagePollCard = ({ poll, actions }: Props) => {
  const confirmationDialogs = [
    {
      title: "Reset Poll",
      description: "Are you sure you want to reset this poll? All votes will be cleared, but the poll will remain open.",
      action: actions.reset,
      icon: <RotateCcw />,
      variant: "secondary" as const
    },
    {
      title: "Close Poll", 
      description: "Are you sure you want to close this poll? This action cannot be undone, and the poll cannot be voted on from now.",
      action: actions.close,
      icon: <X />,
      variant: "secondary" as const
    },
    {
      title: "Delete Poll",
      description: "Are you sure you want to delete this poll? This action cannot be undone, and all data associated with the poll will be permanently removed.",
      action: actions.delete,
      icon: <Trash />,
      variant: "secondary" as const
    }
  ];

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
        {confirmationDialogs.map((dialog, index) => (
          <ConfirmDialog
            key={index}
            title={dialog.title}
            description={dialog.description}
            onConfirm={()=>dialog.action(poll.pollId)}
            trigger={
              <Button variant={dialog.variant}>
                {dialog.icon}
              </Button>
            }
          />
        ))}
      </CardFooter>
    </Card>
  );
};

export default ManagePollCard;