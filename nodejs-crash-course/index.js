import http from "http";

const server = http.createServer((req, res) => {
  const { method, url } = req;

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Method: ${method}, URL: ${url}`);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
