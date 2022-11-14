const worker = new Worker("worker.js");
const sumButton = document.querySelector("#sumButton");
const bgButton = document.querySelector("#bgButton");
const output = document.getElementById("output");
const executionTimeInputBox = document.getElementById("executionTime");
const responseTimeInputBox = document.getElementById("responseTime");

let startResponseTime = 0;
let endResponseTime = 0;
let responseTime = 0;

/**
 * Reset all the timing parameters
 */
resetTimingParameters = () => {
    startResponseTime = 0;
    endResponseTime = 0;
    responseTime = 0;
}

/**
 * Addlistener to the click event of sum button
 */
sumButton.addEventListener("click", (e) => {
    executionTimeInputBox.value = 0;
    responseTimeInputBox.value = 0;
    output.value = 0;
    startResponseTime = performance.now();
    worker.postMessage("Hi from server !!!");
})

/**
 * Addlistener to the click event of background button
 */
 bgButton.addEventListener("click", (e) => {
    if(document.body.style.background !== 'green') {
        document.body.style.background = 'green';
    } else {
        document.body.style.background = 'yellow';
    }
})

/**
 * Connect to the onmessage callback method from worker
 */
worker.onmessage = (msg) => {
    console.log("Reply from Worker !!!");
    endResponseTime = performance.now();
    responseTime = Math.round((endResponseTime - startResponseTime) * 1000) / 1000 + ' ms';

    output.value = msg.data.result;
    executionTimeInputBox.value = msg.data.executionTime;
    responseTimeInputBox.value = responseTime;
    resetTimingParameters();
}