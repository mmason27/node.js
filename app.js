const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const authenticate = require('./authentication/auth');
const http = require('http').Server(app);
const io = require('socket.io')(http);


function helloMiddleware(req, res, next) {
    console.log("Hello Middleware");
    next();
}
//initalizes the session
app.use(session({
    secret: 'SECRETKEY',
    saveUninitialized: true
}))

app.use('/js', express.static('js'))
//this parses form-submitted values
app.use(express.urlencoded());
//this allows you to use css to style your html pages
app.use(express.static('styles'))
//registering the middleware so the request will have to pass through it
app.use(helloMiddleware);

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

let users = [
    {username: 'megmason', password: 'password'}
]

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
})

//connection event is fired when a user loads the page
io.on('connection', (socket) => {
    console.log('User connected!');

    socket.on('disconnect', () => {
        console.log("User disconnected!");
    })

    socket.on('Houston', (chat) => {
        io.emit('Houston', chat)
    })
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const persistedUser = users.find((user) => {
        return user.username == username && user.password == password
    })

    if (persistedUser) {
        if(req.session) {
            req.session.username = username;
        }
        res.redirect('/trips');
    } else {
        res.render('login', {message: "Username or password is incorrect"})
    }
    console.log(username);
    console.log(password)
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(req.session) {
        req.session.username = username;
        req.session.password = password;
        //didn't Azam say not to include passwords in the session? Bc essentially you would be storing it in a cookie
        console.log(username);
        console.log(password)
    }
    res.redirect("trips")
})

let trips = [
    {title: 'Colorado',
    image: 'placeholder',
    departureDate: 'summer 1',
    returnDate: 'summer 2',
    tripId: uuidv4()}
]

app.post('/add-trip', (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const departureDate = req.body.departureDate;
    const returnDate = req.body.returnDate;

    let trip = {title: title, image: image, departureDate: departureDate, returnDate: returnDate};
    trips.push(trip);

    res.redirect("/trips");
})

app.post('/delete-trip', (req, res) => {
    const tripId = req.body.tripId;

    trips = trips.filter((trip) => {
        return trip.tripId != tripId;
    })
    //this takes us back to our trips page which already has all of our trips rendered on the page
    res.redirect("/trips")
})

app.get('/add-trip', (req, res) => {
    res.render('add-trip');
})

//localhost:3000/trips
app.get('/trips', authenticate, (req, res) => {
    res.render('trips', {allTrips: trips, totalTrips: trips.length});
})

//localhost:3000
app.get("/", (req, res) => {
    res.render('index');
})

//this is what starts our server
http.listen(3000, () => {
    console.log("Server is running...");
})