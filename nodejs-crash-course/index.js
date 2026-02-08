import http from "http";
import url from "url";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const method = req.method;
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      method,
      url: req.url,
      pathname,
      query,
    })
  );
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
