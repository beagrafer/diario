import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LatLng, Map, tileLayer } from 'leaflet';
import { Historia } from 'src/app/interfaces/historia';
import { Marcador } from 'src/app/interfaces/marcadores';
import { AuthService } from 'src/app/services/auth.service';
import { MarcadoresService } from 'src/app/services/marcadores.service';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { getDownloadURL, listAll } from 'firebase/storage';


declare const L: any;

@Component({
  selector: 'app-historia',
  templateUrl: './historia.component.html',
  styleUrls: ['./historia.component.css']
})
export class HistoriaComponent implements OnInit{
  latitude: number;
  longitude: number;
  formulario: FormGroup;
  procesandoFormulario = false;
  mostrarMensajeSubmit = false;
  seHizoSubmit = false;
  hizoClickEnElMapa = true;
  dateValue: Date = new Date(2024, 1, 25);
  minDate: Date = new Date(2022, 4, 10);
  maxDate: Date = new Date(2050, 4, 25);

  public historia?: Historia;

  // Constructor con los servicios de autenticación, marcadores y gestor documental de firebase
  constructor(private authService: AuthService, private _marcadoresService: MarcadoresService, private storage: Storage) {
    this.latitude = 40;
    this.longitude = -3;
    // Inicializo el formulario con sus campos y sus requisitos de validación
    this.formulario = new FormGroup({
      latitudForm: new FormControl('', Validators.required),
      longitudForm: new FormControl('', Validators.required),
      historiaForm: new FormControl('', Validators.required),
      fechaForm: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      imagen: new FormControl(),
      imagenPath: new FormControl(),
      idUsuario: new FormControl(),
      tituloForm: new FormControl('', Validators.required),
      notaPlayaForm: new FormControl('', Validators.required)
    })    
  }

  ngOnInit(): void {
    const map = new Map('map');
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      const latLong = [coords.latitude, coords.longitude];
      map.setView([coords.latitude, coords.longitude], 13);
      // Establecemos el mapa base y geoposicionamos al usuario
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      let marker = L.marker(latLong).addTo(map);
      marker.bindPopup('<b>Estás aquí</b>').openPopup();          
    });

    this._marcadoresService.getMarcadores(this.authService.id).subscribe(marcador => {          
      marcador.forEach(element => {
        if (this.authService.isLogedIn){   
          const latLong = [element.latitudForm, element.longitudForm];
          let marker = L.marker(latLong).addTo(map);
          
          marker.bindPopup('<b>Visita el '+element.fechaForm+'</b><br>'+element.tituloForm+' <img src="'+element.imagenPath+'" />');
        } 
      });
      
      map.on('click', (e:{
        latlng: LatLng
      }) => {
        // Seteo al formulario en los campos ocultos la latitud, la longitud y el id del usuario, para guardarlo cuando vayamos a hacer submit
        this.formulario.get('idUsuario')?.setValue(this.authService.id);
        this.formulario.get('latitudForm')?.setValue(e.latlng.lat);
        this.formulario.get('longitudForm')?.setValue(e.latlng.lng);      
        L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString);
      })
   });
  }

  async onSubmit() {
    // Control de errores, por defecto todo OK
    this.procesandoFormulario = true;
    this.mostrarMensajeSubmit = false;
    if (this.formulario.valid){
      setTimeout(() => {
        // Si todo es válido añado el marcador con un tiempo de espera de X segundos para que se vean las máscaras de boostrap y cambios en los
        // botones
        this._marcadoresService.addMarcador(this.formulario.value);
        this.procesandoFormulario = false;
        this.mostrarMensajeSubmit = true;
        this.hizoClickEnElMapa = true;
        this.seHizoSubmit = true
      }, 2000);
    } else {
      // Si no es válido entonces...
      this.procesandoFormulario = true;
      setTimeout(() => {
        // Miro si no es válido porque no se hizo click en el mapa para eso tengo un campo oculto
        if (this.formulario.get('latitudForm')?.value==""){
          this.hizoClickEnElMapa = false;
        } else {
          // Si, si que hizo click entonces es que hay errores de validación
          this.mostrarMensajeSubmit = false;
          this.hizoClickEnElMapa = true;
        }
        this.procesandoFormulario = false;
        this.seHizoSubmit = true
      }, 2000);
    }
  }

  uploadImage($event: any){
    // Hay un evento en el HTML que se dispara cuando agrego una foto
    const file = $event.target.files[0];
    // Aquí llamo a firebase a su plataforma del gestor documental STORAGE y le digo que me agrege el fichero en la ruta compuesta por
    // id usuario / nombre del fichero
    const imgRef = ref(this.storage, `${this.authService.id}/${file.name}`);
    // Subo el fichero
    uploadBytes(imgRef, file).then(response => {    
      this.getImages();
    }).catch(error => console.log(error)); 
    

  }

  // Recupera las imagenes del gstor documental
  getImages(){
    const imagesRef = ref(this.storage, this.authService.id
      );
    listAll(imagesRef).then(async response => {
      for (let imagen of response.items){
        // Recupero todas las imagenes y por cada una de ellas dame su URL
        const url = await getDownloadURL(imagen);
        // Quiero sacar el nombre de la foto que será único en FIRESTORAGE
        var nombreFotoAdjunta = this.formulario.get('imagen')?.value.split("\\");
        if (nombreFotoAdjunta[2] == imagen.name){
          // De todas las url de fotos del storage de google
          // quiero quedarme con la que acabo de meter porque es la que voy a asociar al marcador
          this.formulario.get('imagenPath')?.setValue(url);
        }
      }
  })
  }
}
