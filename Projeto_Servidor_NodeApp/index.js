const express = require('express');
const router=express();
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "leocami";
const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const redirectPath = "/api/entrar/:dados";
var request = require("request");

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
    res.status(200).send("Bem Vindo ao Diretorio Raíz!!");
    next();

});

router.get('/api', function (req, res, next) {
    res.status(200).send("Bem vindo a API!!!");
    next();
});

router.get('/api/banco', function (req, res, next) {

    let banco = getDB();
    if(!banco)
    {
        res.status(200).send(banco);
    }
    else
    {
        res.status(500).send("error");
    }
    
    next();
});

router.get('/api/listatodos', verifyToken, function (req, res,next) {
    let dados=getAll();

    if(dados!=null && dados!=undefined)
    {
        res.status(200).send(dados);
    }
    else
    {
        res.status(500).send("Lista está vazia");
    }

    next();
});

router.get('/api/pegarID/:id', verifyToken, function (req, res, next) {

    let id=req.body.id;
    let obj=getID(id);

    if(obj!=null && obj!=undefined)
    {
        res.status(200).send(obj);
    }
    else
    {
        res.status(500).send("Não existe esse ID no banco de dados!");
    }
    next();
});

router.post('/api/cadastrar/:dados', verifyToken, function (req, res, next) {

    let obj = req.body.dados;
    let error=insert(obj);
    if(!error)
    {
        res.status(200).send("Cadastrado com sucesso!");
    }
    else
    {
        res.status(500).send("Ocorreu falha no cadastro!");
    }
    next();
});

router.post('/api/entrar/:dados', verifyToken, function (req, res, next) {

    // Decodifica o valor de authorization, passado no header da requisição
    console.log("Valor da req Get:  " + req.headers.authorization);
    let [username, password] = decodAuth(req.headers.authorization);

    let obj = Auth(username, password);

    console.log("Valor do username que veio:  " + username);
    console.log("Valor do password que veio:  " + password);

    // Compara os valores de usuário e senha enviados com o objeto em memória
    if (obj != null && obj != undefined) {
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
        // Se não o login e senha não estiverem corretos seta o cabeçalho da resposta exigindo autenticação
        res.set('WWW-Authenticate', 'Basic realm="401"');
        // devolve o status de loged como falso
        res.status(401).json({ loged: false, redirect: redirectPath });
    }
});

router.put('/api/atualizar/:dados', verifyToken, function (req, res, next) {

    let obj = req.body.dados;
    let error = update(obj);
    if (!error) {
        res.status(200).send("Atualizado com sucesso!");
    }
    else {
        res.status(500).send("Ocorreu falha no atualizar!");
    }
    next();
});

router.delete('/api/deletar/:id', verifyToken, function (req, res, next) {

    let id = req.body.id;
    let error = deletar(id);
    if (!error) {
        res.status(200).send("Removido com sucesso!");
    }
    else {
        res.status(500).send("Ocorreu falha na remoção!");
    }
    next();
});


router.post('/api/token', function (req, res,next) {
    // Recebe o token JWT pelo cabeçalho na chave autorization
    console.log("Valor da req Post:  " + req.headers.authorization);
    let token = req.headers.authorization;
    // Caso o token tenha valor
    if (token) {
        // remove a string "bearer"
        token = req.headers.authorization.split(' ')[1];
        console.log("Valor do token:  " + token);
        // Usa a lib jwt para verificar a autenticidade do token
        jwt.verify(token, secret, function (err, decoded) {
            // Em caso de erro
            if (err) {
                // Responde que o usuário não está logado e informa o path para onde ele deve ir para se autenticar
                res.status(401).json({ loged: false, redirect: redirectPath });
            } else {
                // Caso não haja problemas é porque o token é válido
                // Adiciona o valor "loged" como verdadeiro
                decoded.loged = true;
                // devolve o payload do token para o requisitante
                res.status(200).json(decoded);
            }
        });
        // Caso não venha nada no header autorization
    } else {
        // Exige a autenticação do usuário
        res.set('WWW-Authenticate', 'Bearer realm="401"');
        // Envia o status de loged como falso e o endereço onde ele se autentica
        res.status(401).json({ loged: false, redirect: redirectPath });
    }
});


function getDB()
{
    let db = new sqlite.Database(':memory:',(err)=>{
        if(err)
        {
            return err;
        }
    });

    return db.run(
        'create table if not exists pessoas (id integer primary key autoincrement not null,' +
        'nome text, email text, senha text)'
    );
}

function getAll()
{
    let sql ="select * from pessoas";
    let data=[];
    
    return getDB().get(sql,

    (err)=>{
        console.log("Erro: "+err);
        let message=err;
        return message;
    },
    (row)=>{
        if(row.length>0)
        {
            for (let i = 0; i <row.length; i++) {
                data.push(row.item(i));
            }
            console.log("Valores do data: "+data);
            return data;
        }
        else
        {
            console.log("Lista está vazia");
            return data;
        }
    });
}

function insert(obj)
{
    let sql = "insert into pessoas (nome,email,senha) values ('" + obj.nome + "','" + obj.email + "','" + obj.senha +"')";
    return getDB().exec(sql,     
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err);
            let message = err;
            return message;

        });
}

function update(obj) {

    let sql = "update pessoas set nome='"+obj.nome +"', email='"+obj.email+"', senha='"+obj.senha+"' where id='"+obj.id+"'";
    return getDB().exec(sql,
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err);
            let message = err;
            return message;

        });
}

function deletar(id){

    let sql = "delete from pessoas where id='"+id+"'";
    return getDB().exec(sql,
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err);
            let message = err;
            return message;

        });
}

function getID(id) {

    let sql = "select from pessoas where id='" + id + "'";
    return getDB().exec(sql,
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err);
            let message = err;
            return message;

        });
}

function Auth(user,password) {

    let sql = "select from pessoas where upper(nome)='" + user.toUpperCase() + "' and upper(senha)='" + password.toUpperCase()+"' ";
    return getDB().exec(sql,
        (res) => {
            console.log("Resposta res: " + res);
            return res;
        },
        (err) => {
            console.log("Erro: " + err);
            let message = err;
            return message;

        });
}

function verifyToken(req, res, next) {
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
        next();
    }
}

function decodAuth(authorization) {
    if (authorization === undefined) return [undefined, undefined]
    console.log("Valor que veio da autorização:  " + authorization);
    return new Buffer(authorization.split(' ')[1], 'base64').toString().split(':');
}