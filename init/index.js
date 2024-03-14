const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");
const mongoUrl = "mongodb://127.0.0.1:27017/Airbnb";

main()
  .then(() => {
    console.log("CONNECTION SUCCESSFULL");
  })
  .catch((error) => {
    console.log(error);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data is initialized");
};

initDB();
