// Requires
// ------------------------------------
const express = require('express');
const { connect } = require('mongoose');
const router = require('./routes/authRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// INIT, Config, SETUP
// ------------------------------------

// dotenv configs
dotenv.config();

// init app
const app = express();

// cors middleware
app.use(
    cors({
        origin: ['http://localhost:3000', 'mernauthentication.netlify.app'],
        methods: ['GET', 'POST', 'PUT'],
        credentials: true,
        allowedHeaders: ['Content-Type']
    })
);

// url parsing setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// mongodb connection
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@practice.tdza6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('<h1>Welcome to MERN-AUTH!!</h1>');
});

connect(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        // Serve the app
        // ------------------------------------

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, err => {
            if (err) throw err;
            else console.log(`App hosted on PORT: ${PORT}`);
        });
    })
    .catch(err => {
        console.log(`Error connecting to mongodb: ${err.message}`);
    });

// Router middleware
// ------------------------------------

app.use('/', router);
