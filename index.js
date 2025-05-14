const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors"); //middleware
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

//user: simpleDBUser
//pass: vPfLWQmQfXYV5YrY

// const uri = "mongodb+srv://simpleDBUser:vPfLWQmQfXYV5YrY@cluster0.3h4lqut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri =
  "mongodb+srv://simpleDBUser:vPfLWQmQfXYV5YrY@cluster0.3h4lqut.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db("usersdb");
    const usersCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    app.get('/users/:id', async (req, res)=>{
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await usersCollection.findOne(query);
       res.send(result)

    })


    app.post("/users", async (req, res) => {
      console.log("data in the sever", req.body);
      const newUser = req.body;
      // Insert the defined document into the "users" collection
      const result = await usersCollection.insertOne(newUser);
      
      res.send(result);
    });


    //DELETE from database
    app.delete('/users/:id', async (req, res)=>{
      // console.log(req.params);
      const id = req.params.id;
      const query = {_id: new ObjectId (id)} //import ObjectId from mongodb and create query
       const result = await usersCollection.deleteOne(query);
           res.send(result);
    })

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
  res.send("Simple Crud server running");
});

app.listen(port, () => {
  console.log(`simple CRUD server running on ${port}`);
});
