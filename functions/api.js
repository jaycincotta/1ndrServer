'use strict'
require("dotenv").config()
const express = require("express")
const app = express()
const serverless = require('serverless-http');
const cors = require("cors")
const router = express.Router();

app.use(express.json())
app.use(cors())
app.use('/.netlify/functions/api', router);  // path must route to lambda

const stripe = require("stripe")(process.env.STRIPE_SECRET)

router.get('/', async (req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<h1>Hey there from Express.js!</h1>');
	res.end();
});

router.get('/hello', (req, res) => {
	console.log("Do you see this?")
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<h1>Hello, Hello!</h1>');
	res.end();
})

router.post("/checkout", async (req, res) => {
	console.log("REQUEST BODY", req.body);
	const { title, product, price, format, cancelUrl } = req.body
	const successURL = req.headers.referer + "thanks"
	const cancelURL = cancelUrl
	const errorURL = req.headers.referer + "error"


	try {
		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			payment_method_types: ['card'],
			success_url: successURL,
			cancel_url: cancelURL,
			automatic_tax: { enabled: false },
			shipping_address_collection: {
				allowed_countries: ['US'],
			},
			phone_number_collection: {
				enabled: true,
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: {
							amount: 0,
							currency: 'usd',
						},
						display_name: 'Free shipping',
						delivery_estimate: {
							minimum: {
								unit: 'business_day',
								value: 5,
							},
							maximum: {
								unit: 'business_day',
								value: 10,
							},
						}
					}
				},

			],
			line_items: [{
				price_data: {
					unit_amount: price * 100,
					currency: "USD",
					product_data: {
						name: `${title}: ${product}`
					},
				},
				adjustable_quantity: format === "original" ? { enabled: false } : {
					enabled: true,
					minimum: 1,
					maximum: 10
				},
				quantity: 1
			}]
		})
		console.log("STRIPE RESPONSE", session.url, session)
		res.json({ url: session.url })
	} catch {
		res.json({ url: errorURL })
	}
})

module.exports = app;
module.exports.handler = serverless(app);
