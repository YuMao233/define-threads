import {
  Worker,
  isMainThread,
  workerData,
  parentPort,
  type WorkerOptions,
} from "worker_threads";

export type ThreadCallback = (...args: any[]) => Promise<any>;

export function threadContext(
  path: string | URL,
  threadOptions: WorkerOptions = {}
) {
  let orderId: number = 0;
  return <T extends ThreadCallback>(callback: T) => {
    orderId++;
    if (workerData?.orderId === orderId && !isMainThread) {
      execCallback(callback, ...workerData.params);
    }
    return buildThreadFunction(orderId, path, threadOptions) as T;
  };
}

async function execCallback(
  callback: ThreadCallback,
  ...args: any[]
): Promise<void> {
  try {
    const result = await callback(...args);
    parentPort!.postMessage(result);
  } catch (error) {
    parentPort!.postMessage(error);
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
        workerData: {
          orderId,
          params: args,
          ...threadOptions?.workerData,
        },
        ...threadOptions,
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
