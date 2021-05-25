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
const userRoutes = require('./routes/user')
const paymentRoutes = require('./routes/payment')
const stripeRoutes = require('./routes/stripe')


//middleware
//checks to see if the request comes from webhooks
app.use(
    express.json({
      // We need the raw body to verify webhook signatures.
      // Let's compute it only when hitting the Stripe webhook endpoint.
      verify: function (req, res, buf) {
        if (req.originalUrl.startsWith('/api/stripe/webhook')) {
          req.rawBody = buf.toString();
        }
      },
    })
  );
  
  
app.use(express.urlencoded({ extended: true }));
    
if(process.env.NODE_ENV == 'development'){
    app.use(cors({origin: `http://localhost:3000`}))
}

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', paymentRoutes)
app.use('/api', stripeRoutes)


const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
