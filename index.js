const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;

//middlewart
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwbvx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {
    try {
        await client.connect();
        const database = client.db("travel-agency")
        const tourCollection = database.collection("destinations")
        const bookingCollection = database.collection('bookings')

        //Get All Data Api
        app.get('/tours' , async(req ,res) => {
            const cursor = tourCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // get single data api
        app.get('/singleTour/:id' , async(req , res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)}
            const result = await tourCollection.findOne(query)
            res.json(result)
        })

        //Post Tours 
        app.post('/tourPost',async(req ,res) => {
            const newTour = req.body;
            const result = await tourCollection.insertOne(newTour);
            res.json(result)
        })

        //get my bookings 
        app.get('/myBookings/:email' , async(req ,res) => {
            const email = req.params.email;
            const result = await bookingCollection.find({email:email}).toArray()
            res.json(result);
        })

        //get all bookings api
        app.get('/bookings' , async(req ,res) => {
            const cursor = bookingCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        //Post a booking api
        app.post('/postBooking' ,async(req ,res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        //delete booking api 
        app.delete('/deleteBooking/:id' , async(req , res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await bookingCollection.deleteOne(query)
            res.json(result)
        })

        //update booking api 
        app.put('/updateStatusBooking/:id' , async(req , res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const query = {_id:ObjectId(id)};
            const options = { upsert : true}
            const updatedDoc = {
                $set: {  
                  status:updatedBooking.status
                },
            };
            const result =await bookingCollection.updateOne(query,updatedDoc,options)
            res.json(result)
        })
        console.log("database is connected")
    } finally {

    }
}
run().catch(err => console.dir(err))
console.log(uri)

app.get('/', (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    console.log("server is running at", port)
})