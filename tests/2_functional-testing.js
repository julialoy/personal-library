/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: "Harry Potter and the Sorcerer's Stone"})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Harry Potter and the Sorcerer's Stone");
            assert.property(res.body, '_id');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.error, 'No book title provided');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            if (err) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'Could not retrieve books');
              done();
            }
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/1234')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/5e66f8574938cf0258e0d4b3')
          .end(function(err, res) {
            if (err) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            } else {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, '5e66f8574938cf0258e0d4b3');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            done();
          }});
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/5e66f8574938cf0258e0d4b3')
          .send({_id: '5e66f8574938cf0258e0d4b3', comment: "This is a test comment"})
          .end(function(err, res) {
            if (err) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            }
            assert.equal(res.status, 200);
            assert.equal(res.body._id, '5e66f8574938cf0258e0d4b3');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[res.body.comments.length-1], 'This is a test comment');
            done();
          });
      });
      
    });

/*     suite('DELETE /api/books/[id] => delete book objects', function() {

      test('Test DELETE /api/books/[id] with valid id', function(done){
        chai.request(server)
          .delete('/api/books/5e66e848c4594801927ada27')
          .end(function(err, res) {
            if (err) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            }
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books with no id (complete delete)', function(done) {
        chai.request(server)
          .delete('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'complete delete successful');
            done();
          });
      });
    }); */

  });

});
