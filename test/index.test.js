const {
  calculateSum,
  isThreadFunction,
  multipleThread,
} = require("./my-worker.js");

describe("Base Test", () => {
  it("should be a thread function", async () => {
    const result = await isThreadFunction();
    expect(result).toBe(false);
  });
  it("should calculate large sum", async () => {
    const result = await calculateSum(1, 2);
    expect(result).toBe(3);
  });
  it("foreach test", async () => {
    let sum = 0;
    for (let i = 1; i < 10; i++) {
      sum += await calculateSum(sum, i);
    }
    expect(sum).toBe(1013);
  });
  it("call thread function in worker thread", async () => {
    const result = await multipleThread();
    expect(result).toBe(1013);
  });
  it("concurrent test", async () => {
    const promises = [];
    for (let i = 0; i < 1000; i++) {
      promises.push(calculateSum(i, 1));
    }
    const result = (await Promise.all(promises)).reduce((a, b) => a + b, 0);
    expect(result).toBe(500500);
  });

  // Can't recursive call in thread function
  // it("recursive test", async () => {
  //   const result = await recursiveTest(3);
  //   expect(result).toBe(6);
  // });
});
