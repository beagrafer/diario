import { Component, OnInit } from '@angular/core';
import { LatLng, Map, circleMarker, marker, tileLayer } from 'leaflet';
import { Marcador } from 'src/app/interfaces/marcadores';
import { AuthService } from 'src/app/services/auth.service';
import { MarcadoresService } from 'src/app/services/marcadores.service';
import 'leaflet-routing-machine';

declare const L: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit{
  //Latitud y longitud
  latitude: number;
  longitude: number;

  constructor(private authService: AuthService, private _marcadoresService: MarcadoresService) {
    // seteo una latitud y longitud por defecto
    this.latitude = 40;
    this.longitude = -3;    
  }

  ngOnInit(): void {
    
  //Creo la variable mapa
  const map = new Map('map');
  
  //Geoposicionamiento del usuario
  navigator.geolocation.getCurrentPosition((position) => {
    //Recupero las coordenadas del usuario
    const coords = position.coords;
    //Recupero la latitud y longitud de las coordenadas del usuario para poder representarlo en el mapa
    const latLong = [coords.latitude, coords.longitude];
    
    //Al mapa le posiciono esa latitud  longitud y además un nivel de zoom
    map.setView([coords.latitude, coords.longitude], 13);
    
    //Establezco el mapa base
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Establezco el marcador de posición y además le pongo un popup abierto por defecto "estás aquí"
    let marker = L.marker(latLong).addTo(map);
      marker.bindPopup('<b>Estás aquí</b>').openPopup();          
    });
    
    //Llamo al servicio para obtener marcadores por id
    this._marcadoresService.getMarcadores(this.authService.id).subscribe(marcador => {          
      marcador.forEach(element => {
        if (this.authService.isLogedIn){   
          const latLong = [element.latitudForm, element.longitudForm];
          let marker = L.marker(latLong).addTo(map);
          marker.bindPopup('<b>Visita el '+element.fechaForm+'</b><br>'+element.tituloForm+' <img src="'+element.imagenPath+'" />');
        }  
      });

      // Cuando hago click en el mapa, lo primero que hace es guardar la latitud y la longitud
      map.on('click', (e:{
        latlng: LatLng
      }) => {              
        // Añado al mapa el marcador sobre el que hice click
        L.marker(e.latlng).addTo(map).bindPopup(e.latlng.lat+','+e.latlng.lng);

        // Navego desde la posición en la que estoy
        navigator.geolocation.getCurrentPosition((position) => {
          
          const coords = position.coords;
          const latLong = [coords.latitude, coords.longitude];
          // Este es el punto de inicio de la navegación que se corresponde con la posición del usuario
          const startPoint = latLong;
          const fin = e.latlng;
   
          // Implemento el método de la libreria leaflet para la navegación
          const route = L.Routing.control({
            waypoints: [L.latLng(startPoint), L.latLng(fin)], language: 'es'
          }); 
          route.addTo(map);
        });

        
      })

   });

    // CAPA OSM
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(map);

    // CAPA GOOGLE STREETMAP
   var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // CAPA SATELITAL DE GOOGLE
    var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    var baseMaps = {
      "OSM": osm,
      'Google Street': googleStreets,
      "Google Satellite": googleSat,
    };
    L.control.layers(baseMaps).addTo(map);
  }
}
