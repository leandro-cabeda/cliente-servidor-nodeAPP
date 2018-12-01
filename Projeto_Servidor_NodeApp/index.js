const express = require('express');
const router = express();
const port = process.env.PORT || 8080;
const secret = process.env.SECRET || "leocami";
const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const redirectPath = "/api/entrar/:dados";
var request = require("request");
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
        console.log("Deu certo o banco! " + banco);
        res.status(200).json(banco);
    }
    else {
        console.log("Deu errado o banco! " + banco);
        res.status(500).json("error");
    }


});

router.get('/api/listatodos', function (req, res, next) {
    
    let sql = `select * from pessoas`;
    var data = [];


    getDB().all(sql, (err, rows) => {
        console.log("Deu getDB.all");

        if (err) {
            console.log("Deu erro no getl all");

            res.status(500).json("error");
        }
        if (rows.length > 0) {
            console.log("Valor de rows.length: " + rows.length);

            data = rows.filter(row => {
                return row;
            })
            console.log("Valor de data.nome: " + data[0].nome);

        }
        else {
            console.log("Entrou no else sem nada, rows vazia: " + rows.length);

        }

        console.log("Valor data dentro get all: " + data[0].id);

        if (data != null && data != undefined) {
            console.log("Deu certo a busca de todos! " + data[0].email);
            res.status(200).json(data);
        }
        else {
            console.log("Deu errado a busca de todos! " + data);
            res.status(204).json("Lista está vazia");
        }

    });

});

router.get('/api/pegarID/:id', function (req, res, next) {

    let id = req.params.id;
    let sql = `select from pessoas where id=?`;
    var data;
     getDB().get(sql, [id], (err, row) => {
        console.log("Deu getDB.getID");

        if (err) {
            console.log("Deu erro no get id");

            res.status(500).json("error");
        }

        console.log("Valor do row.nome: " + row.nome);
        data = row;
        
         if (data != null && data != undefined) {
             console.log("Deu certo a busca do ID! " + id);
             res.status(200).json(data);
         }
         else {
             console.log("Deu errado a busca de ID! " + data);
             res.status(204).json("Não existe esse ID no banco de dados!");
         }


    });


});

router.post('/api/cadastrar/', function (req, res, next) {

    let obj = req.body;
    let error=false;

    let sql = `insert into pessoas (nome,email,senha) values (?,?,?)`;
    getDB().all(sql, [obj.nome, obj.email, obj.senha], (err) => {
        console.log("Inseriu no banco");

        if (err) {
            console.log("Erro: " + err.message);
            error=true;
            return err;
        }

    });

    if (!error) {
        console.log("Deu certo o cadastro de dados! " + obj);
        res.status(200).json(obj);
    }
    else {
        console.log("Deu errado o cadastro de dados! " + obj + "  Error: " + error);
        res.status(500).json("error!");
    }

});

router.post('/api/entrar/', function (req, res, next) {

    let obj = req.body;
   
    console.log("Valor obj " + obj);

    // Decodifica o valor de authorization, passado no header da requisição
    console.log("Valor da req Get:  " + req.headers.authorization);
    /*let [username, password] = decodAuth(req.headers.authorization);

    let obj = Auth(username, password);

    console.log("Valor do username que veio:  " + username);
    console.log("Valor do password que veio:  " + password);

    // Compara os valores de usuário e senha enviados com o objeto em memória
    if (obj != null && obj != undefined) {
        console.log("Deu certo ao obj! " + obj);
        // Se o login e senha estiverem corretos gera o token com um tempo de vida de 1 hora
        let token = jwt.sign({
            login: username,
        }, secret,
            { expiresIn: 60 * 60 });
        // Responde com o status de logado como verdadeiro e o token gerado
        res.status(200).json({
            loged: true,
            jwt: token
        });
    } else {
        console.log("Deu errado ao obj! " + obj);
        // Se não o login e senha não estiverem corretos seta o cabeçalho da resposta exigindo autenticação
        res.set('WWW-Authenticate', 'Basic realm="401"');
        // devolve o status de loged como falso
        res.status(401).json({ loged: false, redirect: redirectPath });
    }*/
});

