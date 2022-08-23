const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

const port = 5000;

app.use(cors());
app.use(express.json());

//MfwYkwSAQviceFtH

const uri = "mongodb+srv://arfin_24:MfwYkwSAQviceFtH@cluster0.cqu6n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("students");
        const user = database.collection("student");

        // create a document to insert
        app.post('/', async (req, res) => {
            const student = req.body;
            const result = await user.insertOne(student);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        })

        // get many document
        app.get('/students', async (req, res) => {
            const cursor = user.find({})
            const users = await cursor.toArray()
            res.send(users)
        })

        // delete a document
        app.delete('/student/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await user.deleteOne(query);
            res.json(result);
        })

        // get a document
        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await user.findOne(query);
            res.json(result);
        })

        // update a document
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    address: updatedUser.address,
                    stuClass: updatedUser.stuClass,
                    city: updatedUser.city,
                    division: updatedUser.division,
                    zip: updatedUser.zip
                },
            };

            const result = await user.updateOne(query, updateDoc, options);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running');
})

app.listen(port, () => {
    console.log('server started at port', port);
})