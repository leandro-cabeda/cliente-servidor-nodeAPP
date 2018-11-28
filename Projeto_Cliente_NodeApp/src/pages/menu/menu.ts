import { WelcomePage } from './../welcome/welcome';
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

  public user:Pessoa;
  public users:Pessoa[];
  public flag:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api,
    private alert: AlertController) {

    this.user = this.navParams.get("dados");
    this.flag=false;


  }

  ionViewDidLoad() {
    this.carregarDadosPessoas();
  }

  carregarDadosPessoas()
  {
    this.api.get().subscribe((p: Pessoa[]) => {
      this.users = p;
      this.flag = true;
    },
      (err) => {
        this.alert.create({
          title: err,
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.flag = false;
            }
          }]
        })
          .present();
      });
  }

  novo()
  {
    let flag = false;
    this.navCtrl.push(SignupPage,{flag});
  }

  editar(p:Pessoa) {
    let flag=true;
    this.navCtrl.push(SignupPage,{p,flag});
  }

  excluir(id:number) {
    this.api.delete(id).subscribe(()=>{
      this.alert.create({
        title: "Deletado com sucesso!",
        buttons: [{
          text: "Confirmar",
          handler: () => {
            this.carregarDadosPessoas();
          }
        }]
      })
        .present();
    },
      (err) => {
        this.alert.create({
          title: "Erro!",
          subTitle: err,
          buttons: [{
            text: "Confirmar"
          }]
        })
          .present();
      });
  }

  sair()
  {
    this.user=null;
    this.alert.create({
      title: "Você saiu!",
      buttons: [{
        text: "Confirmar",
        handler: () => {
          this.navCtrl.push(WelcomePage);
        }
      }]
    })
      .present();
  }

}
