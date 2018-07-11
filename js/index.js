/* Init Nav */
$(document).ready(function () {
    $('.sidenav').sidenav();
});

/* Map */
var map, marker;
// Initialize and add the map
function initMap() {
    var andela = { lat: 6.553818, lng: 3.366543 };
    map = new google.maps.Map(
        document.getElementById('map'), { zoom: 15, center: andela });
    // The marker, positioned at Andela
    marker = new google.maps.Marker({ position: andela, map: map });
    showLocations(mapLocations);
}

function mapError() {
    alert('An error occurred while loading the maps');
}

//var lunchLocations = ko.applyBindings({ mapLocations })
//console.log(lunchLocations);

function showLocations(mapLocations  ) {
    for (var i = 0; i < mapLocations.length; i++) {
        marker = new google.maps.Marker({ position: mapLocations[i].location, map });
    }
}
