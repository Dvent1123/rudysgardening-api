const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST,{
    apiVersion: '2020-08-27'
})

//the env variable for PRICE is the id of product created in stripe dashboard
exports.config = async (req, res) => {
    //in the config is where we would put the price per individual unit
    //we can get the price id out of the url parameters
    const price = await stripe.prices.retrieve(process.env.PRICE)
    //these are all from the stripe API, maybe unit amount isn't set but not sure
    res.send({
        publishableKey: process.env.STRIPE_API_KEY_TEST,
        unitAmount: price.unit_amount,
        currency: price.currency
    })
}

//initiates the stripe session
exports.checkoutSession = async (req, res) => {
    const { sessionID } = req.query
    const session = await stripe.checkout.session.retrieve(sessionID)
    res.send(session)
}

//creates checkout session
exports.createCheckoutSession = async (req, res) => {
    const {price} = req.body

    const domainURL = process.env.CLIENT_URL
    const pmTypes = (process.env.PAYMENT_METHOD_TYPES || 'card').split(',').map((m) => m.trim());

    const session = await stripe.checkout.sessions.create({
        payment_method_types: pmTypes,
        mode: 'payment',
        line_items: [{
            price: price,
            quantity: 1
        }],
        //when it goes to this success url pass in the item id so we can go and update the item
        success_url: `${domainURL}/home`,
        cancel_url: `${domainURL}/settings`,
    })

    res.send({
        sessionId: session.id,
      });
}

//webhooks for async events
exports.webhook = async (req, res) => {

}