import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisCompleto } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion( region: string): Observable<Pais[]> {

    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<Pais[]>(url);

  }

  getPaisPorAlphaCode(codigo: string): Observable<PaisCompleto[]> {
    
    if (!codigo) {
      return of([]);
    }

    const url: string = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisCompleto[]>(url);

  }

  getPaisPorAlphaCodeSmall(codigo: string): Observable<Pais> {

    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<Pais>(url);

  }

  getPaisesPorCodigos(borders: string[]): Observable<Pais[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<Pais>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorAlphaCodeSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }

}
