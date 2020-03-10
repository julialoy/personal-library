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
  comments: {type: Array, required: true},
  __v: {type: Number, select: false}
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
      let result = [];

      PersonalLibrary.find()
        .then( docs => {
          
          docs.forEach( doc => result.push({_id: doc._id, title: doc.title, commentcount: doc.comments.length})) ;
          return res.json(result);
        })
        .catch( err => res.json('Could not retrieve books') );
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
        .catch( err => res.json({error: `Could not save ${title} to database`}) );
    })
    
    .delete(function(req, res){
      PersonalLibrary.deleteMany()
        .then( () => res.json('complete delete successful') )
        .catch( err => res.json('complete delete unsuccessful') );
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      const bookId = req.params.id;
      
      PersonalLibrary.findById({_id: bookId})
        .then( doc => res.json(doc) )
        .catch( err =>  res.json('no book exists') );
   })
    
    .post(function(req, res, next){
      const bookId = req.params.id;
      const comment = req.body.comment;

      PersonalLibrary.findById({_id: bookId})
        .then( doc => {
          doc.comments.push(comment);
          doc.save()
            .then( () => res.json(doc) )
            .catch( err => next(err) );
        })
        .catch( err => res.json('no book exists') );
    })
    
    .delete(function(req, res){
      const bookId = req.params.id;

      PersonalLibrary.deleteOne({_id: bookId})
        .then( () => res.json('delete successful') )
        .catch( err => res.json('no book exists') );
    });
  
};
