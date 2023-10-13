# Websocket Backend-initiated Tableau Data Source Refresh

This project demonstrates how to initiate a Tableau data source refresh from the backend via WebSockets, allowing real-time updates in a frontend application with the Tableau Embedded Dashboard. 

## Introduction

Imagine a scenario where a user submits new data or parameters through a backend process. Once the underlying database completes saving this data, it's vital for these corresponding changes to be instantly reflected in the frontend visualizations. Our solution facilitates such real-time updates by using WebSockets, ensuring that users always view the most recent data without manual refreshes.

Each frontend client is uniquely identified with a UUID provided by the backend upon connection. This distinct identification enables specific targeting for refresh events, ensuring that only the relevant clients receive the updates.

## Demo Screenshot

![Demo Screenshot](./screenshot.gif)

## How to Run

1. Make sure you have Node.js installed.
2. Clone this repository.
3. Navigate to the project directory and run `npm install` to install required dependencies.
4. Start the server using `node server.js`. It should start on `http://localhost:3000`.
5. Open your browser and navigate to `http://localhost:3000` to see the embedded Tableau visualization and the "Simulate Backend Refresh" button.
6. Click the button to simulate a backend data update and observe the Tableau visualization refresh.

## Configuration

There is a switch in the backend code labeled `BROADCAST_TO_ALL`. Setting this to `true` will broadcast refresh events to all connected clients. Setting it to `false` will only send the refresh to specifically marked clients.

## Frontend Code Highlights

- Establishes a WebSocket connection to the backend.
- Receives a unique UUID from the server, ensuring distinct session identification.
- Listens for `refresh` events from the server and updates the Tableau visualization accordingly.
- Features a button to simulate a backend-triggered data refresh.

## Backend Code Highlights

- Efficiently serves the static frontend files.
- Maintains an active list of connected WebSocket clients and their respective UUIDs.
- Provides an endpoint to trigger specific client refresh events based on their UUIDs.
- Broadcasts `refresh` messages to the appropriate clients.

## Troubleshooting

1. **Issue**: Error related to WebSocket connection.
   - **Solution**: Make sure the server is running and reachable at the mentioned address (`http://localhost:3000`).

2. **Issue**: Tableau visualization doesn't refresh as expected.
   - **Solution**: Check if the frontend receives the `refresh` WebSocket message. Review the browser's console for potential error messages.
