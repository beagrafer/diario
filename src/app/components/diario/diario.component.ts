import { Component, OnInit } from '@angular/core';
import { Marcador } from 'src/app/interfaces/marcadores';
import { AuthService } from 'src/app/services/auth.service';
import { MarcadoresService } from 'src/app/services/marcadores.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css']
})
export class DiarioComponent implements OnInit{

  marcadores?: Marcador[];
  formulario: FormGroup;
  hayErrores = false;
  seHizoSubmit = false;

  constructor(private authService: AuthService, private _marcadoresService: MarcadoresService){
    this.formulario = new FormGroup({
      fechaInicioForm: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      fechaFinForm: new FormControl('', [Validators.required, Validators.maxLength(10)])
    })
  }

  ngOnInit(): void {

  }

  async onSubmit() {
    // Miro las validaciones
    this.seHizoSubmit = true;
    if (this.formulario.valid){
      // Si todo está OK listame los marcadores
      setTimeout(() => {
        this._marcadoresService.getMarcadoresPorFecha(this.authService.id, this.formulario.get('fechaInicioForm')?.value, this.formulario.get('fechaFinForm')?.value).subscribe(marcador => {
          this.marcadores = marcador;     
          this.hayErrores = false;  
       });
      }, 1000);
    } else {
      this.hayErrores = true;
    }
  }
}


