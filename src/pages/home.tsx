import "~/App.css";
import Loading from "~/components/loading";
import JobCard from "~/components/job-card";
import { Switch } from "~/components/ui/switch";
import { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import exampleService from "~/services/example-service";
import errorHandler from "~/helpers/error-handler";
import { LayoutGroup, motion } from "framer-motion";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useLocalstorageState } from "rooks";

const getDataKeys = (object: object) => {
  const keys: string[] = [];
  Object.keys(object).forEach((status) => {
    object[status].forEach((job) => {
      keys.push(...Object.keys(job.data));
    });
  });

  return [...new Set(keys)];
};

const defaultUrl = "http://localhost:3000/api/asset-inventory/batch-queue";
const defaultToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImd0eSI6WyJhdXRob3JpemF0aW9uX2NvZGUiLCJyZWZyZXNoX3Rva2VuIl0sImtpZCI6IlRkd0RTMVFFaVJmbVBGb0t6OG9MdWZDWUFWTSJ9.eyJhdWQiOiI0YjJiOWVjNC1lM2FmLTQyODktODg3Ni1lNDRlMTJmNmNlOTAiLCJleHAiOjE2OTc1MDk5NDIsImlhdCI6MTY5NzUwOTA0MiwiaXNzIjoiaWRlbnRpdHkuYXV0b2JhaG4tc2VjdXJpdHkuY29tIiwic3ViIjoiMTQyNmZkOTktYTE4Yi00Y2EzLWE0M2UtNzhjYTllNTFiZjY0IiwianRpIjoiZjI2ZDI5NTQtMWI3ZS00ZDZlLWFkMGEtYjc5YTdiZjhkYTg3IiwiYXV0aGVudGljYXRpb25UeXBlIjoiUkVGUkVTSF9UT0tFTiIsImVtYWlsIjoiZmlybWFuc3lhaC55YW51YXJAYXV0b2JhaG4tc2VjdXJpdHkuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjpbImFiLWFkbWluIl0sImF1dGhfdGltZSI6MTY5NzUwOTAzNywiYXBwbGljYXRpb25JZCI6IjRiMmI5ZWM0LWUzYWYtNDI4OS04ODc2LWU0NGUxMmY2Y2U5MCIsInRpZCI6IjBkZTJkNDQzLTg2YWItOTY0NS1lYjhjLWRkOWM4YzE3NTY2MCIsInNpZCI6ImVlYmVlMmY0LWE4NTItNDliYS05MzhjLTA3NmE4Y2Q5MjRkOCIsInR3b0ZhY3RvcnMiOltdLCJodHRwczovL3VzZXItZGF0YS9lbWFpbCI6ImZpcm1hbnN5YWgueWFudWFyQGF1dG9iYWhuLXNlY3VyaXR5LmNvbSIsImh0dHBzOi8vdXNlci1kYXRhL3JvbGUiOiJhYi1hZG1pbiIsImlkcCI6IkZ1c2lvbkF1dGgiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOmRhc2hib2FyZDpjeWJlcmZpdG5lc3MiLCJhc3NpZ246c2NhbnMiLCJjcmVhdGU6ZGFzaGJvYXJkOmN5YmVyZml0bmVzcyIsImNyZWF0ZTpyZXBvcnRzIiwiY3JlYXRlOnNjYW5zIiwiZGVhY3RpdmF0ZTphZG1pbnMiLCJkZWFjdGl2YXRlOnVzZXJzIiwiZGVtb3RlOmFkbWlucyIsImRlbW90ZTp1c2VyOm93bmVyIiwiZGlnZXN0OmF1dG9iYWhuOnNjYW5zIiwiZGlzYWJsZTphY2NvdW50cyIsImRvd25ncmFkZTphY2NvdW50cyIsImRvd25sb2FkOmRhc2hib2FyZDpjeWJlcmZpdG5lc3MiLCJleHBvcnQ6YXNzZXRzIiwiZXhwb3J0Omlzc3VlcyIsImZsYWc6bGltaXQ6YWNjb3VudHMiLCJpbnZpdGU6dXNlcnMiLCJwcm9tb3RlOmFkbWlucyIsInByb21vdGU6dXNlcnMiLCJyZWFkOmFsbDphc3NldHMiLCJyZWFkOmFsbDpvcmdhbml6YXRpb25zIiwicmVhZDphbGw6c2NhbnMiLCJyZWFkOmF1dG9iYWhuOmlzc3VlcyIsInJlYWQ6ZGFzaGJvYXJkOmN5YmVyZml0bmVzcyIsInJlYWQ6dXNlcjphc3NldHMiLCJyZWFkOnVzZXI6aGFja2FiaWxpdHkiLCJyZWFkOnVzZXI6aXNzdWVzIiwicmVhZDp1c2VyOnBkZiIsInJlYWQ6dXNlcjpzY2FucyIsInJlYWQ6dXNlcjp3b3Jrb3V0cyIsInJlbmV3OmFjY291bnRzIiwic2VuZDpqaXJhOmFzc2V0cyIsInNlbmQ6amlyYTp3b3Jrb3V0cyIsInNlbmQ6amlyYTppc3N1ZXR5cGUiLCJzZXQ6ZXhwb3J0OmludGVncmF0aW9ucyIsInNldDppbXBvcnQ6aW50ZWdyYXRpb25zIiwic3RhcnQ6dXNlcjpzY2FuIiwidXBkYXRlOmFkZG9uczphY2NvdW50cyIsInVwZGF0ZTphbGw6c2NhbnMiLCJ1cGRhdGU6YXNzZXQ6dGFibGVzIiwidXBkYXRlOmF1dG9iYWhuOmlzc3VlcyIsInVwZGF0ZTphdXRvYmFobjpzZXZlcml0eSIsInVwZGF0ZTphdXRvYmFobjp3b3Jrb3V0cyIsInVwZGF0ZTpjb21wYW55OmluZm9ybWF0aW9uIiwidXBkYXRlOmNvbXBhbnk6bm90aWZpY2F0aW9uIiwidXBkYXRlOmRhc2hib2FyZDpjeWJlcmZpdG5lc3MiLCJ1cGRhdGU6ZmVhdHVyZXM6dGllcnMiLCJ1cGRhdGU6aXBsaW1pdHMiLCJ1cGRhdGU6aXNzdWU6dGFibGVzIiwidXBkYXRlOnByZXZpZXc6ZmVhdHVyZXMiLCJ1cGRhdGU6c2NhbmNvbmZpZ3MiLCJ1cGRhdGU6c2NhbmxpbWl0cyIsInVwZGF0ZTp1c2VyOm5vdGlmaWNhdGlvbiIsInVwZGF0ZTp1c2VyOnNldHRpbmciLCJ1cGdyYWRlOmFjY291bnRzIiwiZGVsZXRlOmFkbWlucyIsImRlbGV0ZTp1c2VycyJdLCJodHRwczovL3VzZXItZGF0YS9tZXRhZGF0YSI6eyJ1c2VyX2lkIjoiMTQyNmZkOTktYTE4Yi00Y2EzLWE0M2UtNzhjYTllNTFiZjY0IiwiZmlyc3RfbmFtZSI6IkZpcm1hbnN5YWgiLCJsYXN0X25hbWUiOiJZYW51YXIiLCJvcmdfaWQiOiJjZmU2M2FmNy05ZDY3LTQ1YjUtOThmZS02NTBiYzBiMmU0YmMiLCJvcmdfbmFtZSI6IlN1cGVyY29vbCBBQiIsInN1YnNjcmliZWRfdW50aWwiOjE3NDYwMjU1OTMwMDAsInRyaWFsX3VudGlsIjo0ODEzMzcwNzc2MDAwLCJyb2xlIjoiYWItYWRtaW4ifX0.JGrKcO_FKQEt9i5k2YUhvr3Vz5OcqhIvv7-SFaDQ_WzVZxcr1HEzYeZyk-DQDZGMbNCnGtQyJI3dLuhnUAftnyFGhvScyNZFVbtRhMQscLNQgg-G8e6XHFwgTZsFZFkwtMNr04762uKRVaaphi-GBqT7wnZh5F9ryzLl-BM2RNCZ_meU9TX5VbgK69Wk6Fz0nSTZO0fMn7qF4Z9tBWBKKPSZYTd_-OY7wvUY5t5iAmx3FHmRZbs_du2_EtIHQmGSk3uLaoHA9f5_-WRcp47h9jGs-LPJYYFog7Sc-WnW8BCAAsxIw2niH0JRuchD12m6Gm_m5PbDCfV4ez8ny-so-A";

