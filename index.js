const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// data
const contacts = require("./data/contacts.json");

app.put("/contacts/:id", (req, res) => {
  const id = req.params.id;
  const contactInfo = req.body;
  const { name, email, phone } = contactInfo;

  fs.readFile("./data/contacts.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving data" });
    }

    const jsonData = JSON.parse(data);
    // jsonData.push(contactInfo);

    // Find the item in the array based on the provided ID
    const itemIndex = jsonData.findIndex((item) => item.phone === id);

    // Check if the item exists
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update the item with the new data
    jsonData[itemIndex].name = name;
    jsonData[itemIndex].phone = phone;
    jsonData[itemIndex].email = email;

    // Write the updated data back to the JSON file
    fs.writeFile("./data/contacts.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error writing data" });
      }

      res.status(200).json({ message: "Data updated successfully" });
    });
  });
});

// get all contacts
app.get("/contacts", (req, res) => {
  res.send(contacts);
});

// add contact API
app.post("/contacts", async (req, res) => {
  const contactInfo = req.body;

  fs.readFile("./data/contacts.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving data" });
    }

    const jsonData = JSON.parse(data);
    jsonData.push(contactInfo);

    fs.writeFile("./data/contacts.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error saving data" });
      }

      res.status(200).json({ message: "Data submitted successfully" });
    });
  });
});

app.get("/", (req, res) => {
  res.send("contact management server running");
});

app.listen(port, () => {
  console.log(`contact management listening on port: ${port}`);
});
