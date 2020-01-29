import axios from 'axios';

function loadPlaces(map) {
  axios.get(`/api/buildings`)
    .then(res => {
      const places = res.data;
      if (!places.length) {
        alert('no places found!');
        return;
      }
      // create a bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position);
        const marker = new google.maps.Marker({ map, position });
        marker.place = place;
        return marker;
      });

      // when someone clicks on a marker, show the details of that place
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
          <div class="card" style="width:300px">
            <div class="card-body">
              <img class="card-img-top" src="/uploads/${this.place.photo || 'building.jpg'}" alt="${this.place.name}" />
              <h3 class="card-title">
              <a href="/buildings/${this.place.slug}">        
                <p>${this.place.location.address}</p>
              </a>
              </h3>
            </div>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // then zoom the map to fit all the markers perfectly
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });

}

function makeMap(mapDiv) {
  if (!mapDiv) return;
  // make our map
  const map = new google.maps.Map(mapDiv);
  loadPlaces(map);
}

export default makeMap;
