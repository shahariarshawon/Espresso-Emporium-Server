const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssfjjdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection= client.db("Espresso_Emporium").collection("add-coffee");
    const userCollection=client.db("Espresso_Emporium").collection("users");
    //showing the data from the cluster
    app.get('/add-coffee',async(req,res)=>{
        const result = await coffeeCollection.find().toArray();
        res.send(result);
    })
    //sending data to mongodb cluster
    app.post('/add-coffee',async(req,res)=>{
        const newCoffee=req.body;
        // console.log(newCoffee);
        const result=await(coffeeCollection).insertOne(newCoffee);
        res.send(result);
        console.log("after adding in db", result)
    })
    //deleting coffee from the database through UI
    app.delete('/add-coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const result= await coffeeCollection.deleteOne(filter);
      res.send(result);
    })
    //updating the coffee
    app.put('/add-coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const updatedCoffee=req.body;
      const updatedDoc={
        $set:updatedCoffee
      }
      const result= await coffeeCollection.updateOne(filter,updatedDoc,options);
      res.send(result);
    })
    //individual details for the each coffee
    app.get('/add-coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const result= await coffeeCollection.findOne(filter);
      res.send(result);
    })
                        //users Related
    //sending users to the database
    app.post('/users',async(req,res)=>{
      const userProfile=req.body;
      const result= await userCollection.insertOne(userProfile);
      res.send(result);
    })
    //getting users 
    app.get('/users',async(req,res)=>{
      const result=await userCollection.find().toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from Server')
})

app.listen(port, () => {
    console.log(`Server is running on: ${port}`);
})