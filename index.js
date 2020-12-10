const https  = require('https');
const dotenv = require('dotenv');
const httpPromise  = require('./httpPromise');
const stringSimilarity = require('string-similarity');
const emre = require('./emre');

dotenv.config();

let options = {
  hostname: 'api.getpostman.com',
  port: 443,
  path: '/collections',
  method: 'GET',
  headers: { 'X-API-Key': process.env.API_KEY } 
}

let create = {
    hostname: 'api.getpostman.com',
    port: 443,
    path: '/collections',
    method: 'POST',
    headers: { 'X-API-Key': process.env.API_KEY, 'Content-Type' : 'application/json' } 
  }

httpPromise(options)
            .then(res => {
                    let bestMach = stringSimilarity.findBestMatch('TestRunner - FollowUp - Q -C - R-Ren', 
                    JSON.parse(res.body.toString( )).collections.map( 
                                            currentVal => {
                                                return currentVal.name;
                                            }) 
                                            );
                    return JSON.parse(res.body.toString( )).collections[bestMach.bestMatchIndex].id;     

                })
            .then(id => {
                options.path += '/' + id;
                httpPromise(options).then( res => {

                return emre( res.body.toString( ) );

                }).then( newCollection => {
                
                    httpPromise(create,JSON.stringify(newCollection) ).then( res => {
                        console.log(res);
                    }).catch( err => { console.log(err) });
                })
            })
            .catch(
                err => console.log(err)
                );