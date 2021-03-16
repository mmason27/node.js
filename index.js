const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const { v4: uuidv4 } = require('uuid');

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//this parses form-submitted values
app.use(express.urlencoded());

//this allows you to use css to style your html pages
app.use(express.static('styles'))

let trips = [
    {title: 'Colorado',
    image: 'image',
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
app.get('/trips', (req, res) => {
    res.render('trips', {allTrips: trips, totalTrips: trips.length});
})

//localhost:3000
app.get("/", (req, res) => {
    res.render('index');
})

//this is what starts our server
app.listen(3000, () => {
    console.log("Server is running...");
})