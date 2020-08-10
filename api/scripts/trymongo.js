const { MongoClient } = require('mongodb');

require('dotenv').config();
const url = process.env.DB_URL;

// Callbacks are quite verbose and unyieldy in this paradigm
function testWithCallbacks(callback) {
  console.log('\n --- Test with callbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });

  // Connect to DB
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    console.log(`Connected to MongoDB URL: ${url}`);
    const db = client.db();
    const collection = db.collection('employees');

    const employee = {
      id: 1,
      name: 'A. Callback',
      age: 23,
    };

    // Insert an object
    collection.insertOne(employee, (insertErr, result) => {
      if (insertErr) {
        callback(insertErr);
        return;
      }
      console.log('result of insert:\n', result.insertedId);

      // Find an object
      collection.find({ _id: result.insertedId }).toArray((findErr, docs) => {
        if (findErr) {
          client.close();
          callback(findErr);
          return;
        }
        console.log('result of find:\n', docs);
        client.close();
        callback();
      });
    });
  });
}

// Async/Await paradigm is cleaner.
async function testWithAsync() {
  console.log('\n --- Test with Async/Await ---');
  const client = new MongoClient(url, { useNewUrlParser: true });

  try {
    // Connect to DB
    await client.connect();
    const db = client.db();
    const collection = db.collection('employees');

    const employee = {
      id: 1,
      name: 'A. Callback',
      age: 23,
    };

    // Insert an object
    const result = await collection.insertOne(employee);
    console.log('result of insert:\n', result.insertedId);

    // Find an object
    const docs = await collection.find({ _id: result.insertedId }).toArray();
    console.log('result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

// Test Callback paradigm
testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
