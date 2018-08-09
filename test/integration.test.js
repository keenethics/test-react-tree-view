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
        }
        else {
          expect(response.status).to.equal(200);
          expect(response.type).to.equal('application/json');
          done();
        }
      });
  });
})

