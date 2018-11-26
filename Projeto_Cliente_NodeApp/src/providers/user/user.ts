import 'rxjs/add/operator/toPromise';

import { Api } from '../api/api';
import { Injectable } from '@angular/core';

@Injectable()
export class User {
  user: any;

  constructor(public api: Api) { }

  login(dados: any) {
    let seq = this.api.post2(dados).share();

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
    let seq = this.api.post(dados).share();

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
