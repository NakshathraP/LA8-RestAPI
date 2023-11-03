const {MongoClient} = require('mongodb')
const client = new MongoClient('mongodb://127.0.0.1:27017')
let db;

const connectToMongo = () => {
    return new Promise((resolve, reject) => {
        client.connect().then(() => {
            console.log("DB Connected");

            db = client.db('trainingdb');

            resolve();
        }).catch((err) => {
            console.log(`${err.message}`);
            reject();
        })
    })
}

const getCollection = (name) => {
    return db.collection(name);
}

module.exports = {
    connectToMongo, getCollection
}