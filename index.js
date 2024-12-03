const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ; 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())

// user-manger
// 1LyeqPvUQqpoBGY6




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.7i4ix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

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
    // await client.connect();

    const database = client.db("User_management").collection("user_manager");



    // Send a ping to confirm a successful connection


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/users',async (req,res)=>{
      const {search} = req.query ; 
      let option = {}
      if(search){
          option ={name:{$regex: search, $options: 'i'}}
      }
      console.log(search)
  
      const cursor = database.find(option); 
      const result = await cursor.toArray();
      
      res.send(result)
    })

    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await database.findOne(query);
      res.send(result)

    })

    //update 
    app.put('/users/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedUser = req.body;
      const User = {
        $set: {
          name:updatedUser.name, 
          email:updatedUser.email,
          gender:updatedUser.gender,
          status:updatedUser.status
          
        }
      }
      const result = await database.updateOne(filter,User,options)
      res.send(result)
    })


    app.put('/update/:id', async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      // const updatedUser = req.body;
      const User = {
        $set: {
            isCompleted:true
        }
      }
      const result = await database.updateOne(filter,User,options)
      res.send(result)
    })


















    app.delete('/users/:id', async(req,res) => {
       const id = req.params.id;
       const query = {_id: new ObjectId(id)}
       const result = await database.deleteOne(query); 
      res.send(result);
    })
    app.post('/users', async(req,res)=>{
        const newUser = req.body; 
        console.log('Succesfull new User added', newUser); 
        const result = await database.insertOne(newUser)
        res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
      res.send('User server is running')
})

app.listen(port, ()=>{
      console.log(`User Sever is running :${port}`) 
})