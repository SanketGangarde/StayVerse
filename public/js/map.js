


  mapboxgl.accessToken = window.mapToken;

  if (
    !window.listing ||
    !window.listing.geometry ||
    !Array.isArray(window.listing.geometry.coordinates) ||
    window.listing.geometry.coordinates.length !== 2
  ) {
    console.error("Invalid or missing coordinates:", window.listing);
  } else {
    const coordinates = window.listing.geometry.coordinates;

    // mapboxgl.setTelemetryEnabled(false);

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 12
    });

    // Create custom marker element using Material Symbol
    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.textContent = 'home_pin';

    new mapboxgl.Marker({ element: markerEl })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <h6>${window.listing.title}</h6>
            <p>Exact location provided for you!</p>
          `)
      )
      .addTo(map);

    map.on('load', () => {
      map.addSource('circle-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: coordinates
          }
        }
      });

      map.addLayer({
        id: 'circle-layer',
        type: 'circle',
        source: 'circle-source',
        paint: {
          'circle-radius': 0,
          'circle-color': '#FF385C',
          'circle-opacity': 0.2
        }
      });
 mapboxgl.setTelemetryEnabled(false);
      // Animation: Only growing circle that loops
      const minRadius = 0;
      const maxRadius = 30;
      const pulseDuration = 2000;

      const animateGrowingCircle = () => {
        const startTime = performance.now();

        const frame = (currentTime) => {
          const elapsed = currentTime - startTime;
          const t = Math.min(elapsed / pulseDuration, 1); // t from 0 to 1

          const currentRadius = minRadius + t * (maxRadius - minRadius);
          const currentOpacity = 0.15 + t * 0.1;

          map.setPaintProperty('circle-layer', 'circle-radius', currentRadius);
          map.setPaintProperty('circle-layer', 'circle-opacity', currentOpacity);

          if (t < 1) {
            requestAnimationFrame(frame);
          } else {
            // Restart the animation
            map.setPaintProperty('circle-layer', 'circle-radius', 0);
            map.setPaintProperty('circle-layer', 'circle-opacity', 0.15);
            requestAnimationFrame(animateGrowingCircle);
          }
        };

        requestAnimationFrame(frame);
      };

      animateGrowingCircle();
    });

    // console.log("Map loaded at:", coordinates);
  }

