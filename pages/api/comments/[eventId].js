import { MongoClient } from "mongodb";

async function handler(req, res) {
  const { eventId } = req.query;

  const client = await MongoClient.connect(
    "mongodb://tonilearn:g7T2GXskobkKmJ2f@cluster0-shard-00-00.xscsd.mongodb.net:27017,cluster0-shard-00-01.xscsd.mongodb.net:27017,cluster0-shard-00-02.xscsd.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
  );

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      !name.trim() === "" ||
      !text ||
      !text.trim() === ""
    ) {
      res.status(422).json({ success: false, message: "Invalid input." });
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    const db = client.db("events");

    const result = await db.collection("comments").insertOne(newComment);

    newComment.id = result.insertedId;

    res
      .status(201)
      .json({ success: true, message: "Added comment.", comment: newComment });
  }

  if (req.method === "GET") {
    const db = client.db("events");

    const documents = await db
      .collection("comments")
      .find({ eventId })
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ comments: documents });
  }

  client.close();
}

export default handler;
