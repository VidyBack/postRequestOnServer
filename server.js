
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const customHeadersMiddleware = (req, res, next) => {
  // Set custom headers
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('abc', 'XYZ123');

  // Continue with the next middleware or route handler
  next();
};
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(customHeadersMiddleware);

server.post('/:purpose', (req, res) => {

  // Process the request body and add/update data in db.json using lowdb
  // For example:
  const newData = req.body;
 // Add a new post
db.get(req.params.purpose).push(newData).write();
db.write()
console.log('Added new post:', newData);
res.status(200).json(newData);
});


server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
});