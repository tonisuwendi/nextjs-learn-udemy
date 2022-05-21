import { MongoClient } from "mongodb";

async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb://tonilearn:g7T2GXskobkKmJ2f@cluster0-shard-00-00.xscsd.mongodb.net:27017,cluster0-shard-00-01.xscsd.mongodb.net:27017,cluster0-shard-00-02.xscsd.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
  );

  return client;
}

async function insertDocument(client, data) {
  const db = client.db("events");
  await db.collection("newsletter").insertOne(data);
}

async function handler(req, res) {
  if (req.method === "POST") {
    const email = req.body.email;

    if (!email || !email.includes("@")) {
      res
        .status(422)
        .json({ success: false, message: "Invalid email address" });
      return;
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Connecting to database failed!",
      });
      return;
    }

    try {
      await insertDocument(client, { email });
      client.close();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Inserting data failed!",
      });
      return
    }

    res.status(201).json({ success: true, message: "Signed up!" });
  }
}

export default handler;
