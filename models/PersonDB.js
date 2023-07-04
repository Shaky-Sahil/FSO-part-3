const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to the database...');
mongoose.connect(url).then((res)=>{
    console.log("Successfully Connected");
}).catch((error)=>{
    console.log("error while connecting:",error);
})

const personSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:[3,'Minimum length of name must be 3'],
        required:true
    },
    number:Number
})

personSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person',personSchema)

module.exports = Person

