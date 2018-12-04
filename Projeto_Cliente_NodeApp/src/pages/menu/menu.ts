import { EntrarPage } from './../entrar/entrar';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Pessoa } from '../../models/Pessoa';
import { ApiProvider } from '../../providers/api/api';
import { HomePage } from '../home/home';
import { CadastrarPage } from '../cadastrar/cadastrar';
import { HttpErrorResponse } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public users: Pessoa[];
  public flag: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private alert: AlertController) {
    this.flag=false;
  }

  ionViewDidLoad() {
    this.carregarDadosPessoas();
  }

  ionViewDidEnter() {

  }

  carregarDadosPessoas() {
    this.api.get().subscribe(p => {

      this.users = p;
      this.flag = true;
    },
      (err: HttpErrorResponse) => {
        this.alert.create({
          title: "Erro carregar pessoas!",
          subTitle: err.error,
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

  novo() {

    this.navCtrl.push(CadastrarPage);
  }

  editar(p: Pessoa) {
    let flag2 = true;
    this.navCtrl.push(CadastrarPage, { p, flag2});
  }

  excluir(id: number) {
    this.api.delete(id).subscribe(() => {
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
      (err: HttpErrorResponse) => {
        this.alert.create({
          title: "Erro!",
          subTitle: err.error,
          buttons: [{
            text: "Confirmar",
            handler: () => {
              this.navCtrl.push(EntrarPage);
            }
          }]
        })
          .present();
      });
  }

  sair() {

    this.alert.create({
      title: "Você saiu!",
      buttons: [{
        text: "Confirmar",
        handler: () => {
          this.navCtrl.push(HomePage);
        }
      }]
    })
      .present();
  }

}
