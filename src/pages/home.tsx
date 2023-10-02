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

const getDataKeys = (object: object) => {
  const keys: string[] = [];
  Object.keys(object).forEach((status) => {
    object[status].forEach((job) => {
      keys.push(...Object.keys(job.data));
    });
  });

  return [...new Set(keys)];
};

function Home() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["example"],
    queryFn: exampleService.getExample,
    onError: errorHandler,
    refetchInterval: 3000,
  });

  const dataKeys = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return getDataKeys(data.data);
  }, [data?.data]);

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <div className="App">
      <div className="flex flex-col">
        <div className="flex items-center justify-between space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Bull Visualizer</h1>
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

      <LayoutGroup>
        <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6" layout>
          {Object.keys(data.data).map((status) => (
            <div key={status} className="flex flex-col gap-4">
              <h3 className="px-4 font-medium text-muted-foreground">
                {status}
              </h3>
              <div className="flex flex-col gap-4">
                {data.data[status].map((job) => (
                  <motion.div
                    key={job.id}
                    layoutId={`job-card-board-${job.id}`}
                  >
                    <JobCard data={job} showKeys={selectedKeys} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </LayoutGroup>
      <p className="read-the-docs">Click on the the logos to learn more</p>
    </div>
  );
}

export default Home;
