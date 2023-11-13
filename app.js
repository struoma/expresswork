const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Custom middleware to verify the time of the request
const workingHoursMiddleware = (req, res, next) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const hourOfDay = now.getHours();

  if (dayOfWeek >= 1 && dayOfWeek <= 5 && hourOfDay >= 9 && hourOfDay < 17) {
    // It's working hours, proceed to the next middleware or route handler
    next();
  } else {
    // It's outside working hours, send a response indicating unavailability
    res
      .status(403)
      .send(
        "Sorry, the web application is only available during working hours (Monday to Friday, 9 to 17)."
      );
  }
};

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, "public")));

// Use the custom middleware for all routes
app.use(workingHoursMiddleware);

// Define routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
