import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class ApiProvider {

  public url: string = 'http://localhost:8080/api';

  constructor(public http: HttpClient) {

  }

  databaseSqlite() {
    console.log("Chamou databaseSqlite! ");
    return this.http.get(this.url + '/banco');

  }

  public get() {
    console.log("Chamou get que puxa todos da lista! ");
    return this.http.get<Pessoa[]>(this.url + '/listatodos');
  }

  public getId(id:number) {
    console.log("Chamou getId! "+ id);
    return this.http.get<Pessoa>(this.url + '/pegarID/'+id);
  }

  public post(dados:Pessoa) {
    console.log("Chamou post! "+dados);
    return this.http.post(this.url + "/cadastrar/",dados);
  }

  public post2(dados:Pessoa) {
    console.log("Chamou post2! "+dados);
    return this.http.post(this.url + "/entrar/", dados);
  }

  public put(dados:Pessoa) {
    console.log("Chamou put! "+dados);
    return this.http.put(this.url + '/atualizar/',dados);
  }

  public delete(id:number) {
    console.log("Chamou delete! "+id);
    return this.http.delete(this.url + '/deletar/'+id);
  }


}
