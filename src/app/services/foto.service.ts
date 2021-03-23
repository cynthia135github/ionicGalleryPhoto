import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';


//Untuk kamera perlu ini, utk Pluginnya pilih yg capacitor
const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  //Variabel supaya bs dimanfaatkan utk ambil data foto
  public dataFoto: Photo[] = [];

  //Variabel utk yg bs read foto dr yg disimpan di filesytem dlm bntuk base64
  private keyFoto : string = "foto";

  //Tambah variabel utk platform
  private platform : Platform 

  //Tambah variabel utk Platform biar bs jalan di android, ios
  constructor(platform : Platform) {
    this.platform = platform;
   }


  public async tambahFoto(){
    //bisa panggil mau versi web atau android atau iOS
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100
    });
    console.log(Foto);

    //MASIH ERROR : KELUARNYA KEMBAR
    //Untuk simpan supaya ketika refresh tdk hilang fotonya
    /*const FilePoto = await this.simpanFoto(Foto);
    this.dataFoto.unshift(FilePoto);*/

    const fileFoto = await this.simpanFoto(Foto);

    //Memasukkan tiap foto ke dataFoto (unshift itu kyk push cmn dia nambahinnya di bagian paling dpn trs bkn di akhir array)
    this.dataFoto.unshift(fileFoto);

    //supaya tersimpan di filesystemnya tadi
    Storage.set({
      key : this.keyFoto,
      value : JSON.stringify(this.dataFoto)
    })
  }

  //utk simpan foto  ke systemnya dan yg disimpan base 64
  public async simpanFoto(foto : CameraPhoto){
    const base64Data = await this.readAsBase64(foto);

    const namaFile = new Date().getTime()+'.jpeg';
    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob], foto.path, {
      type : "image/jpeg"
    })

    if (this.platform.is('hybrid')) {
      return {
        filePath : simpanFile.uri,
        webviewPath : Capacitor.convertFileSrc(simpanFile.uri),
        dataImage : dataFoto
      }
    } else {
      return{
        filePath : namaFile,
        webviewPath : foto.webPath,
        dataImage : dataFoto
      }
    }
  }

  //saat read
  private async readAsBase64(foto : CameraPhoto){
    //Tambahkan if utk klo dia hybrid atau dia jalan di web
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path : foto.path
      });
      return file.data;
    } else {
      const response = await fetch(foto.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
    }
  }

  //utk convert Blob to Base64
  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadFoto(){
    const listFoto = await Storage.get({key : this.keyFoto});
    this.dataFoto = JSON.parse(listFoto.value) || [];

    if(!this.platform.is('hybrid')){
      for(let foto of this.dataFoto){
        const readFile = await Filesystem.readFile({
          path: foto.filePath,
          directory : FilesystemDirectory.Data
        });
        foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;

        const response = await fetch(foto.webviewPath);
        const blob = await response.blob();

        foto.dataImage = new File([blob], foto.filePath,{
          type : "image/jpeg"
        });
      }
    }
    
    console.log(this.dataFoto);
  }
}

//Tambah ini utk bs ambil dan menampilkan foto" yg kita capture
//(letaknya export bole di atas @Injectable, atau di tempat terpisah)
export interface Photo{
  filePath: string; // filenamenya
  webviewPath: string; // alamat foldernya utk menyimpannya
  dataImage : File //utk membuat file image nya
}
