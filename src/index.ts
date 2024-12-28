import {
  Worker,
  isMainThread,
  workerData,
  parentPort,
  type WorkerOptions,
} from "worker_threads";

export type ThreadFunction = (...args: any[]) => Promise<any>;

async function execThreadFunction(
  callback: ThreadFunction,
  ...args: any[]
): Promise<void> {
  try {
    const result = await callback(...args);
    parentPort?.postMessage(result);
  } catch (error) {
    parentPort?.postMessage(error);
  }
}

function buildThreadFunction(
  orderId: number,
  path: string | URL,
  threadOptions: WorkerOptions
) {
  return async (...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path, {
        ...threadOptions,
        workerData: {
          orderId,
          params: args,
          ...threadOptions?.workerData,
        },
      });
      worker.on("message", (data: any) => {
        if (data instanceof Error) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
  };
}

export function createThreadContext(
  path: string | URL,
  threadOptions: WorkerOptions = {}
) {
  let orderId = 0;
  return <T extends ThreadFunction>(callback: T) => {
    orderId++;
    if (workerData?.orderId === orderId && !isMainThread) {
      execThreadFunction(callback, ...workerData.params);
    }
    return buildThreadFunction(orderId, path, threadOptions) as T;
  };
}
