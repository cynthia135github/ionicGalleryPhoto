import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  myRandomNum : number;
  txtAngka : number;
  munculProfile = false;

  constructor() {
   
  }

  ngOnInit(){
    this.generateRandom();
    alert("hidden number: "+this.myRandomNum.toString());
  }

  generateRandom(){
    this.myRandomNum = Math.floor(Math.random() * 10) + 1;
  }

  tebakAngka(){
    if(this.myRandomNum == this.txtAngka){
      alert('You Win');
      this.munculProfile = true; 
      this.txtAngka = 0;
    }
    else{
      alert('Please Try Again');
    }
  }
}
