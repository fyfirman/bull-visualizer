import { Job } from "~/interfaces/job.interface";
import { axios } from "~/utils/axios-client";

function removeDuplicateObjects<T>(array: T[], key: string): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const itemKey = item[key];
    if (!seen.has(itemKey)) {
      seen.add(itemKey);
      return true;
    }
    return false;
  });
}

const getExample = async (url: string, token: string) => {
  const { data } = await axios.get<{
    data: Record<string, Job[]>;
  }>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = {};

  Object.keys(data.data).forEach((key) => {
    result[key] = removeDuplicateObjects(data.data[key], "id").sort((a, b) => {
      const [_a, numberA] = a.name.split("_");
      const [_b, numberB] = b.name.split("_");
      return Number(numberA) - Number(numberB);
    });
  });

  return {
    data: result,
  };
};

const exampleService = {
  getExample,
};

export default exampleService;
