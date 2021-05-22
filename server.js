const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
//starting app
const app = express()

mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB CONNECTION ERROR: ', err));

//importing routes
const authRoutes = require('./routes/auth')

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
if(process.env.NODE_ENV == 'development'){
    app.use(cors({origin: `http://localhost:3000`}))
}

app.use('/api', authRoutes)


const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
