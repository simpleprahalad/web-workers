const ITERATION_COUNT = 10000000000;

/**
 * Calulate the sum of first 10000000000 numbers and return the sum
 */
const doCalculation = () => {
  let sum = 0;
  for ( let i = 0; i < ITERATION_COUNT; i++) {
      sum += i;
  }
  return sum;
}

/**
 * Post message to all the clients connected with service worker
 */
const publishNotifications = async (data, windowClientId) => {
  let targetWindowClients = [];
  if (windowClientId) {
    const client = await self.clients.get(windowClientId);
    targetWindowClients.push(client);
  } else {
    targetWindowClients = await self.clients.matchAll({ includeUncontrolled: true });
  }
  return Promise.all(
    targetWindowClients.map((client) => {
      return client.postMessage(data);
    })
  );
};

/**
 * To clean listener in case window client not avaliable
 */
const cleanupListeners = async () => {
  let activeListeners = [];
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  activeListeners = self.listeners.filter((listener) =>
    clients.findIndex(c => c.id === listener.clientId) !== -1
  );
  self.listeners = activeListeners;
};


self.addEventListener("install", (ev) => {
  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  clients.claim();
  console.log("Ready!");
});


/**
 * Message received by worker
 */
self.addEventListener("message", async (ev) => {
  // console.log("Service worker message received: ", ev);

  // Calculation of Execution time
  const startTime = performance.now();
  const sum = doCalculation();
  const endTime = performance.now();
  let executionTime = Math.round((endTime - startTime) * 1000) / 1000 + " ms";
  await cleanupListeners();
  await publishNotifications({
    result: sum,
    executionTime: executionTime,
  });
});

self.listeners = [];