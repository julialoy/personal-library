/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

//Not best practice
//Needed to allow FCC automated testing access
process.env.DB='mongodb+srv://new-user_1:H9JNkTUxK0hu9CbB@cluster0-tccbk.mongodb.net/test?retryWrites=true&w=majority';

const expect = require('chai').expect;
//const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId;
//const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: {type: String, required: true},
  comments: {type: Array, required: true}
});
const PersonalLibrary = mongoose.model('PersonalLibrary', bookSchema);

//Mongoose setup and connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DB)
  .then(() => console.log('Connection made'))
  .catch(err => console.error(err));

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res, next){
      const title = req.body.title;

      if (!title) {
        return next(res.json({error: 'No book title provided'}));
      }

      const newBook = new PersonalLibrary({
        title: title,
        comments: []
      });

      newBook.save()
        .then( () => res.json({ title: newBook.title, _id: newBook._id }))
        .catch( err => console.error(err));
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
