import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pessoa } from '../../models/Pessoa';

@Injectable()
export class ApiProvider {

  public url: string = 'http://localhost:8080/api';
  public token: string;


  constructor(public http: HttpClient) {

  }

  /*
    Aqui se encontra a função Token que ta sendo chamada la
    no entrar.ts que recebeu o token e enviou pra ca
    declaro como uma string, porque o token é uma string que retorna
    ai la nas ultimas linhas se encontra o função getToken

  */

  public Token(toke: string) {
    this.token = toke;

  }

  public databaseSqlite() {

    return this.http.get(this.url + '/banco');

  }

  public get() {

    return this.http.get<Pessoa[]>(this.url + '/listatodos');
  }

  public getId(id: number) {

    return this.http.get<Pessoa>(this.url + '/pegarID/' + id);
  }

  public getEmail(email: string) {

    return this.http.get<Pessoa>(this.url + '/pegarEmail/' + email);
  }

  /*
    Então aqui quando a pessoa está logada , ela vai cadastrar nova pessoa
    e com isso é criado um header para cada método como também atualizar e deletar
    que contém igual aqui, e com isso é enviado junto na requisição no último
    como exemplo abaixo.

    Ali criado uma variavel header recebendo new HttpHeaders ai é inserido
    as devidas configurações pro cabeçalho ser enviado e o mais importante
    é onde mostra Authorization e Bearer. Sempre quiser enviar com cabeçalho
    com um valor de autenticação tem que ser criaod assim.
    E onde diz this.getToken() é retorno do token recebido ali emcima onde foi
    informado.

    Obs: Oberse-se que foi criado uma váriavel auth e por isso, pelo fato que quando cria
    um objeto com Httpheaders, mandando objeto assim direto dentro da varável options
    lá na url da api do servidor a requisição não pega, pelo fato conter uns bugs de requisição
    direto, ai foi criado outra variavel recebendo ela para ser enviad, como está definido abaixo
    options como objeto passando propriedade headers:auth e assim inserido na requisição da url.

    Apesar que foi criado um header para cada método pelo motivo de ter uns problemas questão
    de erro do angular, eu testei , ai so dava erro, tive que fazer assim pra funcionar,
    ai se criou um pra cadastrar, um pra atualizar e um pra deletar e com isso funcionou
    e está ok.

  */

  public post(dados: Pessoa) {

      let header = new HttpHeaders();
      header = header.append('Content-Type', 'application/json');
      header = header.append('Accept', 'application/json');
      header = header.append('Authorization', 'Bearer ' + this.getToken());
      let auth = header;
      let options = {
        headers: auth
      }

    return this.http.post(this.url + "/cadastrar/", dados, options);
  }

  public post2(dados: Pessoa) {

    return this.http.post<string>(this.url + "/entrar/", dados);
  }

  public put(dados: Pessoa) {

    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.getToken());
    let auth = header;
    let options = {
      headers: auth
    }

    return this.http.put(this.url + '/atualizar/', dados, options);
  }

  public delete(id: number) {

    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.getToken());
    let auth = header;
    let options = {
      headers: auth
    }

    return this.http.delete(this.url + '/deletar/' + id, options);
  }


  public getToken() {
    return this.token;
  }


}
