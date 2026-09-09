import express from "express";
import path from "path";
import fs from "fs";
import { localStore } from "./server/localStore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Media upload route (receives raw file payload)
  app.post("/api/media/upload", express.raw({ type: "*/*", limit: "50mb" }), (req, res) => {
    try {
      const filename = (req.query.filename as string) || `upload-${Date.now()}.png`;
      const cleanFilename = path.basename(filename);
      const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
      const url = localStore.saveMedia(cleanFilename, buffer);
      return res.json({ url });
    } catch (err: any) {
      console.error("Media upload error:", err);
      return res.status(500).json({ error: err.message || "Failed to upload media" });
    }
  });

  // Media file serving
  app.get("/api/media/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    const media = localStore.getMedia(filename);
    if (!media) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", media.contentType);
    return res.send(media.buffer);
  });

  // Backward compatibility for existing uploads that may use the supabase storage path
  app.get("/api/supabase/storage/v1/object/public/media/:filename", (req, res) => {
    const filename = path.basename(req.params.filename);
    const media = localStore.getMedia(filename);
    if (!media) {
      return res.status(404).send("File not found");
    }
    res.setHeader("Content-Type", media.contentType);
    return res.send(media.buffer);
  });

  // JSON Body Parser for standard REST API endpoints
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Products API
  app.get("/api/products", (req, res) => {
    try {
      const query = req.query as Record<string, string>;
      const products = localStore.getProducts(query);
      return res.json(products);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    const products = localStore.getProducts({ id: req.params.id });
    if (products.length > 0) {
      return res.json(products[0]);
    }
    return res.status(404).json({ error: "Product not found" });
  });

  app.post("/api/products", (req, res) => {
    try {
      const body = req.body;
      if (Array.isArray(body)) {
        const saved = body.map(item => localStore.saveProduct(item));
        return res.status(200).json(saved);
      }
      const saved = localStore.saveProduct(body);
      return res.status(200).json(saved);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    try {
      localStore.deleteProduct(req.params.id);
      return res.json({ success: true, id: req.params.id });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Site Settings API
  app.get("/api/settings", (_req, res) => {
    try {
      const settings = localStore.getSiteSettings();
      return res.json(settings);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/settings", (req, res) => {
    try {
      const updated = localStore.saveSiteSettings(req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Pages API
  app.get("/api/pages/:slug", (req, res) => {
    try {
      const page = localStore.getPage(req.params.slug);
      if (page) {
        return res.json(page);
      }
      return res.status(404).json({ error: "Page not found" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/pages", (req, res) => {
    try {
      const saved = localStore.savePage(req.body);
      return res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Analytics API
  app.post("/api/analytics", (req, res) => {
    try {
      localStore.addAnalyticsEvent(req.body);
      return res.status(201).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/analytics/stats", (_req, res) => {
    try {
      const allEvents = localStore.getAnalyticsEvents({});
      const totalViews = allEvents.filter(e => e.event_type === "page_view").length;
      const socialClicks = allEvents.filter(e => (e.event_name || "").startsWith("social_")).length;
      const scans = allEvents.filter(e => e.event_name === "click_scan_shoe").length;

      return res.json({
        totalViews,
        socialClicks,
        scans
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distCandidates = [
      path.join(process.cwd(), "dist"),
      path.join(__dirname, "dist"),
      process.cwd(),
      __dirname,
    ];
    const distPath = distCandidates.find(p => fs.existsSync(path.join(p, "index.html"))) || path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (typeof (global as any).PhusionPassenger !== "undefined") {
    app.listen("passenger", () => {
      console.log("Server running on Phusion Passenger (cPanel)");
    });
  } else {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();
