const express = require("express");
const venom = require("venom-bot");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

let client;

venom
  .create({
    session: "session-name", // Define a session name
    multidevice: true, // Enable multi-device support
    headless: true, // Run in headless mode
    folderNameToken: "tokens", // Folder to store tokens
    mkdirFolderToken: "", // Custom folder to store tokens, if needed
  })
  .then((clientInstance) => {
    client = clientInstance;
    start(client);
  })
  .catch((error) => {
    console.log(error);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === "Hi" && message.isGroupMsg === false) {
      client
        .sendText(message.from, "Hello! This is a message from Venom-Bot")
        .then((result) => {
          console.log("Message sent: ", result);
        })
        .catch((error) => {
          console.error("Error when sending message: ", error);
        });
    }
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send-message", (req, res) => {
  const number = "8801876399629";
  const message = "Hello, this is a test message from Venom-Bot!";

  if (!number || !message) {
    return res.status(400).send("Number and message are required");
  }

  client
    .sendText(`${number}@c.us`, message)
    .then((result) => {
      res.send("Message sent successfully!");
    })
    .catch((error) => {
      res.status(500).send("Failed to send message: " + error);
    });
});

// Endpoint to send an image
app.get("/send-image", (req, res) => {
  const number = "8801876399629";
  const message = "Hello, this is a test message from Venom-Bot!";
  const filePath = "./logo.webp"; // Static file path

  if (!number) {
    return res.status(400).send("Number is required");
  }

  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    return res.status(400).send("File does not exist");
  }

  client
    .sendImage(`${number}@c.us`, absolutePath, "logo", message)
    .then((result) => {
      res.send("Image sent successfully!");
    })
    .catch((error) => {
      res.status(500).send("Failed to send image: " + error);
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