function Home() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [hideDetail, setHideDetail] = useState<boolean>(false);
  const [url, setUrl] = useLocalstorageState<string>("url");
  const [token, setToken] = useLocalstorageState<string>("token");

  const { data, isLoading } = useQuery({
    queryKey: ["example", url, token],
    queryFn: () => exampleService.getExample(url, token),
    onError: errorHandler,
    refetchInterval: 500,
  });

  const dataKeys = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return getDataKeys(data.data);
  }, [data?.data]);

  return (
    <div className="App">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Bull Visualizer</h1>
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <Switch
                checked={hideDetail}
                id="hide-details"
                onCheckedChange={setHideDetail}
              />
              <Label htmlFor="hide-details">Hide Details</Label>
            </div>
            <Popover>
              <PopoverTrigger>
                <Button>
                  <span>Show keys</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2 text-sm">
                  {dataKeys.map((dataKey) => (
                    <div key={dataKey} className="flex justify-between ">
                      <span>{dataKey}</span>
                      <Switch
                        checked={selectedKeys.includes(dataKey)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedKeys((prev) => [...prev, dataKey]);
                          } else {
                            setSelectedKeys((prev) =>
                              prev.filter((v) => v !== dataKey)
                            );
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5 text-left">
            <Label htmlFor="url">Url</Label>
            <Input
              id="url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder={defaultUrl}
              type="text"
              value={url}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 text-left">
            <Label htmlFor="token">Token</Label>
            <Input
              id="token"
              onChange={(e) => setToken(e.target.value)}
              placeholder={defaultToken}
              type="text"
              value={token}
            />
          </div>
        </div>
      </div>

      {!isLoading && data ? (
        <LayoutGroup>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {Object.keys(data.data)
              .sort((a, b) => {
                const sortOrder = [
                  "waiting",
                  "waiting-children",
                  "prioritized",
                  "active",
                  "completed",
                  "failed",
                  "repeat",
                  "delayed",
                  "paused",
                  "wait",
                ];
                return sortOrder.indexOf(a) - sortOrder.indexOf(b);
              })
              .map((status) => (
                <div key={status} className="flex flex-col gap-4">
                  <h3 className="px-4 font-medium text-muted-foreground">
                    {status} ({data.data[status].length})
                  </h3>
                  <motion.div className="flex flex-col gap-4" layout>
                    {data.data[status].map((job) => (
                      <motion.div
                        key={job.id}
                        layoutId={`job-card-board-${job.id}`}
                      >
                        <JobCard
                          data={job}
                          showDetail={!hideDetail}
                          showKeys={selectedKeys}
                          status={status}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
          </div>
        </LayoutGroup>
      ) : (
        <Loading />
      )}

      <p className="read-the-docs">Handmade by Firman</p>
    </div>
  );
}

export default Home;
