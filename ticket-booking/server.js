const express = require("express");
const app = express();
app.use(express.json());

let seats = [
  { id: 1, status: "available" },
  { id: 2, status: "available" },
  { id: 3, status: "available" },
  { id: 4, status: "available" },
  { id: 5, status: "available" },
];

let locks = {};

app.get("/seats", (req, res) => {
  res.json(seats);
});

app.post("/lock/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const seat = seats.find((s) => s.id === id);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status !== "available") {
    return res.status(400).json({ message: "Seat is not available" });
  }

  if (locks[id]) {
    return res.status(400).json({ message: "Seat is already locked" });
  }

  seat.status = "locked";
  locks[id] = setTimeout(() => {
    seat.status = "available";
    delete locks[id];
  }, 60000);

  res.json({ message: "Seat is locked successfully. Confirm within 1 minute." });
});

app.post("/confirm/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const seat = seats.find((s) => s.id === id);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status !== "locked") {
    return res.status(400).json({ message: "Seat is  locked and cannot be booked" });
  }

  seat.status = "booked";

  if (locks[id]) {
    clearTimeout(locks[id]);
    delete locks[id];
  }

  res.json({ message: "Seat is booked successfully!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
