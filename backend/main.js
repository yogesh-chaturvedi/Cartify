const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
require('./models/db')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const AuthRoute = require('./routes/AuthRoutes')
const ProductRoute = require('./routes/ProductRoutes')
const UsersRoute = require('./routes/UsersRoutes')
const CartRoute = require('./routes/CartRoutes')
const ContactRoute = require('./routes/ContactRoutes')
const SettingsRoute = require('./routes/SettingsRoutes')
const OrdersRoute = require('./routes/OrdersRoutes')
const PaymentRoute = require('./routes/PaymentsRoutes')
const ChatBotRoute = require('./routes/ChatBotRoutes')
const webhookRoutes = require('./routes/webhookRoutes')


const app = express()
const port = process.env.PORT || 3000;


app.use("/webhook", webhookRoutes);

app.use(bodyParser.json())
app.use(cookieParser());


app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('cartify')
})

app.use('/auth', AuthRoute)
app.use('/product', ProductRoute)
app.use('/users', UsersRoute)
app.use('/cart', CartRoute)
app.use('/contact', ContactRoute)
app.use('/settings', SettingsRoute)
app.use('/orders', OrdersRoute)
app.use('/payments', PaymentRoute)
app.use('/chatBot', ChatBotRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})