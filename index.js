const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s92qhby.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const contactsCollection = client
      .db("contactManagement")
      .collection("contacts");

    // create contact
    app.post("/contacts", async (req, res) => {
      const contact = req.body;
      const query = { phone: contact.phone };
      const existingContact = await contactsCollection.findOne(query);

      if (existingContact) {
        return res.send({ message: "Contact already exists" });
      }

      const result = await contactsCollection.insertOne(contact);
      res.send(result);
    });

    // get all contacts
    app.get("/contacts", async (req, res) => {
      const result = await contactsCollection.find().toArray();
      res.send(result);
    });

    // get specific contact
    app.get("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await contactsCollection.findOne(query);
      res.json(result);
    });

    // update contact
    app.put("/contacts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedContact = req.body;
      const contact = {
        $set: {
          name: updatedContact.name,
          phone: updatedContact.phone,
          email: updatedContact.email,
        },
      };
      const result = await contactsCollection.updateOne(filter, contact);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("contact management server running");
});

app.listen(port, () => {
  console.log(`contact management listening on port: ${port}`);
});
