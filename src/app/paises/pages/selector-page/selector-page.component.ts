import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', [Validators.required]],
    pais    : ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  //Llenar selectores
  regiones : string[] = [];
  paises   : Pais[] = [];
  // fronteras: string[] = [];
  fronteras: Pais[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //Cambia selector region
    // this.miFormulario.get('region')?.valueChanges.subscribe(
    //   region => { 
    //     console.log(region);

    //     this.paisesService.getPaisesPorRegion(region)
    //     .subscribe(paises => { this.paises = paises; console.log(paises); });
    //   }
    // );

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
     .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorAlphaCode(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais[0]?.borders))
     )
     .subscribe(paises => {
        this.fronteras = paises;
        this.cargando = false;
     });
  }

  guardar() {

  }

}
