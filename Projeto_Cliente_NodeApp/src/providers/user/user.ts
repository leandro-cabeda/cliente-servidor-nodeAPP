import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class UserProvider {

  constructor(public api: ApiProvider) {

  }

  login(dados: any) {
    let seq = this.api.post2(dados);
    console.log("Chamou login! " + dados);

    seq.subscribe((res: any) => {
      console.log("Deu certo seq: " + res);

      if (res.status == 200) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });
    console.log("Valor seq: " + seq);
    return seq;
  }


  signup(dados: any) {
    let seq = this.api.post(dados);
    console.log("Chamou signup! "+dados);
    seq.subscribe((res: any) => {
      console.log("Deu certo seq: " + res);
      if (res.status == 200) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });
    console.log("Valor seq: " + seq);

    return seq;
  }

}
