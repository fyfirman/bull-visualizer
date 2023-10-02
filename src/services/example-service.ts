import { Job } from "~/interfaces/job.interface";
import { axios } from "~/utils/axios-client";

const getExample = async () => {
  const { data } = await axios.get<{
    data: Record<string, Job[]>;
  }>("http://localhost:3000/api/asset-inventory/batch-queue");

  return data;
};

const exampleService = {
  getExample,
};

export default exampleService;
