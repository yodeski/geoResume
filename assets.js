var path = require('path');
const inert = require('inert');
const vision = require('vision');

exports.register = (server, options, next) => {
  
  server.register([inert, vision], (err)=> {
    server.route(
    {
        method: 'GET', config: { auth: false },
        path: '/public/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        }
    }); 
    
    if (err) {
      throw err;
    }
    
  });
  
  next();
};

exports.register.attributes = {
  name: 'assets',
  version: '1.0.0'
};