const ITERATION_COUNT = 10000000000;

/**
 * CPU intensive method.
 */
calculateSum = () => {
    let sum = 0;
    for ( let i = 0; i < ITERATION_COUNT; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Method to post message to the script connected to this worker
 */
onmessage = function(message) {
    console.log("Recieved message from script :: ", message.data);
    // Execution Time 
    let startTime = performance.now()
    let result = calculateSum();
    let endTime = performance.now();
    let executionTime = Math.round((endTime - startTime) * 1000) / 1000 + ' ms';

    postMessage({   result : result,
                    executionTime: executionTime
                });
}
