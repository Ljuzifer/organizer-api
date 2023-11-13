const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", true);

const { DB_HOST } = process.env;

async function run() {
  try {
    await mongoose.connect(DB_HOST);
    app.listen(3000);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    console.log("Server running. Use our API on port: 3000");
  }
}

run()
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.error(error.message));
