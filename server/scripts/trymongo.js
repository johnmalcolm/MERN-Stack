const { MongoClient } = require('mongodb');

require('dotenv').config();
const password = process.env.MONGO_DB_PASS;

const url = `mongodb+srv://john123:${password}@scientometrics-cluster.c3y2t.mongodb.net/development?retryWrites=true&w=majority`

// Callbacks are quite verbose and unyieldy in this paradigm
function testWithCallbacks(callback){
  console.log('\n --- Test with callbacks ---')
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function(err, client){
    if( err ){
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('employees');
    
    const employee = {
      id: 1,
      name: 'A. Callback',
      age: 23
    };
    collection.insertOne(employee, function(err, result){
      if( err ){
        callback(err);
        return;
      }
      console.log('result of insert:\n', result.insertedId)
      collection.find({_id: result.insertedId})
        .toArray(function(err, docs){
          if( err ){
            callback(err);
            return;
          }
          console.log('result of find:\n', docs)
          client.close();
          callback(err);
        })
    })
  });
}

testWithCallbacks(function(err){
  if(err){
    console.log(err);
  }
})
