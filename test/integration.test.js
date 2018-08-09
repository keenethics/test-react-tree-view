import supertest from "supertest"
import chai from 'chai'

import {server} from "../server/index"

const {expect} = chai

describe('API tests', () => {
  it('should be online', (done) => {
    supertest(server)
      .get('/sectors')
      .end((err, response) => {
        if (err) {
          done(err);
        } else {
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
          expect( response.body['code'] ).equals( errorType );
          done();
        }
      });
  });

  it('has API version 1', (done) => {
    supertest(server)
      .get( '/sectors' )
      .set( 'accept-version', '~1' )
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
        expect(response.status).to.equal(500);
        done();
      })

  })

})

