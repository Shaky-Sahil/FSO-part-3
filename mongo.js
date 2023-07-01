const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log("passowrd not provided");
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://sahilpk81:${password}@cluster0.ijxpubg.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name:String,
    number:Number
})
const Person = mongoose.model('Person',personSchema)

if(process.argv.length===3){
    Person.find({}).then((result)=>{
        console.log("Phonebook:")
        result.forEach((r)=>console.log(r.name,r.number))
        mongoose.connection.close()
        process.exit(1)
    })
}
if(process.argv.length===5){
    const newPerson =  new Person({
        name:process.argv[3],
        number:process.argv[4]
    })
    newPerson.save(newPerson).then(()=>{
        console.log("person saved")
        mongoose.connection.close()
    })
}
