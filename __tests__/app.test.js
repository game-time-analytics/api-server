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

  it('should return 404 since page does not exist', () => {

    return mockRequest
      .post('/api/v1/players/12')
      .then(results => {
        expect(results.status).toBe(404);
      });

  });

  it('should return 404 since page does not exist', ()  => {

    let obj = {name:'John', bats:'R',throws:'R',position:'C',team:'Bunnies'};

    return mockRequest
      .post('/api/v1/players')
      .send(obj)
      .then(results => {
        expect(results.status).toBe(404);
      });
  });


  it('following a post to a valid model, should find a single record', () => {

    let obj = {name:'John', bats:'R',throws:'R',position:'C',team:'Bunnies'};

    return mockRequest
      .post('/api/v1/players')
      .send(obj)
      .then(results => {
        return mockRequest.get(`/api/v1/players/${results.body._id}`)
          .then(list => {
            expect(list.status).toBe(404);
          });
      });

  });

});