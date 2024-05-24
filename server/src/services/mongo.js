const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://abhishekshetter1999:nasa@cluster0.c0epybo.mongodb.net/NASA?retryWrites=true&w=majority&appName=Cluster0";

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection is ready");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

async function mongoDisconnect() {
  await mongoose.disconnect(MONGO_URL);
}

module.exports = { mongoConnect, mongoDisconnect };
