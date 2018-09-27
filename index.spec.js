const request = require('supertest');
const should = require('should');

const app = require('./index');

describe('GET /users is ', () => {

    describe('success', () => {
        it('user object response ', (done) => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                });
        });
        it('response limit', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2);
                    done();
                });
        });
    });

    describe('failure', () => {
        it('if limit is not number, call 400 ', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400)
                .end(done);
        });
    });
});

describe('GET /users/:id ', () => {
    describe('success', () => {
        it('id is 1 user ', (done) => {
            request(app)
                .get('/users/1')
                .end((err,res) => {
                    res.body.should.be.property('id', 1);
                    done();
                });
        });
    });

    describe('failure', () => {
        it('id is not number, call 400 ', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        });

        it('no user, call 404 ', (done) => {
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done);
        });
    });

});

describe('DELETE /users/:id', () => {
    describe('success', () => {
        it('return 204', (done) => {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        });
    });
    describe('failure', () => {
        it('id is not number, call 400', (done) => {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users', () => {
    describe('success', () => {
        let name = 'dan',
            body;
        before(done => {
            request(app)
                .post('/users')
                .send({name})
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        
        it('return new user', (done) => {
            body.should.have.property('id');
            done();
        });

        it('return new user name', (done) => {
            body.should.have.property('name', name);
            done();
        });
    });

    describe('failure', () => {
        let name = 'dan',
            body;
        before(done => {
            request(app)
                .post('/users')
                .send({name})
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                });
        });
        
        it('no name, return 400', (done) => {
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });

        it('user name is duplicated', (done) => {
            request(app)
                .post('/users')
                .send({name:'dan'})
                .expect(409)
                .end(done);
        });
    });
});

describe('PUT /users/:id', () => {
    describe('success', () => {
        it('changed name return', (done) => {
            const name = "then";
            request(app)
                .put('/users/3')
                .send({name})
                .end((err, res) => {
                    res.body.should.have.property('name', name);
                    done();
                });
        });
    });

    describe('failure', () => {
        it('id is not number return 400', (done) => {
            request(app)
                .put('/users/three')
                .expect(400)
                .end(done);
        });

        it('no name, return 400', (done) => {
            request(app)
                .put('/users/3')
                .send({})
                .expect(400)
                .end(done);
        });

        it('no user, return 404', (done) => {
            request(app)
                .put('/users/999')
                .send({name: 'test'})
                .expect(404)
                .end(done);
        });

        it('duplicate name return 409', (done) => {
            request(app)
                .put('/users/3')
                .send({name: 'hey'})
                .expect(409)
                .end(done);
        });
    });

});