import { format } from "date-fns";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Job } from "~/interfaces/job.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

interface JobCardProps {
  data: Job;
  showKeys: string[];
}

const JobCard: React.FC<JobCardProps> = ({ data, showKeys }) => {
  return (
    <Dialog>
      <DialogContent className="max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Job data</DialogTitle>
          <DialogDescription>
            <div className="rounded-md bg-black p-6 overflow-x-auto text-left max-w-[48vw]">
              <pre>
                <code className="text-sm text-muted-foreground">
                  {JSON.stringify(data, null, 2)}
                </code>
              </pre>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.id}</CardDescription>
        </CardHeader>
        <CardContent className="gap-4 flex flex-col text-left">
          {showKeys.map((key) => (
            <div
              key={key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col space-y-1"
            >
              <span>{key}</span>
              <span className="font-normal leading-snug text-muted-foreground">
                {data.data[key]}
              </span>
            </div>
          ))}

          {data.failedReason ? (
            <div className="text-xs">
              <span className="font-bold text-sm">Error</span>
              <p className="text-muted-foreground">{data.stacktrace}</p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            {format(data.timestamp, "dd MMM yyyy HH:mm:ss")}
          </span>
          <DialogTrigger>
            <Button className="gap-2">
              <EyeOpenIcon />
              View Job Data
            </Button>
          </DialogTrigger>
        </CardFooter>
      </Card>
    </Dialog>
  );
};

export default JobCard;
