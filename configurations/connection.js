// mongodb connect
const mongoose = require('mongoose');
// const db=require('../errorHandling/dberrors')

mongoose.connect(process.env.DATABASE_URL,()=>{
    // db.on('error', (error) => console.error(error))
    console.log('mongoose connected')
});
mongoose.set('strictQuery',true);

