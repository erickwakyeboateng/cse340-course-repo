import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";

// Define the port number
const PORT = process.env.PORT || 3000;

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express application
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  const title = "Home";
  res.render("home", { title });
});

app.get("/organizations", (req, res) => {
  const title = "Our Partner Organizations";
  res.render("organizations", { title });
});

app.get("/projects", (req, res) => {
  const title = "Service Projects";
  res.render("projects", { title });
});

app.get("/categories", (req, res) => {
  const title = "Service Project Categories";
  res.render("categories", { title });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
