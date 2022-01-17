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
const client = new Client(dbConfig);
client.connect();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/resources", async (req, res) => {
  try {
    const dbres = await client.query("select * from resources");

    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        resources: dbres.rows,
      });
    } else if (dbres.rows.length === 0) {
      res.status(200).json({
        status: "success",
        resources: dbres.rows,
        message: "no items in resources",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const dbres = await client.query("select * from users");
    res.status(200).json({
      status: "success",
      users: dbres.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/tags", async (req, res) => {
  try {
    const dbres = await client.query("select * from tags");
    res.status(200).json({
      status: "success",
      tags: dbres.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/tags/:resourceid", async (req, res) => {
  try {
    const resourcesid = req.params.resourceid;
    const dbres = await client.query(
      "select category from (tags join tagrelations on tags.id=tagrelations.tagid) where resourceid=$1 ",
      [resourcesid]
    );
    const tags: string[] = [];
    dbres.rows.forEach((tagObj) => tags.push(tagObj.category));
    res.status(200).json({
      status: "success",
      tags: tags,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/tostudy/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const dbres = await client.query("select * from tostudy where userid=$1 ", [
      userid,
    ]);
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        tostudylist: dbres.rows,
      });
    } else if (dbres.rows.length === 0) {
      res.status(200).json({
        status: "success",
        tostudylist: dbres.rows,
        message: "no items in tostudylist",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/resources", async (req, res) => {
  try {
    const {
      resourcename,
      authorname,
      url,
      description,
      contenttype,
      contentstage,
      postedbyuserid,
      isrecommended,
      reason,
    } = req.body;
    const dbres = await client.query(
      "INSERT INTO resources (resourcename, authorname, url, description, contenttype, contentstage, postedbyuserid, isrecommended, reason) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
      [
        resourcename,
        authorname,
        url,
        description,
        contenttype,
        contentstage,
        postedbyuserid,
        isrecommended,
        reason,
      ]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        resourceAdded: dbres.rows[0],
      });
    } else if (resourcename === " ") {
      throw new Error("this is a test");
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no resources added",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    console.error(error);
    if (error.code === 23505 || error.code === "23505") {
      res.status(403).json({
        status: "failed",
        message:
          "resource could not be added: the resourcename or url already exists",
      });
    }
  }
});

app.post("/tostudy", async (req, res) => {
  try {
    const { userid, resourceid } = req.body;
    const dbres = await client.query(
      "INSERT INTO tostudy (userid, resourceid) VALUES ($1,$2)  returning *",
      [userid, resourceid]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        tostudyAdded: dbres.rows[0],
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",

        message: "no resources added",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/tagrelations", async (req, res) => {
  try {
    const { tagid, resourceid } = req.body;
    const dbres = await client.query(
      "INSERT INTO tagrelations (tagid, resourceid) VALUES ($1,$2)  returning *",
      [tagid, resourceid]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        tagrelations: dbres.rows[0],
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no tags added",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.delete("/tagrelations", async (req, res) => {
  try {
    const { tagid, resourceid } = req.body;
    const dbres = await client.query(
      "DELETE FROM tagrelations where tagid=$1 and resourceid=$2 returning *",
      [tagid, resourceid]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        tagrelations: dbres.rows[0],
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no tags deleted",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.delete("/tostudy", async (req, res) => {
  try {
    const { userid, resourceid } = req.body;
    const dbres = await client.query(
      "Delete from tostudy where userid=$1 and resourceid=$2 returning * ",
      [userid, resourceid]
    );
    res.status(200).json({
      status: "success",
      toStudyDeleted: dbres.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/interactions", async (req, res) => {
  try {
    const { userid, resourceid, rating, comment } = req.body;
    const dbres = await client.query(
      "INSERT INTO interactions (userid, resourceid, rating, comment)VALUES ($1,$2,$3,$4) returning * ",
      [userid, resourceid, rating, comment]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        interactions: dbres.rows[0],
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no interactions added",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.delete("/interactions", async (req, res) => {
  try {
    const { userid, resourceid } = req.body;
    const dbres = await client.query(
      "Delete from interactions where userid=$1 and resourceid=$2 returning * ",
      [userid, resourceid]
    );
    res.status(200).json({
      status: "success",
      InteractionsDeleted: dbres.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/interactions", async (req, res) => {
  try {
    const dbres = await client.query("select * from interactions ");
    res.status(200).json({
      status: "success",
      interactions: dbres.rows,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/interactions/:resourceid", async (req, res) => {
  try {
    const resourceid = req.params.resourceid;
    const dbres = await client.query(
      "select * from interactions where resourceid = $1 ",
      [resourceid]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        interactions: dbres.rows,
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no interactions found",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/interactionsbyuser/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;
    const dbres = await client.query(
      "select * from interactions where userid = $1 ",
      [userid]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        interactions: dbres.rows,
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no interactions found",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/tags", async (req, res) => {
  try {
    const { category } = req.body;
    const dbres = await client.query(
      "INSERT INTO tags (category)VALUES ($1) returning * ",
      [category]
    );
    if (dbres.rows.length > 0) {
      res.status(200).json({
        status: "success",
        tags: dbres.rows[0],
      });
    } else if (dbres.rows.length === 0) {
      res.status(400).json({
        status: "failed",
        message: "no tags added",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
