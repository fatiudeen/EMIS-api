import mongoose from 'mongoose'

export default ()=>{
    mongoose
    .connect(process.env.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Successfully Connected'))
    .catch((err) => console.log(err))

}