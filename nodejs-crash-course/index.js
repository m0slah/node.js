import http from "node:http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Set headers
  res.setHeader("Content-Type", "application/json");

  // Simple routing
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "🚀 Pure Node.js server is running",
      }),
    );
  } else if (req.method === "GET" && req.url === "/about") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "About page",
      }),
    );
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        error: "Route not found",
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default server;