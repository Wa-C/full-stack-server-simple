const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT || 5055;



app.use(cors());
app.use(bodyParser.json());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello World!')
})


 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udre1.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
  const productCollection = client.db("FullStack").collection("products");
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('new product', newProduct);
        productCollection.insertOne(newProduct)
        .then(result => {
            console.log('insertedCount',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
        
    })

    app.get('/products', (req, res) => {
        productCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log('from database', items);
        })
      })

    app.delete('/delete/:id', (req, res) => {
      const id = ObjectID(req.params.id);
      productCollection.deleteOne({_id:id})
      .then(result => {
        console.log(result);
      })
    })


  // perform actions on the collection object
  console.log("Database connected Successfully");
//   client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})