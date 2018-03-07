const fastify = require('fastify');
const next = require('next');
const {join} = require('path');
const {parse} = require('url');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const notes = [
  {
    id: 1,
    title: 'Note title test',
    text: 'Note text test',
    expires: new Date(),
  },
  {
    id: 2,
    title: 'Note title test 123',
    text: 'Note text test 123',
    expires: new Date(),
  },
];

const run = async () => {
  await app.prepare();

  const server = fastify();

  server.get('/notes', (req, reply) => {
    reply.send(notes);
  });
  server.post('/notes', (req, reply) => {
    const {note} = req.body;
    note.id = notes.length + 1;
    notes.push(note);
    reply.send(note);
  });

  server.get('*', ({req}, {res}) => {
    const parsedUrl = parse(req.url, true);
    const {pathname} = parsedUrl;
    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '.next', pathname);
      return app.serveStatic(req, res, filePath);
    }
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
};

run();
