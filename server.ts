import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("curricuforge.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS syllabi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/syllabi", (req, res) => {
    const rows = db.prepare("SELECT * FROM syllabi ORDER BY created_at DESC").all();
    res.json(rows);
  });

  app.post("/api/syllabi", (req, res) => {
    const { title, level, content } = req.body;
    const info = db.prepare("INSERT INTO syllabi (title, level, content) VALUES (?, ?, ?)").run(title, level, content);
    res.json({ id: info.lastInsertRowid, title, level, content });
  });

  app.delete("/api/syllabi/:id", (req, res) => {
    db.prepare("DELETE FROM syllabi WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
