import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";
import { createServer } from "./server.js";

const isStdio = process.argv.includes("--stdio");

if (isStdio) {
  // ── Stdio mode (for Claude Desktop) ────────────────────────────
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Vibecoding Quiz MCP server running on stdio");
} else {
  // ── HTTP mode (for testing / remote) ───────────────────────────
  const app = express();
  app.use(cors());
  app.use(express.json());

  const PORT = parseInt(process.env.PORT || "3456", 10);

  // Map of session ID -> transport for streamable HTTP
  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.post("/mcp", async (req, res) => {
    const sessionId =
      (req.headers["mcp-session-id"] as string) || "default";

    let transport = transports.get(sessionId);
    if (!transport) {
      const server = createServer();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId,
      });
      transports.set(sessionId, transport);
      await server.connect(transport);
    }

    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", async (req, res) => {
    const sessionId =
      (req.headers["mcp-session-id"] as string) || "default";
    const transport = transports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    await transport.handleRequest(req, res);
  });

  app.delete("/mcp", async (req, res) => {
    const sessionId =
      (req.headers["mcp-session-id"] as string) || "default";
    const transport = transports.get(sessionId);
    if (transport) {
      await transport.handleRequest(req, res);
      transports.delete(sessionId);
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Vibecoding Quiz MCP server running at http://localhost:${PORT}/mcp`);
  });
}
