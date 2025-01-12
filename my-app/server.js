import { createServer } from 'https';
import { readFileSync } from 'fs';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(
    {
      key: readFileSync('./certificates/localhost.key'),
      cert: readFileSync('./certificates/localhost.crt'),
    },
    (req, res) => {
      handle(req, res);
    }
  )
  .listen(3000, (err) => {
    if (err) throw err;
    console.log('> Server is running on https://localhost:3000');
  });
});
