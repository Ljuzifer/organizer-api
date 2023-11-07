const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", true);

const { DB_HOST } = process.env;

// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     app.listen(3000);
//   })
//   .catch((error) => {
//     console.log(error.message);
//     process.exit(1);
//   });

async function run() {
  try {
    await mongoose.connect(DB_HOST);
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    mongoose.disconnect();
  }
}

run()
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error(error.message));

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });

// const DB_HOST = `mongodb+srv://ljuzifer:X5bEZdd3Z2nIPKD8@cluster-organizer.z1ldooq.mongodb.net/phonebook_organizer
// ?retryWrites=true&w=majority`;
// X5bEZdd3Z2nIPKD8
