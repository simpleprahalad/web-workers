/**
 * Connect to the clients
 */
onconnect = function (e) {
  console.log("connected.........");
  const port = e.ports[0];

  const ITERATION_COUNT = 10000000000;

  /**
   * CPU intensive operation
   */
  calculateSum = () => {
    let sum = 0;
    for (let i = 0; i < ITERATION_COUNT; i++) {
      sum += i;
    }
    return sum;
  };

  /**
   * Method to post message to the clients connected to this worker
   */
  port.onmessage = (e) => {
    console.log("shared worker..........");
    let result = 0;

    // Calculation of execution time
    let startTime = performance.now();
    result = calculateSum();
    let endTime = performance.now();
    let executionTime = Math.round((endTime - startTime) * 1000) / 1000 + " ms";

    port.postMessage({
      result: result,
      executionTime: executionTime,
    });
  };
};
