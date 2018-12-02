import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class ApiProvider {

  public url: string = 'http://localhost:8080/api';

  constructor(public http: HttpClient) {

  }

  databaseSqlite() {

    return this.http.get(this.url + '/banco');

  }

  public get() {

    return this.http.get<Pessoa[]>(this.url + '/listatodos');
  }

  public getId(id:number) {

    return this.http.get<Pessoa>(this.url + '/pegarID/'+id);
  }

  public post(dados:Pessoa) {

    return this.http.post<Pessoa>(this.url + "/cadastrar/",dados);
  }

  public post2(dados:Pessoa) {

    return this.http.post<Pessoa>(this.url + "/entrar/",dados);
  }

  public put(dados:Pessoa) {

    return this.http.put(this.url + '/atualizar/',dados);
  }

  public delete(id:number) {

    return this.http.delete(this.url + '/deletar/'+id);
  }


}
