var btnNext = document.querySelector('.next');
var btnBack = document.querySelector('.back');
var btnPost = document.querySelector('.post');

var journeyStart = document.querySelector('.journeystart');
var details = document.querySelector('.details');
var schedule = document.querySelector('.schedule');

var inputStart = document.querySelector('#start');
var inputEnd = document.querySelector('#end');
var mapdata = document.querySelector('#map');

var footer = document.querySelector('.footer');

let currentBlock = 0;
const blocks = [journeyStart, details, schedule]; 

function showBlock(blockIndex) {
    if (blockIndex < 0 || blockIndex >= blocks.length) {
        console.log("Invalid block index");
        return;
    }
    // Hide all blocks
    blocks.forEach(block => block.style.display = 'none');
    // Show the selected block
    blocks[blockIndex].style.display = 'block';
    currentBlock = blockIndex;

    if(currentBlock === 0) {
        footer.style.justifyContent = 'end';
    }
    // Show or hide the back button
    if (currentBlock >= 1) {
        btnBack.style.display = 'block';
        footer.style.justifyContent = 'space-between';
    } else {
        btnBack.style.display = 'none';
    }

    if (currentBlock === blocks.length - 1) {
        btnNext.style.display = 'none';
        btnPost.style.display = 'block';
    } else {
        btnNext.style.display = 'block';
        btnPost.style.display = 'none';
    }
}

btnNext.addEventListener("click", function() {
    showBlock(currentBlock + 1);
    console.log(currentBlock);
});

btnBack.addEventListener("click", function() {
    showBlock(currentBlock - 1);
    console.log(currentBlock);
});

// Hide the back and post buttons initially
btnBack.style.display = 'none';
btnPost.style.display = 'none';


//Map


// default map layer
let map = L.map('map', {
    layers: MQ.mapLayer(),
    center: [52.6293, 1.2979],
    zoom: 12,

});


function runDirection(start, end) {

    // recreating new map layer after removal
    map = L.map('map', {
        layers: MQ.mapLayer(),
        center: [0, 0],
        zoom: 3
    });

    var dir = MQ.routing.directions();

    dir.route({
        locations: [
            start,
            end
        ]
    });

    CustomRouteLayer = MQ.Routing.RouteLayer.extend({
        createStartMarker: (location) => {
            var markerFrom = L.marker(location.latLng).addTo(map);
            var from = markerFrom.getLatLng();
            console.log("Starting city : " + start);
            console.log("Lat from : " + from.lat);
            console.log("Lng from : " + from.lng);
            return markerFrom;
        },

        createEndMarker: (location) => {
            var markerTo = L.marker(location.latLng).addTo(map);
            var to = markerTo.getLatLng();
            console.log("Destination city : " + end);
            console.log("Lat to : " + to.lat);
            console.log("Lng to : " + to.lng);
            return markerTo;
        },

    });

    map.addLayer(new CustomRouteLayer({
        directions: dir,
        fitBounds: true
    }));
}



// function that runs when form submitted
function submitForm(event) {
    event.preventDefault();

    // delete current map layer
    map.remove();

    // getting form data
    start = document.getElementById("start").value;
    end = document.getElementById("destination").value;

    // run directions function
    runDirection(start, end);

    // reset form permet de supprimer la route d'avant
    document.getElementById("form").reset();
}

// asign the form to form variable
const form = document.getElementById('form');

// call the submitForm() function when submitting the form
form.addEventListener('submit', submitForm);
