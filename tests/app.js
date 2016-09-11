const app = require('../dist/index')
let request = require('supertest');
const should = require('should');

agent = request.agent(app);
agent2 = request.agent(app);
agent3 = request.agent(app);


describe('Authentication and login tests', function() {

    it('Should get hompage', function(done) {
        agent.get('/')
        .expect(200)
        .end(function(err, res) {
            res.text.should.match(/Sign up or log in to Taut/)
            done(err);
        });
    })

    it('Should signup', function(done) {
        agent.post('/')
        .send('nic=max&pass=password')
        .expect(200)
        .end(function(err, res) {
            res.text.should.match(/Message #general/)
            done(err);
        });
    })

    it('Login should not work with incorrect password', function(done) {
        agent2.post('/')
        .send('nic=max&pass=notpassword')
        .expect(400)
        .end(function(err, res) {
            res.text.should.match(/Sign up or log in to Taut/)
            res.text.should.match(/Incorrect password, or username is already taken!/)
            done(err);
        });
    })

    it('Correct login should work for another user', function(done) {
        agent3.post('/')
        .send('nic=max&pass=password')
        .expect(200)
        .end(function(err, res) {
            res.text.should.match(/Message #general/)
            done(err);
        });
    })

    it('Should still be logged in', function(done) {
        agent.get('/')
        .expect(200)
        .end(function(err, res) {
            res.text.should.match(/Message #general/)
            done(err);
        });
    })

    it('Should be able to send message', function(done) {
        agent.post('/message')
        .send("message=foo")
        .expect(302)
        .expect('Location', '/')
        .end(function(err, res) {
            done(err);
        });
    })

    it('Should be able to get message', function(done) {
        agent.get('/messages.json')
        .expect(200)
        .end(function(err, res) {
            res.body.msgs[0].should.match(/>foo</)
            done(err);
        });
    })


    it('Should be able to send formatted message', function(done) {
        agent.post('/message')
        .send("message=>+*bold*+_italic_+~strikethrough~")
        .expect(302)
        .expect('Location', '/')
        .end(function(err, res) {
            agent.get('/messages.json')
            .expect(200)
            .end(function(err, res) {
                res.body.msgs[1].should.match(
                    /<blockquote> <b>bold<\/b><i>italic<\/i><strike>strikethrough<\/strike><\/blockquote>/
                )
                done(err);
            });
        });
    })

})
