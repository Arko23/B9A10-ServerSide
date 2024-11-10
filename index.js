const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;

//middlewire
app.use(cors({
  // origin :["http://localhost:5173","https://art-craft-53b59.web.app"]
}));
app.use(express.json());

//artdad
//7UFN91PdoOTqdxKd
//trooperaiden23 
//etzR3seLRYA0P4VS

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s3exjix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

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
    const addCollection = client.db('artDB').collection('add');
    const addSubCat = client.db('artDB').collection('subCategory');
   //all
    app.get('/all',async(req,res)=>{
        const cursor = addCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //myitems
  //   app.get("/my/:userEmail", async (req, res) => {
  //     const userEmail = req.params.userEmail;
  
  //     try {
  //         const cursor = addCollection.find({ userEmail: userEmail });
  //         const result = await cursor.toArray();
  //         res.json(result);
  //     } catch (error) {
  //         console.error("Error fetching user adds:", error);
  //         res.status(500).json({ error: "Failed to fetch user adds" });
  //     }
  // });
  app.get("/my/:userEmail", async (req, res) => {
    const userEmail = req.params.userEmail;
    const customization = req.query.customization; // Get the customization query parameter
   
    try {
         let query = { userEmail: userEmail };
         if (customization) {
             // If customization is provided, add it to the query
             query.customization = customization;
         }
         const cursor = addCollection.find(query);
         const result = await cursor.toArray();
         res.json(result);
    } catch (error) {
         console.error("Error fetching user adds:", error);
         res.status(500).json({ error: "Failed to fetch user adds" });
    }
   });
   
  //myitems
    app.post('/add', async (req, res) => {
      const newAdd = req.body;
      console.log(newAdd);
    
      // Extract user email from request body
      const userEmail = newAdd.userEmail;
    
      if (!userEmail) {
        return res.status(400).json({ error: "User email not provided in the request" });
      }
      const result = await addCollection.insertOne(newAdd);
      res.send(result);
      // try {
      //   // Insert the new add into the collection
      //   const result = await addCollection.insertOne(newAdd);
      //   res.status(201).json(result.ops[0]); // Return the inserted document
      // }
      // catch (error) {
      //   console.error("Error adding new add:", error);
      //   res.status(500).json({ error: "Failed to add new add" });
      // }
    });
    
  //all
    app.post('/all',async(req,res)=>{
      const newAdd =req.body;
      console.log(newAdd);
      const result =await addCollection.insertOne(newAdd);
      res.send(result);
    })
    //home
    app.get('/subCategory',async(req,res)=>{
      const cursor = addSubCat.find();
      const result = await cursor.toArray();
      res.send(result);
  })
    app.post('/subCategory',async(req,res)=>{
      const newSub =req.body;
      console.log(newSub);
      const result =await addSubCat.insertOne(newSub);
      res.send(result);
    })
    //update
    app.get('/add/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result =await addCollection.findOne(query);
      res.send(result);
    })
    app.put('/add/:id',async(req,res)=>{
      const id =req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options ={ upsert : true };
      const updated=req.body;

      const updatedInfo ={
        $set: {
          image:updated.image,
          item_name: updated.item_name,
          subcategory_Name : updated.subcategory_Name,
          short_description: updated.short_description,
          price:updated.price,
          rating: updated.rating,
          customization: updated.customization,
          processing_time: updated.processing_time,
          stockStatus:updated.stockStatus
        }
      }
      const result =await addCollection.updateOne(filter,updatedInfo,options);
      res.send(result);
    })
    app.delete('/add/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
     
          const result = await addCollection.deleteOne(query);
          res.send(result);
          
      
  });
  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('art-craft server is running')
})
app.listen(port,()=>{
    console.log(`art-craft server is running on port : ${port}`)
})