import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/resources", async (req, res) => {
  const dbres = await client.query("select * from resources");
  res.json(dbres.rows);
});

app.get("/users", async (req, res) => {
  const dbres = await client.query("select * from users");
  res.json(dbres.rows);
});

app.get("/tags", async (req, res) => {
  const dbres = await client.query("select * from tags");
  res.json(dbres.rows);
});

app.get("/tostudy/:userid", async (req, res) => {
  const userid = req.params.userid;
  const dbres = await client.query(
    "select * from (resources join tostudy on resources.id=tostudy.resourceid) where userid=$1 ",
    [userid]
  );
  res.json(dbres.rows);
});

app.get("/tags/:resourceid", async (req, res) => {
  const resourcesid = req.params.resourceid;
  const dbres = await client.query(
    "select category from (tags join tagrelations on tags.id=tagrelations.tagid) where resourceid=$1 ",
    [resourcesid]
  );
  res.json(dbres.rows);
  console.log(dbres);
});

app.get("/tostudy/:userid", async (req, res) => {
  const userid = req.params.resources;
  const dbres = await client.query(
    "select * from (resources left join tostudy on resources.id=tostudy.resourceid) where userid=$1 ",
    [userid]
  );
  res.json(dbres.rows);
  console.log(dbres.rows);
});

app.post("/resources", async (req, res) => {
  const {
    resourceName,
    authorName,
    url,
    description,
    contentType,
    contentStage,
    postedByUserId,
    isRecommended,
    reason,
  } = req.body;
  const dbres = await client.query(
    "INSERT INTO resources (resourceName, authorName, url, description,contentType, contentStage,postedByUserID,isRecommended, reason) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
    [
      resourceName,
      authorName,
      url,
      description,
      contentType,
      contentStage,
      postedByUserId,
      isRecommended,
      reason,
    ]
  );
  res.json(dbres.rows);
});

app.post("/tostudy", async (req, res) => {
  const { userid, resourceid } = req.body;
  const dbres = await client.query(
    "INSERT INTO tostudy (userid, resourceid) VALUES ($1,$2)  returning *",
    [userid, resourceid]
  );
  res.json(dbres.rows);
});

app.post("/tagrelations", async (req, res) => {
  const { tagid, resourceid } = req.body;
  const dbres = await client.query(
    "INSERT INTO tagrelations (tagid, resourceid) VALUES ($1,$2)  returning *",
    [tagid, resourceid]
  );
  res.json(dbres.rows);
});

app.delete("/tostudy", async (req, res) => {
  const { userid, resourceid } = req.body;
  const dbres = await client.query(
    "Delete from tostudy where userid=$1 and resourceid=$2 returning * ",
    [userid, resourceid]
  );
  res.json(dbres.rows);
});

app.post("/interactions", async (req, res) => {
  const { userid, resourceid, likes, comment } = req.body;
  const dbres = await client.query(
    "INSERT INTO interactions (userid, resourceid,likes, comment)VALUES ($1,$2,$3,$4) returning * ",
    [userid, resourceid, likes, comment]
  );
  res.json(dbres.rows);
});

app.get("/interactions", async (req, res) => {
  const dbres = await client.query("select * from interactions ");
  res.json(dbres.rows);
});

app.get("/interactions/:resourceid", async (req, res) => {
  const { resourceid } = req.body;
  const dbres = await client.query(
    "select * from interactions where resourceid = $1 ",
    [resourceid]
  );
  res.json(dbres.rows);
});

app.post("/tags", async (req, res) => {
  const { category } = req.body;
  const dbres = await client.query(
    "INSERT INTO tags (category)VALUES ($1) returning * ",
    [category]
  );
  res.json(dbres.rows);
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
