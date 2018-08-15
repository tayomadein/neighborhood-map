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
    this.applyOnReady = function () { // Init Nav
        $('.sidenav').sidenav();
    }
    this.applyOnReady();

    this.searchInput = ko.observable('');
    this.marker;
    this.markers = []
    this.initMap = function () { // Initialize and add the map  
        let center = { lat: 6.553818, lng: 3.366543 };
        this.searchInput(''); //reset search input
        map = new google.maps.Map(
            document.getElementById('map'), { zoom: 15, center: center });

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
                let query;
                getFullAddress(position).then((res) => {
                    console.log(res);
                    query = `${res.results[0].formatted_address} ${mapLocation.title}`
                    console.log(query);
                    M.toast({ html: `Visit ${mapLocation.title} at ${res.results[0].formatted_address}.`, displayLength: 4000 });
                    getNYTArticles(query);
                });
                map.setZoom(20);
                map.setCenter(this.getPosition());
                setTimeout((function () {
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
        let query = `${this.title}`;
        console.log(query);
        getNYTArticles(query);
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

    //
    const getNYTArticles = function (query) {
        $('#nytimes-articles').text('Articles about your restaurant will appear here!')
        // NYTimes Ajax request
        let nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        nytURL += '?' + $.param({
            'api-key': "55de6ea34c834386aa8f72d8297c0cc8",
            'q': query,
            'sort': "newest",
        });
        $.getJSON(nytURL, (res) => {
            let { response } = res;
            let items = [];
            console.log(response.docs)
            $.each(response.docs, (key, val) => {
                let imgSrc = 'https://images.unsplash.com/photo-1494346480775-936a9f0d0877?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=83ddd8a82b2ae0f63d3916bb79d87df5&auto=format&fit=crop&w=703&q=80';

                if (val.multimedia) {
                    val.multimedia.find(function (media) {
                        console.log(media)
                        if(media.subtype == 'thumbnail') {
                            console.log(media.url)
                            imgSrc =  `https://www.nytimes.com/${media.url}`;}
                    })
                } 
                console.log(imgSrc);
                items.push(
                    `<a class = "collection-item avatar" id=' ${key} ' href=${val.web_url}>
                        <span class='title'> ${val.headline.main} </span>
                        <img class="circle" src=${imgSrc}>
                    </a>`);
            });

            $(items.join('')).appendTo($('#nytimes-articles'));
        }).fail(() => {
            $('#nytimes-header').text(`New York Times articles could not be loaded`);
            console.log("error");
        });
    }

}

