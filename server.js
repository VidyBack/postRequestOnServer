const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const customHeadersMiddleware = (req, res, next) => {
  // Set custom headers
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("abc", "XYZ123");

  // Continue with the next middleware or route handler
  next();
};

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customHeadersMiddleware);

// Function to update records by IDs and add a key-value pair
const updateRecordsWithKeyValue = (ids, key, value, purpose) => {
  ids.forEach((id) => {
    db.get(purpose) // Replace with your actual collection name in db.json
      .find({ id }) // Find the record with the specified id
      .assign({ [key]: value }) // Add the key-value pair
      .write(); // Write the changes to the db
  });
};
// updateRecordsWithKeyValue([
// "gihkPw9_2_k6yI2",
// "8F9l5dNZOmrI2ouKPyFGV",
// "DpPY0Pf64_1M12aa12",
// "v8Vh78ODY9AWaww-zYIqX",
// "IgmexWTsLls7ffJ2OEMMe",
// "gihkPw9_4_k6yI2",
// "JdxfFVs8c9LhrVBzF5CJy",
// "0iHBAf5uOM60EHSaTCPcq",
// "_Dmc0ORMcRVr-4JwjS4qZ",
// "3wg-CFuwOH3O6SgD9zj7w"
//   ],
// // "speedX",2,
// "speedXfortwoImage",1.25,
// "p_ps");

server.post("/:purpose", (req, res) => {
  // Process the request body and add/update data in db.json using lowdb
  const newData = req.body;
  // Add a new post
  db.get(req.params.purpose).push(newData).write();
  console.log("Added new post:", newData);
  res.status(200).json(newData);
});

server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});
