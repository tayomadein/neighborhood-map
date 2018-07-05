/* Init Nav */
$(document).ready(function () {
    $('.sidenav').sidenav();
});

/* Map */
var map;
// Initialize and add the map
function initMap() {
    var andela = { lat: 6.553818, lng: 3.366543 };
    map = new google.maps.Map(
        document.getElementById('map'), { zoom: 15, center: andela });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({ position: andela, map: map });
}

function mapError() {
    alert('An error occurred while loading the maps');
}