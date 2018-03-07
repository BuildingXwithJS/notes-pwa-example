const fastify = require('fastify');
const next = require('next');
const {join} = require('path');
const {parse} = require('url');
const webpush = require('web-push');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const privatePushKey = 'GT5MnYpSVS_7ck6KJwvity2jUtcHG3WXXUNbUVaGiIo';
const publicPushKey = 'BDKOFZa1hweygmvyO1l4G7qGIhD8ewFN6E-wLFmYGHa9f0_aR47YeLLSaaLlN-VGAGf2WsEIGgd2SMnSsU1UkpU';

const notes = [];

const subscriptions = [];

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

  server.post('/push', (req, reply) => {
    subscriptions.push(req.body.subscription);
    const options = {
      vapidDetails: {
        subject: 'https://developers.google.com/web/fundamentals/',
        publicKey: publicPushKey,
        privateKey: privatePushKey,
      },
      // 1 hour in seconds.
      TTL: 60 * 60,
    };

    webpush.sendNotification(req.body.subscription, 'Hello world!', options);
    reply.send({success: true});
  });

  server.get('*', ({req}, {res}) => {
    const parsedUrl = parse(req.url, true);
    const {pathname} = parsedUrl;
    if (pathname === '/service-worker.js') {
      const filePath = join(__dirname, '.next', pathname);
      return app.serveStatic(req, res, filePath);
    } else if (pathname === '/push-worker.js') {
      const filePath = join(__dirname, 'static', pathname);
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
