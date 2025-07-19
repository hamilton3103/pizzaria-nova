export class MapsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    this.pizzariaAddress = 'Rua das Pizzas, 123 - Centro, São Paulo - SP';
    this.pizzariaCoords = { lat: -23.5505, lng: -46.6333 }; // Centro de SP
  }

  // Inicializar Google Maps
  async initializeMap(containerId) {
    try {
      if (!window.google) {
        await this.loadGoogleMapsScript();
      }

      const mapOptions = {
        zoom: 15,
        center: this.pizzariaCoords,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getMapStyles()
      };

      const map = new google.maps.Map(document.getElementById(containerId), mapOptions);

      // Adicionar marcador da pizzaria
      const marker = new google.maps.Marker({
        position: this.pizzariaCoords,
        map: map,
        title: 'Pizzaria Bella Vista',
        icon: {
          url: '/pizza-icon.svg',
          scaledSize: new google.maps.Size(40, 40)
        }
      });

      // Adicionar info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3>🍕 Pizzaria Bella Vista</h3>
            <p><strong>Endereço:</strong> ${this.pizzariaAddress}</p>
            <p><strong>Telefone:</strong> (11) 99999-9999</p>
            <p><strong>Horário:</strong> Seg-Dom: 18h às 23h</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return { map, marker, infoWindow };
    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      return null;
    }
  }

  // Carregar script do Google Maps
  async loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      // Se não tiver API key, simular carregamento
      if (!this.apiKey) {
        console.warn('Google Maps API key não configurada, usando simulação');
        window.google = {
          maps: {
            Map: class MockMap {},
            Marker: class MockMarker {},
            InfoWindow: class MockInfoWindow {},
            DistanceMatrixService: class MockDistanceMatrixService {},
            Geocoder: class MockGeocoder {}
          }
        };
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }

  // Calcular distância entre dois pontos
  async calculateDistance(destinationAddress) {
    try {
      if (!window.google) {
        await this.loadGoogleMapsScript();
      }

      const service = new google.maps.DistanceMatrixService();
      
      return new Promise((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [this.pizzariaAddress],
          destinations: [destinationAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === 'OK') {
            const element = response.rows[0].elements[0];
            
            if (element.status === 'OK') {
              resolve({
                success: true,
                distance: element.distance.text,
                duration: element.duration.text,
                distanceValue: element.distance.value, // em metros
                durationValue: element.duration.value  // em segundos
              });
            } else {
              reject({
                success: false,
                error: 'Não foi possível calcular a distância'
              });
            }
          } else {
            reject({
              success: false,
              error: 'Erro no serviço de distância'
            });
          }
        });
      });
    } catch (error) {
      console.error('Erro ao calcular distância:', error);
      return {
        success: false,
        error: 'Erro ao calcular distância'
      };
    }
  }

  // Obter coordenadas de um endereço
  async geocodeAddress(address) {
    try {
      if (!window.google) {
        await this.loadGoogleMapsScript();
      }

      const geocoder = new google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            resolve({
              success: true,
              lat: location.lat(),
              lng: location.lng(),
              formatted_address: results[0].formatted_address
            });
          } else {
            reject({
              success: false,
              error: 'Endereço não encontrado'
            });
          }
        });
      });
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      return {
        success: false,
        error: 'Erro ao processar endereço'
      };
    }
  }

  // Estilos personalizados do mapa
  getMapStyles() {
    return [
      {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{"weight": "2.00"}]
      },
      {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#9c9c9c"}]
      },
      {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [{"visibility": "on"}]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"color": "#f2f2f2"}]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{"saturation": -100}, {"lightness": 45}]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"visibility": "simplified"}]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"color": "#e74c3c"}, {"visibility": "on"}]
      }
    ];
  }

  // Simular cálculo de distância (para desenvolvimento)
  simulateDistanceCalculation(cep) {
    // Simular baseado no CEP
    const distances = {
      '01000': { distance: '2.5 km', duration: '15 min' },
      '04000': { distance: '5.8 km', duration: '25 min' },
      '05000': { distance: '8.2 km', duration: '35 min' },
      '08000': { distance: '12.1 km', duration: '45 min' }
    };

    const prefix = cep.substring(0, 5);
    const result = distances[prefix] || { distance: '10.0 km', duration: '30 min' };

    return Promise.resolve({
      success: true,
      ...result,
      distanceValue: parseFloat(result.distance) * 1000,
      durationValue: parseInt(result.duration) * 60
    });
  }
}