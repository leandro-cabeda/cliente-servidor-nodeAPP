const express = require('express');
const router = express();
const port = process.env.PORT || 8080;
const secret = process.env.SECRET || "leocami";
//const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
//const redirectPath = "/api/entrar/:dados";
//var request = require("request");
/*const { Pool, Client } = require("pg");
const db= new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'CadastroPessoas',
    password: '963852741',
    port: 5432,
});
console.log(db);
db.connect();
console.log("Retorno getGB: " + getDB());*/



router.use(cors());
router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));


router.listen(port, function () {
    console.log("Servidor rodando na porta:  " + port);
});

router.get('/', function (req, res, next) {
    res.status(200).json("Bem Vindo ao Diretorio Raíz!!");
  

});

router.get('/api', function (req, res, next) {

    res.status(200).json("Bem vindo a API!!!");
   
});

router.get('/api/banco', function (req, res, next) {

    let banco = getDB();

    if (banco) {
        //console.log("Deu certo o banco! " + banco);
        res.status(200).json(banco);
    }
    else {
        //console.log("Deu errado o banco! " + banco);
        res.status(500).json("error");
    }

});

router.get('/api/listatodos', function (req, res, next) {

    let sql = `select * from pessoas`;
    var data = [];


    getDB().all(sql, (err, rows) => {

        if (err) {

            res.status(500).json("error");
        }
        if (rows.length > 0) {
            //console.log("Valor de rows.length: " + rows.length);

            data = rows.filter(row => {
                return row;
            })

        }

        if (data != null && data != undefined) {
            //console.log("Deu certo a busca de todos! " + data[0].email);
            res.status(200).json(data);
        }
        else {
            //console.log("Deu errado a busca de todos! " + data);
            res.status(204).json("Lista está vazia");
        }

    });

});

router.get('/api/pegarID/:id', function (req, res, next) {

    let id = req.params.id;

    let sql = `select * from pessoas where id=?`;
    var data;
    getDB().get(sql, [id], (err, row) => {

        if (err) {

            res.status(500).json("error");
        }

        data = row;

        if (data != null && data != undefined) {
            //console.log("Deu certo a busca do ID! " + data.id);
            res.status(200).json(data);
        }
        else {
            //console.log("Deu errado a busca de ID! " + data);
            res.status(404).json("Não existe esse ID no banco de dados!");
        }


    });


});

router.get('/api/pegarEmail/:email', function (req, res, next) {

    let email = req.params.email;

    let sql = `select * from pessoas where upper(email)=?`;
    var data;
    getDB().get(sql, [email.toUpperCase()], (err, row) => {

        if (err) {

            res.status(500).json("error");
        }

        data = row;
        res.status(200).json(data);

    });


});

router.post('/api/cadastrar/', verifyToken,function (req, res, next) {

    let obj = req.body;
    let error = false;

    let sql = `insert into pessoas (nome,email,senha) values (?,?,?)`;
    getDB().run(sql, [obj.nome, obj.email, obj.senha], (err) => {

        if (err) {
            
            error = true;
            return err;
        }

    });

    if (!error) {
        //console.log("Deu certo o cadastro de dados! " + obj);
        res.status(200).json(obj);
    }
    else {
        //console.log("Deu errado o cadastro de dados! " + obj + "  Error: " + error);
        res.status(500).json("error!");
    }

});

router.post('/api/entrar/', function (req, res, next) {

    /*
        Bom aqui nessa URL é que resgata o login e a senha do usuário
        através pelo body que é  o corpo que ta vindo a requisição
        Nisso verifica se no banco contem esses 2 dados, se tiver
        é criado um token a partir do jwt, se não retorna um erro.
    
    */

    let obj = req.body;

    let sql = `select * from pessoas where upper(email)=? and upper(senha)=?`;
    var data;
    getDB().get(sql, [obj.email.toUpperCase(), obj.senha.toUpperCase()], (err, row) => {

        if (err) {
            console.log("Ocorreu erro ao verificar email e senha no banco ao entrar! ");
            res.status(500).json("Ocorreu erro ao verificar email e senha no banco ao entrar!");
        }

        data = row;

        if (data != null && data != undefined) {
            console.log("Deu certo a busca dos dados! " + data.id);

            /*
                Se a variável data conter dados deste registro então cria-se o token
                e retorna o token em json pra quem fez a requisição.
                Esse token como defnido em baixo expira em 60 segundos
                onde quer dizer 1 minuto, depois disso terá q criar outor token
                quando efetuar login.
                A variavel secret está definida la emcima no inicio
                com um valor que será a chave da assinatura desse token.
            */
            let token = jwt.sign({
                login: data.email,
                password: data.senha
            },
                secret,  //isso se mantem publico e não é recomendado
                {
                    expiresIn: 120
                });
            res.status(200).json(token);
        }
        else {
            //console.log("Não existe esse dado no banco de dados! " + data);
            res.status(401).json("Não existe esse dado no banco de dados!");
        }
    
    });
});

