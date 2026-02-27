import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.post("/payment-service", (req, res) => {
  const { cart } = req.body;
  const userId = 123;

  // Todo : Payment
  console.log("api endpoint hit");
  // kafka

  return res.status(200).send("Payment success");
});

app.use((err, req, res, next) => {
  res.statsus(err.statsus | 500).json({ error: err.message });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
