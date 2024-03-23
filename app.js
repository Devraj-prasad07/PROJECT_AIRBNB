const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const PORT = 8080;
const mongoUrl = "mongodb://127.0.0.1:27017/Airbnb";
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");

// Function to connect to the database
async function main() {
  await mongoose.connect(mongoUrl);
}

// Connect to the database
main()
  .then(() => {
    console.log("CONNECTED TO THE DATABASE SUCCESSFULLY");
  })
  .catch((error) => {
    console.log(error);
  });

// Set up view engine and middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

// Index Route
app.get(
  "/listing",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

// New Route
app.get("/listing/new", (req, res) => {
  res.render("./listings/new.ejs");
});

// Create Route
app.post(
  "/listing",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
  })
);

// Show Route
app.get(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
  })
);

// Edit Route
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

// Update Route
app.put(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(404, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`${id}`);
  })
);

// Delete Route
app.delete(
  "/listing/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  })
);

// This route handles any request that doesn't match the defined routes above.
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong !!" } = err;
  res.status(statusCode).render("./Error/error.ejs", { message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is listening at PORT ${PORT}`);
});
