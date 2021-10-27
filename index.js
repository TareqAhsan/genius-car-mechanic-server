const express = require("express");
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;
// middle ware 
app.use(cors())
app.use(express.json())

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aubya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run(){
    try{
     await client.connect()
     const database = client.db('carMechanic');
     const servicesCollection = database.collection('services')
     //get api all data 
     app.get('/services',async(req,res)=>{
         const cursor = servicesCollection.find({});
         const services = await cursor.toArray();
         res.send(services)
     })
    //  get single service
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id
        console.log(id);
        const query = {_id:ObjectId(id)}
        const service = await servicesCollection.findOne(query)
        res.json(service)
    })
    //delte api
    app.delete('/services/:id',async(req,res)=>{
        const id = req.params.id
        console.log('hitting delete', id);
        const query = {_id:ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
    })
     
     // post api inserted data 
     app.post('/services',async(req,res)=>{
         const service = req.body
       
         console.log('hit the post api',service);
           const result = await servicesCollection.insertOne(service)
           console.log(result);
         res.json(result)
     })
    }finally{
    // await  client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  console.log("hitting the server");
  res.send("hello from geniuscar server");
});
app.listen(port, () => {
  console.log("listening on port ", port);
});
