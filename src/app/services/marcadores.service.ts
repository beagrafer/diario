import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { addDoc, and, collection, query, where} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Marcador } from '../interfaces/marcadores';



@Injectable({
  providedIn: 'root'
})
export class MarcadoresService {

  constructor(private firestore: Firestore) { }

  addMarcador(marcador: Marcador){
    // Método para añadir marcador a una colección "marcador" en firestore
    const marcadorRef = collection(this.firestore, 'marcador');
    return addDoc(marcadorRef, marcador);
  }

  getMarcadores(idUsuario?: string): Observable<Marcador[]> {
    const marcadorRef = collection(this.firestore, 'marcador');
    // Recupera todos los marcadores para el id de usuario dado por parámetro
    const q = query(marcadorRef, where("idUsuario", "==", idUsuario));
    return collectionData(q, { idField: 'id' }) as Observable<Marcador[]>;
  }

  getMarcadoresPorFecha(idUsuario?: string, fechaInicioForm?: string, fechaFinForm?: string): Observable<Marcador[]> {
    // Método para recuperar todos los marcadores en un rango de fechas para un id de usuario dado
    const marcadorRef = collection(this.firestore, 'marcador');
    // Parámetros que se adjunta a la consulta en firestore. 
    // Como particularidad no hay cláusula AND. En firestore se añaden 'n' instrucciones where.
    const q = query(marcadorRef, where("idUsuario", "==", idUsuario), where ("fechaForm",">=", fechaInicioForm), where ("fechaForm","<=",fechaFinForm));
    return collectionData(q, { idField: 'id' }) as Observable<Marcador[]>;
  }
}
