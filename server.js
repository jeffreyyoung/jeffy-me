const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
console.log('IS PROD', dev);
const app = next({ dev })
const handle = app.getRequestHandler()
const SocketHandler = require('./socket');
const createServer = require('http').createServer;
app.prepare()
.then(() => {
  const server = express()
  server.use(express.static('static'));
  const http = createServer(server);
  server.get('/p/:id', (req, res) => {
    const actualPage = '/post'
    const queryParams = { title: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('/u/:id', (req, res) => {
    const actualPage = '/user'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })
  console.log('here???wtf');
  const socketHandler = new SocketHandler(http);
  http.listen(3000, (err) => {
    if (err) throw err
    console.log('> wtfReady on http://localhost:3000')
  })


})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
