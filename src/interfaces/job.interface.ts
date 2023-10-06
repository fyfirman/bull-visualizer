export interface Job {
  id: string;
  name: string;
  data: Data;
  opts: Opts;
  progress: number | object;
  delay: number;
  timestamp: number;
  attemptsMade: number;
  stacktrace: any[];
  returnvalue: any;
  finishedOn: number;
  processedOn?: number;
  status: string;
  failedReason?: string;
}

export interface Data {
  org_id: string;
  hash_id: string;
  received_at: string;
}

export interface Opts {
  jobId: string;
  attempts: number;
  delay: number;
  timestamp: number;
}