router.put('/api/atualizar/', function (req, res, next) {

    let obj = req.body;
    console.log("Valor obj " + obj);

    let sql = `update pessoas set nome=?, email=?, senha=? where id=?`;
    let error = false;
    getDB().run(sql, [obj.nome, obj.email, obj.senha, obj.id], (err) => {
        console.log("Entrou no getDB update");

        if (err) {
            console.log("Erro: " + err.message);
            error=true;
            return err;
        }

    });
    
    if (!error) {
        console.log("Deu certo atualizar de dados! " + obj);
        res.status(200).json("Atualizado com sucesso!");
    }
    else {
        console.log("Deu errado atualizar de dados! " + obj + "  Error: " + error);
        res.status(500).json("Ocorreu falha no atualizar!");
    }

});

router.delete('/api/deletar/:id', function (req, res, next) {

    let id = req.params.id;
    
    let error = deletar(id);
    if (!error) {
        console.log("Deu certo deletar id! " + id);
        res.status(200).json("Removido com sucesso!");
    }
    else {
        console.log("Deu errado deletar id! " + id + "  Error: " + error);
        res.status(500).json("Ocorreu falha na remoção!");
    }

});


/*router.post('/api/token', function (req, res, next) {
    // Recebe o token JWT pelo cabeçalho na chave autorization
    console.log("Valor da req Post:  " + req.headers.authorization);
    let token = req.headers.authorization;
    console.log("Entrou para realizar o token! " + token);
    // Caso o token tenha valor
    if (token) {
        // remove a string "bearer"
        token = req.headers.authorization.split(' ')[1];
        console.log("Valor do token:  " + token);
        // Usa a lib jwt para verificar a autenticidade do token
        jwt.verify(token, secret, function (err, decoded) {
            // Em caso de erro
            if (err) {
                console.log("Deu erro! " + err);
                // Responde que o usuário não está logado e informa o path para onde ele deve ir para se autenticar
                res.status(401).json({ loged: false, redirect: redirectPath });
            } else {
                console.log("Deu certo! ");
                // Caso não haja problemas é porque o token é válido
                // Adiciona o valor "loged" como verdadeiro
                decoded.loged = true;
                // devolve o payload do token para o requisitante
                res.status(200).json(decoded);
            }
        });
        // Caso não venha nada no header autorization
    } else {
        console.log("Deu erro no token:  " + token);
        // Exige a autenticação do usuário
        res.set('WWW-Authenticate', 'Bearer realm="401"');
        // Envia o status de loged como falso e o endereço onde ele se autentica
        res.status(401).json({ loged: false, redirect: redirectPath });
    }
});*/


function getDB() {

    console.log("Função getDB");
    /*let sql = "create table if not exists pessoas (id serial primary key not null," +
        "nome text, email text, senha text)";

    db.query(sql, (err, res) => {
        console.log("Erro: " + err + "   Res: " + res);
    });*/

    let db = new sqlite.Database('CadastroPessoas', (err) => {
        if (err) {
            return console.error("Ocorreu erro no banco: " + err.message);
        }
        console.log('Conectado in-memory SQlite database.');
    });
    console.log("valor db: " + db);

    db.serialize(function () {
        let sql = `create table if not exists pessoas (id integer primary key autoincrement not null,
        nome text, email text, senha text)`;
        console.log("Criado tabela do banco");
        db.run(sql, (err) => {
            if (err) {
                console.log("Erro: " + err.message)
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
            console.log("Erro: " + err.message);
            return err;
        }

    });

}

function getID(id) {

   
}

/*function Auth(user, password) {

    let sql = `select from pessoas where upper(nome)=? and upper(senha)=? `;
    getDB().run(sql, [user.toUpperCase(), password.toUpperCase()],
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err.message);
            let message = err.message;
            return message;

        });
}*/

/*function verifyToken(req, res, next) {
    console.log("Valor da função verifyToken da req autorização:  " + req.headers.authorization);
    let auth = req.headers.authorization;
    if (auth) {
        auth = auth.split(' ')[1];
        console.log("Valor do auth função verifyToken:  " + auth);
        let options = {
            method: 'POST',
            url: 'https://localhost:3000/api/token',
            headers:
                { Authorization: 'Bearer ' + auth }
        }
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            body = JSON.parse(body);
            console.log("Valor do Body:  " + body);
            if (body.loged) {
                req.payload = body;
                console.log("Valor do req.payload do body, função verifyToken:  " + req.payload);
            }
            next();
        })
    } else {
        console.log("Valor do auth: " + auth);
        next();
    }
}

function decodAuth(authorization) {
    if (authorization === undefined) return [undefined, undefined]
    console.log("Valor que veio da autorização:  " + authorization);
    return new Buffer(authorization.split(' ')[1], 'base64').toString().split(':');
}*/