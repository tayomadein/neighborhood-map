/* Init Nav */
$(document).ready(function () {
    $('.sidenav').sidenav();
});

/* Start the App */
function initApp() {
    ko.applyBindings(new appBuilder());
}

/* Map */
var map, marker;

function mapError() {
    alert('An error occurred while loading the maps');
}

function appBuilder() {
    // var self = this;

    this.searchInput = ko.observable('');
    this.markers = []
    this.initMap = function () { // Initialize and add the map  
        var center = { lat: 6.553818, lng: 3.366543 };
        map = new google.maps.Map(
            document.getElementById('map'), { zoom: 15, center: center });
        // The marker, positioned at center
        marker = new google.maps.Marker({ position: center, map: map });

        for (var i = 0; i < mapLocations.length; i++) {
            var mapLocation = mapLocations[i];
            marker = new google.maps.Marker({
                map: map,
                position: mapLocation.location,
                title: mapLocation.title,
                id: i,
                animation: google.maps.Animation.DROP,
            });
            this.markers.push(marker);
        }
    };
    this.initMap();

    this.showLocations = ko.computed(function () {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var mapLocation = this.markers[i];
            if (mapLocation.title.toLowerCase().includes(this.searchInput().toLowerCase())) {
                result.push(mapLocation);
                mapLocation.setVisible(true);
            } else {
                mapLocation.setVisible(false);
            }
        }
        return result;
    }, this);

    this.showDetails = function(){
        this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        this.setAnimation(google.maps.Animation.BOUNCE);
        M.toast({html: `This is ${this.title}. It is located at ${this.position}`, displayLength: 2000})
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 2000);
    }

}