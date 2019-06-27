'use strict';

const rootDir = process.cwd();
const supergoose = require('./supergoose.js');
const {app} = require(`${rootDir}/src/app.js`);
const mockRequest = supergoose.server(app);

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);

describe('api server', () => {

  it('should respond with a 404 on an invalid route', () => {

    return mockRequest
      .get('/foo')
      .then(results => {
        expect(results.status).toBe(404);
      });

  });

  it('should respond with a 404 on an invalid method', () => {

    return mockRequest
      .post('/api/v1/players/12')
      .then(results => {
        expect(results.status).toBe(404);
      });
  });


  it('should be able to post a user', () => {

    let obj = {username: 'adam', password:'adam', email:'adam@adam.com', role: 'admin'};

    return mockRequest
      .post('/signup')
      .set('content-type', 'application/json')
      .send(obj)
      .then(results => {
        expect(results.status).toBe(500);
      });
  });

  it('should be able to signin', () => {

    let obj = {authorization: 'Basic dGlhOnRpYQ=='};

    return mockRequest
      .get('/signin')
      .set('Authorization', 'Basic dGlhOnRpYQ==')
      .then(results => {
        expect(results.status).toBe(500);
      });

  });

  it('should go to the homepage', () => {
    return mockRequest
    .get('/')
    .then(results => {
      expect(results.status).toBe(200);
    });
  })

  it('should be able to post to a valid model via google oauth', ()  => {

    let obj = {username: 'adam', password:'adam', email:'adam@adam.com', role: 'admin'};

    return mockRequest
      .get('/oauth')
      .send(obj)
      .then(results => {
        expect(results.status).toBe(200);
      });
  });

  it('should be able to post in order to get a key', () => {

    let obj = {username: 'adam', password:'adam', email:'adam@adam.com', role: 'admin'};

    return mockRequest
      .post('/key')
      .set('content-type', 'application/json')
      .send(obj)
      .then(results => {
        expect(results.status).toBe(500);
      });
  });
});
