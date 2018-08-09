import supertest from "supertest"
import chai from 'chai'

import {server} from "../server/index"

const {expect} = chai

let cookies = null;

describe('API tests', () => {
  it('should be online', (done) => {
    supertest(server)
      .get('/sectors')
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
          cookies = response.headers['set-cookie'][0];
          expect(response.status).to.equal(200);
          expect(response.type).to.equal('application/json');
          done();
        }
      });
  });

  it('should be create new user', (done) => {
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

  it('Should throw an error', done => {
    supertest(server)
      .post('/save-selectors')
      .end((err, response) => {
        expect(response.status).to.equal(422);
        done();
      })

  })


  it('It should store selected ids for the current user', done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies
    req.send({ids: ["777", "888", '1234']}).end((err, response) => {
      expect(response.status).to.equal(200);
      done();
    })

  })


  it(`It shouldn't pass validation`, done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies
    req.send({ids: {"foo": "bar"}})
      .end((err, response) => {
        console.log(response.status)
        expect(response.status).to.equal(422);

        done();
      })
  })

  it(`Wrong JWT token`, done => {
    const req = supertest(server).post('/save-selectors')
    req.cookies = cookies + 42
    req.send({ids: {"foo": "bar"}})
      .end((err, response) => {
        console.log(response.status)
        expect(response.status).to.equal(404);

        done();
      })
  })
})
