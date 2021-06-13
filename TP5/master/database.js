const mongoose = require('mongoose');
//const URI = ('mongodb://mongo:27017');
const URL = ('mongodb://mongo:27017');
/*
mongoose.connect( URI, {
    useNewUrlParser: true 
  }).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
*/
mongoose.connect(URL, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("workers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

module.exports = mongoose;