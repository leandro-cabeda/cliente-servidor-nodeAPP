import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class UserProvider {

  constructor(public api: ApiProvider) {

  }

  login(dados: any) {
    let seq = this.api.post2(dados);

    seq.subscribe((res: any) => {

      if (res.status == 200) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  signup(dados: any) {
    let seq = this.api.post(dados);

    seq.subscribe((res: any) => {

      if (res.status == 200) {
        console.log("Deu certo!");
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

}
