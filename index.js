const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knxp44y.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const userCollection = client.db("healthSynchronyDB").collection("users");
    const testCollection = client.db("healthSynchronyDB").collection("tests");

    // User related api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const userExist = await userCollection.findOne(query);
      if (userExist) {
        return res.send({
          message: "User already registered in dataBase",
          insertedId: null,
        });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/users/:email", async (req, res) => {
      const user = req.body;
      const email = req.params.email;
      const filter = { email: email };
      const updatedUser = {
        $set: {
          name: user.name,
          bloodGroup: user.bloodGroup,
          district: user.district,
          upazilla: user.upazilla,
          image: user.image,
        },
      };
    });

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    app.patch("/users/block/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          status: "blocked",
        },
      };
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    app.patch("/users/active/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = {
        $set: {
          status: "active",
        },
      };
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Test Related api
    app.post("/tests", async (req, res) => {
      const test = req.body;
      const result = await testCollection.insertOne(test);
      res.send(result);
    });

    app.get("/tests", async (req, res) => {
      const result = await testCollection.find().toArray();
      res.send(result);
    });

    app.get("/tests/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testCollection.findOne(query);
      res.send(result);
    });
    app.delete("/tests/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/tests/:id", async (req, res) => {
      const test = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedTest = {
        $set: {
          name: test.name,
          image : test.image,
          details : test.details,
          price : test.price,
          slots : test.slots,
          date : test.date

        },
      };
      const result = await testCollection.updateOne(filter, updatedTest);
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

app.get("/", async (req, res) => {
  res.send("Health synchrony server is running");
});

app.listen(port, () => {
  console.log(`Health Synchrony server is running on port ${port}`);
});
