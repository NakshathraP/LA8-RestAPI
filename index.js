const express = require('express');
const bodyParser = require('body-parser');
const fs = require ('fs');

const {connectToMongo, getCollection} = require('./db-connect.js')

const app= express()
const port = 3002;

// Get all documents
app.get('/', async(req, res) => {
    try{
        const ack = await getCollection('LA8').find({}).toArray();
        res.status(200).json({'ack': ack})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
})

// Get the documents where the mode of communication is Phone
app.get('/comm-mode',async(req, res) => {
    try{
        const ack = await getCollection('LA8').find({'modeOfCommunication': "Phone"}).toArray();
        res.status(200).json({'acknowledge': ack})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

// To insert a new document
app.post('/add-new-user', async (req, res) => {
    try {
        const { newUser } = req.body; // The request will be sent through PostMan
        const ack = await getCollection('LA8').insertOne(newUser);
        res.status(201).json({ acknowledge: ack });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body; // Send the updated user data in the request body
    try {
        const ack = await getCollection('LA8').updateOne(
            { _id: ObjectId(userId) },
            { $set: updatedUser }
        );
        if (ack.modifiedCount === 1) {
            res.status(200).json({ acknowledge: ack });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const ack = await getCollection('user').deleteOne({ _id: ObjectId(userId) });
        if (ack.deletedCount === 1) {
            res.status(200).json({ acknowledge: ack });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

connectToMongo().then(() => {
    app.listen(port, () => {
        console.log("Server running on http://localhost:3002");
    })
})


