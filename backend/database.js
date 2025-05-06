const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.CLUSTER_URL}/?retryWrites=true&w=majority&appName=${process.env.CLUSTER_NAME}`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connect = async () => {
  try {
    await client.connect();
    console.log('Connectado com a base de dados');
  } catch (error) {
    console.error('Erro ao connectar à base de dados', error);
  }
}

module.exports = { connect, client };