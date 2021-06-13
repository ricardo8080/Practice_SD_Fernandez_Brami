const mongoose = require('mongoose');
const URI = ('mongodb://mongo:27017');

mongoose.connect( URI,{ 
    useNewUrlParser: true 
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

module.exports = mongoose;