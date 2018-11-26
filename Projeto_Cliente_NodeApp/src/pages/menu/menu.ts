import { SignupPage } from './../signup/signup';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { Api } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  private user:Pessoa;
  private users:Pessoa[];
  private flag:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private api:Api,
    private alert: AlertController) {

    this.user = this.navParams.get("dados");
    this.flag=false;

  }

  ionViewDidLoad() {
    this.api.get().subscribe((p:Pessoa[])=>{
      this.users=p;
      this.flag=true;
    },
    (err)=>{
      this.alert.create({
        title: "Erro!",
        subTitle:err,
        buttons: [{
          text: "Confirmar",
          handler: () => {
            this.flag=false;
          }
        }]
      })
        .present();
    });
  }

  novo()
  {
    this.navCtrl.push(SignupPage);
  }

}
