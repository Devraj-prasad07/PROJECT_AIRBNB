const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const PORT = 8080;
const mongoUrl = "mongodb://127.0.0.1:27017/Airbnb";
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");

main()
  .then(() => {
    console.log("CONNECTED TO THE DATABASE SUCCESSFULY");
  })
  .catch((error) => {
    console.log(error);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

//Index Route
app.get("/listing", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add Route
app.get("/listing/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// Create Route
app.post("/listing", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(newListing);
  await newListing
    .save()
    .then((result) => {
      console.log("Your listing has been added");
    })
    .catch((error) => {
      console.log(error);
    });
  res.redirect("/listing");
});

// Show Route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

// Edit Route
app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id);
  res.render("./listings/edit.ejs", { listing });
});

// Update Route
app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`${id}`);
});

// Delete Route
app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

app.listen(PORT, () => {
  console.log(`App is listening at PORT ${PORT}`);
});
