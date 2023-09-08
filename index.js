const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory storage for pantry data (for demonstration purposes)
const pantryStore = {};

// 159e39e6-8c44-4e2f-adb3-9e3004e7ae84

// Define the endpoint for adding key-value pairs
app.post("/pantry/:PantryID", (req, res) => {
  const { PantryID } = req.params;
  const { key, value } = req.body;

  if (!key || !value) {
    return res
      .status(400)
      .json({
        error: "Both key and value must be provided in the request body.",
      });
  }

  if (!pantryStore[PantryID]) {
    pantryStore[PantryID] = {};
  }

  pantryStore[PantryID][key] = value;
  res.status(201).json({ message: "Key-value pair added to the pantry." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// GET

// Define the endpoint for retrieving values by basket key
app.get('/pantry/:PantryID/:basketKey', (req, res) => {
  const { PantryID, basketKey } = req.params;

  if (!pantryStore[PantryID] || !pantryStore[PantryID][basketKey]) {
    return res.status(404).json({ error: 'Key not found in the pantry.' });
  }

  const value = pantryStore[PantryID][basketKey];
  res.status(200).json({ key: basketKey, value });
});
//LIST

app.get("/pantry/:PantryID/list_baskets", (req, res) => {
  const { PantryID } = req.params;
  const { filterByName } = req.query;

  if (!pantryStore[PantryID]) {
    return res.status(404).json({ error: "Pantry not found." });
  }

  const pantryData = pantryStore[PantryID];
  const baskets = Object.keys(pantryData)
    .filter((key) => {
      // Filter by name if filterByName query parameter is provided
      if (filterByName) {
        return key.includes(filterByName);
      }
      return true; // If no filter, return all baskets
    })
    .map((key) => {
      return { name: key, value: pantryData[key] };
    });

  res.status(200).json({ pantryID: PantryID, baskets });
});
// DELETE
app.delete("/pantry/:PantryID/:basketKey", (req, res) => {
  const { PantryID, basketKey } = req.params;

  if (!pantryStore[PantryID] || !pantryStore[PantryID][basketKey]) {
    return res.status(404).json({ error: "Basket not found in the pantry." });
  }

  // Delete the basket
  delete pantryStore[PantryID][basketKey];
  res.status(200).json({ message: "Basket deleted successfully." });
});

