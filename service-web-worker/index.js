const sumButton = document.querySelector("#sumButton");
const bgButton = document.querySelector("#bgButton");
const initBtn = document.querySelector("#init");
const output = document.getElementById("output");
const executionTimeInputBox = document.getElementById("executionTime");
const responseTimeInputBox = document.getElementById("responseTime");

let startResponseTime = 0;
let endResponseTime = 0;
let responseTime = 0;
let listeners = [];
let serviceWorker;

/**
 * Reset all the timing parameters
 */
const resetTimingParameters = () => {
  startResponseTime = 0;
  endResponseTime = 0;
  responseTime = 0;
};

/**
 * Initialise the service worker
 */
async function init() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/sw-worker.js"
      );
      // console.log("Registration: ", registration);
      this.serviceWorker =
        registration.installing || registration.waiting || registration.active;
      // Listen for the latest service worker
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        this.serviceWorker = navigator.serviceWorker.controller;
      });
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener(
        "message",
        this.onWorkerMessage.bind(this)
      );
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  } else {
    console.error("Service workers are not supported.");
  }
}

/**
 * To listen worker message
 * @param {object} msg
 */
function onWorkerMessage(msg) {
  console.log("Recieved msg from worker !!!!");
  output.value = msg.data.result;
  endResponseTime = performance.now();
  responseTime =
    Math.round((endResponseTime - startResponseTime) * 1000) / 1000 + " ms";
  executionTimeInputBox.value = msg.data.executionTime;
  responseTimeInputBox.value = responseTime;
  resetTimingParameters();
}

/**
 * To send data to service worker
 * @param {object} data
 */
function sendWorkerNotification(data) {
  if (this.serviceWorker) {
    this.serviceWorker.postMessage(data);
  }
}

/**
 * Listen for click event on sum button
 */
sumButton.addEventListener("click", async (e) => {
  executionTimeInputBox.value = 0;
  responseTimeInputBox.value = 0;
  output.value = 0;
  startResponseTime = performance.now();
  sendWorkerNotification("Hi from server !!!");
});

/**
 * Listen for click event on background button
 */
bgButton.addEventListener("click", (e) => {
  if (document.body.style.background !== "green") {
    document.body.style.background = "green";
  } else {
    document.body.style.background = "yellow";
  }
});

init();