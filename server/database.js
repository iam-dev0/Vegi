import {URI} from './config/config'
const mongoose = require('mongoose');



mongoose.connect(URI, {
    useNewUrlParser: true
})
    .then(db => console.log(`${URI} is connected`))
    .catch( err => console.log(`Error en Mongo: ${err}`));

module.exports = mongoose;



