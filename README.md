# define-threads

Zero dependencies, helps you use "worker" more easily in NodeJS, just like an asynchronous function

# Usage

```ts
// my-worker-func.ts

import { threadContext } from "define-threads";

// Create a thread context using the current file path
const defineThread = threadContext(__filename);

// Thread Function 1
export const calculateLargeSum = defineThread(async (maxNumber: number) => {
  let sum = 0;
  for (let i = 0; i < maxNumber; i++) {
    sum += i;
  }
  return sum;
});

// Thread Function 2
export const testFunction = defineThread(
  async (a: number, b: number, c: number) => {
    return a + b + c;
  }
);
```

```ts
// index.ts

import { calculateLargeSum, testFunction } from "./my-worker-func";

async function main() {
  // call Thread Function 1
  // TS type hint is complete!
  const sum = await calculateLargeSum(100);
  console.log(sum); // Output: 4950

  // call Thread Function 2
  const responses = await testFunction(1, 2, 3);
  console.log(responses); // Output: 6
}

main();
```

# License

MIT License
