import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FotoService } from '../services/foto.service';

export interface fileFoto {
  name : string; //filepath
  path : string; //webviewpath
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  urlImageStorage : string[] = [];

  constructor(private afStorage : AngularFireStorage, public fotoservice : FotoService) { }

  async ngOnInit() {
    await this.fotoservice.loadFoto();
  }

  async ionViewDidEnter(){
    await this.fotoservice.loadFoto();
    this.tampilkanData();
  }

  hapusFoto(){
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.delete().then(() => {
              //menampilkan data
              this.tampilkanData();
          });
        });
      }).catch((error) => {
        console.log(error);
      });
  }

    tampilkanData(){
      this.urlImageStorage = [];
      var refImage = this.afStorage.storage.ref('imgStorage');
      refImage.listAll()
        .then((res) => {
          res.items.forEach((itemRef) => {
            itemRef.getDownloadURL().then(url => {
              this.urlImageStorage.unshift(url)
            })
          });
        }).catch((error) => {
        console.log(error);
      });
    }

  uploadFoto(){
    this.urlImageStorage = [];
    for(var index in this.fotoservice.dataFoto){
      const imgFilePath = `imgStorage/${this.fotoservice.dataFoto[index].filePath}`;

      this.afStorage.upload(imgFilePath, this.fotoservice.dataFoto[index].dataImage).then(() => {
        this.afStorage.storage.ref().child(imgFilePath).getDownloadURL().then((url) => {
          this.urlImageStorage.unshift(url);
          console.log(url);
        });
      });
    }
  }

}
