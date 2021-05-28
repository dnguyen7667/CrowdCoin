const {createServer} = require('http');
const routes = require('./routes');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production'
});

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) {throw err};
        console.log('Ready on localhost:3000');

    });
});

// check to see if any process using port 3000 : sudo netstat -lntp | grep 3000 , then do sudo kill -9 {PID} (PID== the one at last )
