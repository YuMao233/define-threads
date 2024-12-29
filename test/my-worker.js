const { createThreadContext } = require("../dist/index");
const { isMainThread } = require("worker_threads");

const defineThread = createThreadContext(__filename);

const calculateSum = defineThread(async (a, b) => {
  return Number(a) + Number(b);
});

const isThreadFunction = defineThread(async () => {
  return isMainThread;
});

const multipleThread = defineThread(async () => {
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    if (!(await isThreadFunction())) {
      sum += await calculateSum(sum, i);
    }
  }
  return sum;
});

// Can't recursive call in thread function
const recursiveTest = defineThread(async (n) => {
  console.log("recursiveTest", n);
  if (n <= 1) {
    return 1;
  }
  const result = await recursiveTest(n - 1);
  return Number(n + result);
});

module.exports = {
  calculateSum,
  isThreadFunction,
  multipleThread,
  recursiveTest,
};
