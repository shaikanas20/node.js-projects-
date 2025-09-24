const express = require("express");
const app = express();
app.use(express.json());

let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" },
];

let nextId = 4;

// GET all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// GET a specific card by ID
app.get("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find((c) => c.id === id);
  if (!card) return res.status(404).json({ message: "Card not found" });
  res.json(card);
});

// POST (add a new card)
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }
  const newCard = { id: nextId++, suit, value };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// DELETE a card by ID
app.delete("/cards/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ message: "Card not found" });

  const removedCard = cards.splice(index, 1)[0];
  res.json({
    message: `Card with ID ${id} removed.`,
    card: removedCard,
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
