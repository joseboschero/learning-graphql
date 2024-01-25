import mongoose from "mongoose";

const MONGODB_URI = `mongodb+srv://joseboscherodev:BnOm58dgtKBqsCID@learning-graphql.nspdi7l.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB", error.message);
  });
