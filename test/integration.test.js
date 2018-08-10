import supertest from "supertest"
import chai from 'chai'

import server, { disconnectFromDb } from "../server/index"
import sectors from "../server/data/sectors.json"

const { expect } = chai

let cookies = null;

describe('tree-view API', () => {
  
  after(function(done){
    server.close(done)
    disconnectFromDb()
  })

  it('should be online and return the sectors/selectedSectors when calling /sectors', (done) => {
    supertest(server)
      .get('/sectors')
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          // capturing cookie to be re-used in other api calls
          cookies = response.headers['set-cookie'][0];
          expect(response.status).to.equal(200);
          expect(response.type).to.equal('application/json');
          expect(response.body).to.have.property("sectors");
          expect(response.body).to.have.property("selectedSectors");
          // expect(response.body).to.deep.equal({});
          done();
        }
      });
  });

  it('should create new a user when there is no jwt', (done) => {
    supertest(server)
      .get('/sectors')
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          expect(response.status).to.equal(200);
          expect(response.type).to.equal('application/json');
          expect(response.ok).to.equal(true);
          done();
        }
      });
  });

  it('handle routing errors', (done) => {
    supertest(server)
      .get('/wrongroute')
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          expect(response.status).equals(404);
          const errorType = 'ResourceNotFound';
          expect(response.body['code']).equals(errorType);
          done();
        }
      });
  });

  it('has API version 1', (done) => {
    supertest(server)
      .get('/sectors')
      .set('accept-version', '~1')
      .end((err, response) => {
        if (err) {
          done(err);
        }
        else {
          expect(response.status).to.equal(200);
          done();
        }
      });
  });

  it('should throw an error when a jwt is not provided as a cookie', done => {
    supertest(server)
      .post('/save-selectors')
      .end((err, response) => {
        expect(response.status).to.equal(422);
        done();
      })

  })


  it('should store selected ids for the current user', done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies
    req.send({ids: ["777", "888", '1234']}).end((err, response) => {
      expect(response.status).to.equal(200);
      done();
    })

  })

  it('should return a 404 status when the wrong jwt is provided', done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies + 42
    req.send({ids: {"777": "1234"}})
      .end((err, response) => {
        console.log(response.status)
        expect(response.status).to.equal(404);
        done();
      })
  })

  it(`should return an error if the ids field does not contain valid values`, done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies
    req.send({ids: {"foo": "bar"}})
      .end((err, response) => {
        console.log(response.status)
        expect(response.status).to.equal(422);
        done();
      })
  })
})
