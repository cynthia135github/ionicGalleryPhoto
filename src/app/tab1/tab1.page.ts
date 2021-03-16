import { Component } from '@angular/core';
import { FotoService } from '../services/foto.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
}) 
export class Tab1Page {

  constructor(public fotoservice: FotoService) {}

  async ngOnInit(){
    await this.fotoservice.loadFoto();
  } 

  TambahFoto(){
    this.fotoservice.tambahFoto();
  }
}
