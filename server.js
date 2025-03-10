const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Allows access from external sources
const app = express();
const PORT = process.env.PORT || 3000;

// Start the server
// ✅ Enable CORS to allow requests from Chrome extensions
app.use(
  cors({
    origin: "*", // Allow all origins (adjust this for security)
    methods: ["GET", "POST"], // Allow only GET and POST
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Enable JSON parsing

let articles = []; // Stores articles dynamically

// Receive updated articles from the Chrome extension
app.post("/update-rss", (req, res) => {
  articles = req.body.articles;
  console.log("✅ Articles updated in server:", articles);
  res.send({ message: "Articles received" });
});

// Serve RSS as XML
app.get("/rss.xml", async (req, res) => {
  let rssXML = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>My Read Articles</title>
            <link>http://localhost:${PORT}/rss.xml</link>
            <description>Articles I have read and saved</description>`;

  articles?.forEach((article) => {
    rssXML += `
            <item>
                <title>${article.title}</title>
                <link>${article.link}</link>
                <description>${article.description}</description>
                <media:content height="${article.imageHeight}" medium="${article.imageMedium}" url="${article.imageUrl}" width="${article.imageWidth}"/>
            </item>`;
  });

  rssXML += `
        </channel>
    </rss>`;

  res.set("Content-Type", "application/rss+xml");
  res.send(rssXML);
});

app.listen(PORT, () => {
  console.log(`🚀 RSS Feed running at http://localhost:${PORT}/rss.xml`);
});
