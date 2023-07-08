const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// data
const contacts = require("./data/contacts.json");

// get all contacts
app.get("/contacts", (req, res) => {
  res.send(contacts);
});

// add contact API
app.post("/contacts", (req, res) => {
  const contact = req.body;
  const query = { number: contact.number };
  const existingContact = contacts.find(query);

  if (existingContact) {
    return res.send("Contact already exists");
  }

  const result = contacts.push(contact);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("contact management server running");
});

app.listen(port, () => {
  console.log(`contact management listening on port: ${port}`);
});
