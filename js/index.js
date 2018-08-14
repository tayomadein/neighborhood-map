/* Init Nav */
$(document).ready(function () {
    $('.sidenav').sidenav();
});

/* Start the App */
function initApp() {
    ko.applyBindings(new appBuilder());
}

/* Map */
let map;

function mapError() {
    alert('An error occurred while loading the maps');
}

function appBuilder() {
    // let self = this;

    this.searchInput = ko.observable('');
    this.marker;
    this.markers = []
    this.initMap = function () { // Initialize and add the map  
        let center = { lat: 6.553818, lng: 3.366543 };
        this.searchInput(''); //reset search input
        map = new google.maps.Map(
            document.getElementById('map'), { zoom: 15, center: center });
        // The marker, positioned at center
        this.marker = new google.maps.Marker({ position: center, map: map });

        for (let i = 0; i < mapLocations.length; i++) {
            let mapLocation = mapLocations[i];
            this.marker = new google.maps.Marker({
                map: map,
                position: mapLocation.location,
                title: mapLocation.title,
                id: i,
                animation: google.maps.Animation.DROP,
            });
            this.markers.push(this.marker);
            this.marker.addListener('click', function () { //When a marker is clicked
                this.setAnimation(google.maps.Animation.BOUNCE);
                let position = `${mapLocation.location.lat},${mapLocation.location.lng}`;

                getFullAddress(position).then((res) => {
                    M.toast({ html: `Visit ${mapLocation.title} at ${res.results[0].formatted_address}.`, displayLength: 4000 });
                })
                map.setZoom(20);
                map.setCenter(this.getPosition());
                setTimeout((function() {
                    this.setAnimation(null);
                    map.setZoom(15);
                    map.setCenter(center);
                }).bind(this), 4000);
            });
        }
    };
    this.initMap();

    this.showLocations = ko.computed(function () { //to filter locations by typing
        let result = [];
        for (let i = 0; i < this.markers.length; i++) {
            let mapLocation = this.markers[i];
            if (mapLocation.title.toLowerCase().includes(this.searchInput().toLowerCase())) {
                result.push(mapLocation);
                mapLocation.setVisible(true);
            } else {
                mapLocation.setVisible(false);
            }
        }
        return result;
    }, this);

    this.showDetails = function () { // show location details
        this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
        this.setAnimation(google.maps.Animation.BOUNCE);
        M.toast({ html: `This is ${this.title}. Click on its marker to get full address.`, displayLength: 4000 });
        setTimeout((function () {
            this.setAnimation(null);
        }).bind(this), 2000);
    }

    //Get full address from Geocode API
    const getFullAddress = function (position) {
        let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position}&key=AIzaSyDdSSNDMdIuMpB_KZn8c_Pb9eL4WyXZMyQ`
        return Promise.resolve($.getJSON(geocodeURL).done((res) => {
        }).fail(() => {
            alert('An error occurred while retrieving the full address');
        }))
    }

}

