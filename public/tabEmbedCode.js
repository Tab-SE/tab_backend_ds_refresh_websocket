import { TableauEventType } from "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.js";

document.addEventListener("DOMContentLoaded", (event) => {
  const simulateButton = document.getElementById("simulateBackend");
  simulateButton.addEventListener("click", triggerBackend);
});

// Get the viz object from the HTML web component
const viz = document.querySelector("tableau-viz");

// Wait for the viz to become interactive
await new Promise((resolve, reject) => {
  // Add an event listener to verify the viz becomes interactive
  viz.addEventListener(TableauEventType.FirstInteractive, () => {
    console.log("Viz is interactive!");
    resolve();
  });
});

// Listen for backend-initiated refresh data source request
const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", (event) => {
  console.log("Connected to WS server");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);

  if (data.refresh && viz) {
    refreshTableauData();
  }
});

function refreshTableauData() {
  viz
    .refreshDataAsync()
    .then(() => {
      console.log("Data Source Refreshed");

      const now = new Date();
      const formattedTime = now.toLocaleTimeString(); // Format: HH:mm:ss

      // Display message in UI with the current time
      const messageDiv = document.getElementById("refreshMessage");
      messageDiv.textContent = `Data Source Successfully Refreshed at ${formattedTime}!`;

      // Optional: Remove the message after some time (e.g., 5 seconds)
      setTimeout(() => {
        messageDiv.textContent = "";
      }, 5000);
    })
    .catch((err) => {
      console.error(err.toString());
    });
}

function triggerBackend() {
  fetch("/trigger-refresh").then(() => {
    console.log("Backend refresh triggered");
  });
}
