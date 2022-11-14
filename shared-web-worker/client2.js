const calculate = document.getElementById("sumButton");
const background = document.getElementById("bgButton");
const output = document.getElementById("output");
const executionTimeInputBox = document.getElementById("executionTime");
const responseTimeInputBox = document.getElementById("responseTime");

let startResponseTime = 0;
let endResponseTime = 0;
let responseTime = 0;

/**
 * Reset timing parameters
 */
resetTimingParameters = () => {
  startResponseTime = 0;
  endResponseTime = 0;
  responseTime = 0;
};

/**
 * Code for using Shared Worker
 */
if (!!window.SharedWorker) {
  const worker = new SharedWorker("worker.js");

  /**
   * Addlistener to the click event of background button
   */
  background.onclick = function (e) {
    document.body.style.backgroundColor =
      document.body.style.backgroundColor !== "red" ? "red" : "yellow";
  };

  /**
   * Addlistener to the click event of calculate button
   */
  calculate.onclick = function () {
    executionTimeInputBox.value = 0;
    responseTimeInputBox.value = 0;
    output.value = 0;
    startResponseTime = performance.now();
    worker.port.postMessage("Hi from client 2");
  };

  /**
   * Connect to the onmessage callback method from worker
   */
  worker.port.onmessage = function (msg) {
    console.log("return worker 2 -------->");
    output.value = msg.data.result;
    endResponseTime = performance.now();
    responseTime =
      Math.round((endResponseTime - startResponseTime) * 1000) / 1000 + " ms";
    executionTimeInputBox.value = msg.data.executionTime;
    responseTimeInputBox.value = responseTime;
    resetTimingParameters();
  };
}