/*
    Essa função  verifyToken é uma função que verifica o se o token recebido
    ainda é valido, e essa função está definida la nas útimas linhas do código
    Foi inserida essa função nos métodos de atualizar, cadastrar e deletar
*/

router.put('/api/atualizar/', verifyToken, function (req, res, next) {

    let obj = req.body;

    let sql = `update pessoas set nome=?, email=?, senha=? where id=?`;
    let error = false;
    getDB().run(sql, [obj.nome, obj.email, obj.senha, obj.id], (err) => {

        if (err) {
            
            error = true;
            return err;
        }


    });

    if (!error) {
        //console.log("Deu certo atualizar de dados! " + obj);
        res.status(200).json("Atualizado com sucesso!");
    }
    else {
        //console.log("Deu errado atualizar de dados! " + obj + "  Error: " + error);
        res.status(500).json("Ocorreu falha ao atualizar!");
    }


});

router.delete('/api/deletar/:id', verifyToken, function (req, res, next) {

    let id = req.params.id;

    let error = deletar(id);
    if (!error) {
        //console.log("Deu certo deletar id! " + id);
        res.status(200).json("Removido com sucesso!");
    }
    else {
        //console.log("Deu errado deletar id! " + id + "  Error: " + error);
        res.status(500).json("Ocorreu falha na remoção!");
    }

});


function getDB() {

    console.log("Função getDB");
    /*let sql = "create table if not exists pessoas (id serial primary key not null," +
        "nome text, email text, senha text)";

    db.query(sql, (err, res) => {
        console.log("Erro: " + err + "   Res: " + res);
    });*/

    let db = new sqlite.Database('CadastroPessoas', (err) => {
        if (err) {
            return err; //console.error("Ocorreu erro no banco: " + err.message);
        }
        //console.log('Conectado in-memory SQlite database.');
    });
   

    db.serialize(function () {

        /*let sql2 = `drop table pessoas`;
        
        db.run(sql2, (err) => {
            if (err) {
                console.log("Erro: " + err.message)
                return err;
            }

            console.log("tabela excluida de pessoas");
        });*/


        let sql = `create table if not exists pessoas (id integer primary key autoincrement not null,
        nome text, email text, senha text)`;

        db.run(sql, (err) => {
            if (err) {
                
                return err;
            }

            console.log("Criado banco de dados");
        });
    });

    /* db.close((err) => {
         if (err) {
             console.error("Erro: "+err.message);
         }
         console.log('Close the database connection.');
     });*/

    return db;


}

function deletar(id) {

    let sql = `delete from pessoas where id=?`;
    getDB().run(sql, [id], (err) => {
        console.log("Deu getDB deletar");

        if (err) {
            
            return err;
        }

    });

}

/*
    Aqui a função verifyToken recebe o cabeçalho da requisição
    e verifica se contém valor, se não vai pra próxima função
    inserido next. Caso essa autenticação entrar no IF,
    uma função do jwt própria verifica se ainda está valida
    utilziando a variavel secret q contem a assinatura,
    caso contém erro já mand aum status 401 de token experida e não
    autorizado se não envia um status ok e inserido um next.

    Obs: Se observa que só next tem se o status da ok, porque disso
    é pela causa de ele executar igual a função próxima a seguir mesmo
    com token expirado, e não é essa intensção até pq isso é errado
    Next ele vai ir pra próxima, e outras palavras cad aurl contém
    a função verifyToken que é executada primeiro, depois se der ok
    no status ai vai pra requisição do corpo ou parametro
    que url trouxe, funciona assim, por isso tem que cuidar quando
    usa o next.

*/

function verifyToken(req, res, next) {
    let auth = req.headers.authorization;
    console.log("valor auth veryfyToken: " + JSON.stringify(auth));
    if (auth) {
        auth = req.headers.authorization.split(' ')[1];
        
        jwt.verify(auth,secret, function (err) {
            if (err) {
                res.status(401).json("Token expirado, por favor efetue o login novamente!!");
            } else {

                //res.status(200);
                next(); // isso é correto da validação
            }
        
        });

    } else {
        res.status(401).json("Token inválido!!"); // isso é correto da validação
        //next();
       
    }
    
}
