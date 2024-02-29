const createAsyncError = require("../middleware/createAsyncError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = createAsyncError(async (req, res, next) => {
  const myPAyment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPAyment.client_secret });
});

exports.sendStripeApiKey = createAsyncError(async (req, res, next) => {
  res
    .status(200)
    .json({ success: true, stripeApiKey: process.env.STRIPE_API_KEY });
});
