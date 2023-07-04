const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to the database...')
mongoose.connect(url).then(()=>{
  console.log('Successfully Connected')
}).catch((error)=>{
  console.log('error while connecting:',error)
})

const personSchema = new mongoose.Schema({
  name:{
    type:String,
    minLength:[3,'Minimum length of name must be 3'],
    required:true
  },
  number:{
    type:String,
    minLength:[8,'Minimum length of phone number must be 8'],
    required:true,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  }
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

