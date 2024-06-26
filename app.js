// esse app.js é o arquivo raiz do projeto

const express = require ('express'); // isso é uma função, meio que importando o express

const app = express(); // aqui eu to inicializando a função e atribuindo a constante app
const User = require ('./models/User'); // importando a tabela la de User
const path = require('path');
const bodyParser = require ("body-parser");
const moment = require ('moment');

const Chamados = require ('./models/chamados');

const handlebars = require ("express-handlebars");



app.engine('handlebars', handlebars.engine({
    defaultLayout:__dirname + '/views/layouts/main',
    helpers:{
        formatdate: (date)=>{
            return moment(date).format('DD/MM/YYYY HH:mm:ss')
        }
    }
}));



app.set('view engine','handlebars');
app.set('views', path.join(__dirname, './views/layouts'));


app.use(express.json());


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.get ("/login", function (req, res){ // isso é uma rota get, rota principal
    res.render('login');

}); 


app.get ("/cadastrar", function (req, res){ // isso é uma rota get, rota principal
    res.render('cadastro');

}); 

app.get("/home", function(req,res){
    res.render('home');
    
});



let historicoChamados = [];

// Rota para fechar chamado e adicionar ao histórico
app.get('/fechar-chamado/:idchamados', (req, res) => {
    const chamadoId = req.params.idchamados;
    // Aqui você pode realizar operações para fechar o chamado no seu sistema, como atualizar no banco de dados, etc.

    // Adiciona o chamado ao histórico (simulado aqui com um array)
    historicoChamados.push(chamadoId);

    // Redireciona para a página historicochamados
    res.redirect('/historicochamados');
});

// Rota para exibir o histórico de chamados
app.get('/historicochamados', (req, res) => {
    // Monta uma lista de chamados formatada para exibir
    const listaChamados = historicoChamados.map(chamado => `Chamado ${chamado}`).join('<br>');
    
    // Exibe o histórico de chamados na página
    res.send(`<h1>Histórico de Chamados</h1>${listaChamados}`);
});




app.get("/listaChamados", function(req,res){
    Chamados.findAll().then(function(listaChamados){
        res.render('listaChamados',{listachamados: listaChamados});
    })
    
    
});

app.get('/fechar-chamado/:id', (req, res) => {
    const chamadoId = req.params.id;
    // Aqui você pode realizar operações para fechar o chamado no seu sistema, como atualizar no banco de dados, etc.

    // Redireciona para a página historicochamados
    res.redirect('/historicochamados');
});

app.post('/cadastrar', function(req,res){
 
User.create({

    name: req.body.nome,
    email:req.body.email,
    password: req.body.senha,
    setor: req.body.setor
  }).then(function(){
   return res.redirect ('/login')

  }).catch (function(erro){
  return  res.send("Erro ao cadastrar usuario")
  })

});



/*app.post ("/cadastrar", async (req, res) => { // rota de cadastro do tipo Post
 var dados = req.body;
   dados.senha = await bcrypt.hash(dados.password,8);

    await User.create(dados)
     
    .then (()=> {
       
        return res.json({
            erro:false,
            mensagem: "Usuario cadastrado"
        });

    }).catch (()=>{
        return res.status(400)({

            erro:true,
            mensagem: "Usuario não cadastrado"
        });
    
    });

    
}); */

app.post('/login', async (req,res)=>{
 const userId = req.body.id;
 const user = await User.findOne({
    attributes: ['id','email','password'],
    where: {
        email:req.body.email,
        password: req.body.senha
    }
 })

 if (user === null){
    return res.send("<h1>Email ou senha incorretos, ou usuario não cadastrado</h1>")
    }else {res.redirect('/home')}
 if (userId === 1){
    res.redirect ('/admin');
 }
});


app.post('/home', function(req,res){
    Chamados.create({
       nome: req.body.nome,
       problema: req.body.problema,
       setor: req.body.setor
    }).then (function(){
       return res.redirect ('/home')
    }).catch (function(erro){
   
       return res.send("Erro ao realizar o chamado")
    })
   
   });




app.listen(8080, () =>{

    console.log("Servidor iniciado na porta 8080")
});