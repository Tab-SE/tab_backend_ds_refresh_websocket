import { TableauEventType } from "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js";

document.addEventListener("DOMContentLoaded", async (event) => {
  // <-- added async
  const simulateButton = document.getElementById("simulateBackend");
  simulateButton.addEventListener("click", triggerBackend);

  let clientUUID;
  let viz;

  initializeWebSocket();

  function initializeWebSocket() {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", (event) => {
      console.log("Connected to WS server");
    });

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.uuid) {
        clientUUID = data.uuid;
        console.log(`Received UUID: ${clientUUID}`);
      }

      if (data.refresh) {
        refreshTableauData();
      }
    });
  }

  function triggerBackend() {
    if (clientUUID) {
      // Add the client UUID to the refresh list
      fetch(`/add-to-refresh-list/${clientUUID}`).then(() => {
        console.log(`Added UUID: ${clientUUID} to the refresh list.`);

        // Trigger the actual refresh on the backend, passing the client UUID
        fetch(`/trigger-refresh/${clientUUID}`).then(() => {
          console.log("Backend refresh triggered.");
        });
      });
    } else {
      console.error("Client UUID not defined yet.");
    }
  }

  // Encapsulated the tableau initialization in an async function
  async function initializeTableau() {
    viz = document.querySelector("tableau-viz");

    await new Promise((resolve, reject) => {
      // This await will now work
      viz.addEventListener(TableauEventType.FirstInteractive, () => {
        console.log("Viz is interactive!");
        resolve();
      });
    });
  }

  initializeTableau();

  function refreshTableauData() {
    viz
      .refreshDataAsync()
      .then(() => {
        console.log("Data Source Refreshed");

        const now = new Date();
        const formattedTime = now.toLocaleTimeString();

        // Display message in UI with the current time
        const messageDiv = document.getElementById("refreshMessage");
        messageDiv.textContent = `Data Source Successfully Refreshed at ${formattedTime}!`;

        setTimeout(() => {
          messageDiv.textContent = "";
        }, 2500);
      })
      .catch((err) => {
        console.error(err.toString());
      });
  }
});
