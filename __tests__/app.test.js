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


  it('following a post to a valid model, should find a single record', () => {

    let obj = {
      'name': 'Patrick Mahomes',
      'passing': 5097,
      'touchdowns': 50,
      'interceptions': 12,
      'team': 'Kansas City Chiefs',
      'image': 'https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/3139477.png&w=350&h=254',
    };

    return mockRequest
      .post('/api/v1/players')
      .send(obj)
      .then(results => {
        return mockRequest.get('/api/v1/players')
          .then(list => {
            expect(list.status).toBe(200);
          });
      });

  });

});