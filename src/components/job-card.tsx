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
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";

interface JobCardProps {
  data: Job;
  showKeys: string[];
  status: string;
  showDetail?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  data,
  showKeys,
  status,
  showDetail = true,
}) => {
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
          <div className="flex gap-2">
            <Badge variant="outline">Attempts made: {data.attemptsMade}</Badge>
            <Badge variant="outline">
              Priority: {data.opts.priority ?? "-"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="gap-4 flex flex-col text-left">
          <div>
            {Number.isNaN(parseInt(data.progress, 10)) ? (
              <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col space-y-1">
                <Progress value={data.progress.totalData / 100} />
                <span className="font-normal leading-snug text-muted-foreground">
                  Iteration : {data.progress.iteration}
                </span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Total data : {data.progress.totalData}
                </span>
              </div>
            ) : null}
          </div>

          {showDetail ? (
            <div>
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

              {data.finishedOn ? (
                <div className="text-xs">
                  <span className="font-medium text-sm">Processed at</span>
                  <p className="text-muted-foreground">
                    {data.processedOn
                      ? format(data.processedOn, "dd MMM yyyy HH:mm:ss")
                      : "-"}
                  </p>
                  <span className="font-medium text-sm">Finished at</span>
                  <p className="text-muted-foreground">
                    {format(data.finishedOn, "dd MMM yyyy HH:mm:ss")}
                  </p>
                  <span className="font-medium text-sm">Duration</span>
                  <p className="text-muted-foreground">
                    {data.finishedOn && data.processedOn
                      ? (data.finishedOn - data.processedOn) / 1000
                      : "-"}
                    s
                  </p>
                </div>
              ) : null}
              {data.failedReason ? (
                <div className="text-xs">
                  <span className="font-bold text-sm">Error</span>
                  <p className="text-muted-foreground overflow-x-auto max-h-[200px]">
                    {data.stacktrace}
                  </p>
                </div>
              ) : null}
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
