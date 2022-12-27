const mongoose = require('mongoose');
const URL = "mongodb://localhost:27017/"+process.env.DB_NAME;

mongoose.set("strictQuery", false);

mongoose.connect(URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})