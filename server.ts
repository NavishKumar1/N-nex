import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing json and urlencoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API proxy for zipball download (bypasses CORS & GitHub rate limitations)
  app.get("/api/proxy/zipball", async (req, res) => {
    const { owner, repo, branch } = req.query;
    if (!owner || !repo || !branch) {
      return res.status(400).json({ error: "Missing required query parameters: owner, repo, branch" });
    }

    try {
      const ownerStr = String(owner);
      const repoStr = String(repo);
      const branchStr = String(branch);

      // Define multiple fallback targets to ensure we absolutely fetch the repo code package
      const candidateUrls = [
        `https://codeload.github.com/${ownerStr}/${repoStr}/legacy.zip/${branchStr}`,
        `https://codeload.github.com/${ownerStr}/${repoStr}/zip/refs/heads/${branchStr}`,
        `https://github.com/${ownerStr}/${repoStr}/archive/refs/heads/${branchStr}.zip`,
        `https://github.com/${ownerStr}/${repoStr}/archive/${branchStr}.zip`,
        `https://api.github.com/repos/${ownerStr}/${repoStr}/zipball/${branchStr}`
      ];

      let lastErrorText = "Unreachable candidates";
      let downloadedBuffer: Buffer | null = null;

      for (const url of candidateUrls) {
        try {
          console.log(`[Proxy] Initiating dynamic fallback download stream targeting: ${url}`);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              "Accept": "application/vnd.github+json,application/octet-stream,*/*",
            },
            redirect: "follow"
          });

          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            downloadedBuffer = Buffer.from(arrayBuffer);
            console.log(`[Proxy] Success! Retrieved ${downloadedBuffer.length} raw bytes from: ${url}`);
            break;
          } else {
            const text = await response.text().catch(() => "");
            console.warn(`[Proxy] URL [${url}] failed with status: ${response.status} ${response.statusText} - ${text.substring(0, 100)}`);
            lastErrorText = `Status ${response.status}: ${response.statusText || "Error"}`;
          }
        } catch (candidateErr: any) {
          console.warn(`[Proxy] Non-fatal candidate error targeting [${url}]:`, candidateErr.message || candidateErr);
          lastErrorText = candidateErr.message || "Network socket drop during pipelined request";
        }
      }

      if (!downloadedBuffer) {
        console.error("[Proxy] Completed scan of all candidate targets. Zero matching zip buffers retrieved.");
        return res.status(502).json({
          error: `Failed to fetch repository ZIP from GitHub. Reason: ${lastErrorText}`
        });
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${repoStr}-${branchStr}.zip"`);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(downloadedBuffer);
    } catch (err: any) {
      console.error("[Proxy] Critical exception intercepting zipball stream:", err);
      res.status(500).json({ error: err.message || "Internal engine failure routing network zip streams" });
    }
  });

  // API health route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/summarize-commit", async (req, res) => {
    try {
      const { message, diff } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "No API key configured for auto-summaries." });
      }
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Analyze this commit and provide a clear, one-paragraph human-readable summary of what changed and its architectural impact. Keep it concise, insightful, and focused on why the change was made if apparent from the code. If the diff is too long, focus on the commit message and key structural changes.\n\nCommit Message: ${message}\n\nDiff Changes:\n${diff}`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return res.json({ summary: response.text });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: "Failed to generate summary: " + e.message });
    }
  });

  // Vite middleware for development vs static asset output in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on port ${PORT}`);
  });
}

startServer();
