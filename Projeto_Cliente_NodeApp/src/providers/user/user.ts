import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class UserProvider {

  constructor(public api: ApiProvider) {

  }

  login(dados: Pessoa) {
    let seq = this.api.post2(dados);
    console.log("Chamou login! " + dados);

    seq.subscribe(res => {
      console.log("Deu certo seq: " + res);

      if (res!=null) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });
    console.log("Valor seq: " + seq);
    return seq;
  }


  signup(dados: Pessoa) {
    let seq = this.api.post(dados);
    console.log("Chamou signup! "+dados);
    seq.subscribe(res => {
      console.log("Deu certo seq: " + res);
      if (res!=null) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });
    console.log("Valor seq: " + seq);

    return seq;
  }

}
