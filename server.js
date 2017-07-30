'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Fs = require('fs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8888,
});

server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('ejs')
        },
        relativeTo: __dirname,
        path: 'html',
        layoutPath: 'html',
        layout: 'layout',
        partialsPath: 'html/views'
    });
});

const assets = require('./assets');
server.register([
    {
        register: assets
    },
    {
        register: require('hapi-plug-routes'),
        options: {
            directory: '/routes/'
        }
    }, 
], function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }

    // Start the server
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});




