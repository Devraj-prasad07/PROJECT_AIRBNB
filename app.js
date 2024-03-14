const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const PORT = 8080;
const mongoUrl = "mongodb://127.0.0.1:27017/Airbnb";
const Listing = require("./models/listing");

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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Working");
});

//Index Route
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

app.get("/listings/:id", async (req, res) => {
  const showlistings = await Listing.find({});
  res.render("./listings/showListings.ejs", { showlistings });
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT ${PORT}`);
});
