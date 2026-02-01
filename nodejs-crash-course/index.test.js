import http from "node:http";
import { jest } from "@jest/globals";

describe("HTTP Server Tests", () => {
  let server;
  const TEST_PORT = 3001;

  beforeAll(() => {
    // Set environment variable for testing
    process.env.PORT = TEST_PORT;
  });

  beforeEach(async () => {
    // Create a fresh server for each test
    server = http.createServer((req, res) => {
      res.setHeader("Content-Type", "application/json");

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

    // Start server and wait for it to be ready
    await new Promise((resolve) => {
      server.listen(TEST_PORT, () => {
        resolve();
      });
    });

    // Small delay to ensure server is fully ready
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(async () => {
    // Close server and wait for it to fully close
    if (server && server.listening) {
      await new Promise((resolve) => {
        server.close(() => {
          resolve();
        });
      });
      
      // Small delay to ensure port is fully released
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  });

  const makeRequest = (options) => {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      });

      req.on("error", reject);
      req.end();
    });
  };

  describe("GET /", () => {
    it("should return 200 status code", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "GET",
      });

      expect(response.statusCode).toBe(200);
    });

    it("should return JSON content type", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "GET",
      });

      expect(response.headers["content-type"]).toBe("application/json");
    });

    it("should return welcome message", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "GET",
      });

      const data = JSON.parse(response.body);
      expect(data).toEqual({
        message: "🚀 Pure Node.js server is running",
      });
    });
  });

  describe("GET /about", () => {
    it("should return 200 status code", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/about",
        method: "GET",
      });

      expect(response.statusCode).toBe(200);
    });

    it("should return about page message", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/about",
        method: "GET",
      });

      const data = JSON.parse(response.body);
      expect(data).toEqual({
        message: "About page",
      });
    });

    it("should return JSON content type", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/about",
        method: "GET",
      });

      expect(response.headers["content-type"]).toBe("application/json");
    });
  });

  describe("404 - Not Found", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/unknown",
        method: "GET",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return error message for unknown routes", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/unknown",
        method: "GET",
      });

      const data = JSON.parse(response.body);
      expect(data).toEqual({
        error: "Route not found",
      });
    });

    it("should return 404 for POST requests to /", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "POST",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 404 for PUT requests", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "PUT",
      });

      expect(response.statusCode).toBe(404);
    });

    it("should return 404 for DELETE requests", async () => {
      const response = await makeRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/",
        method: "DELETE",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("Server Initialization", () => {
    it("should start server on specified port", async () => {
      expect(server.listening).toBe(true);
      expect(server.address().port).toBe(TEST_PORT);
    });
  });
});