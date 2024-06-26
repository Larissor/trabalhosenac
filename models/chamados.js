const Sequelize = require ('sequelize');
const db = require ('./db'); // importando a conexão que eu fiz em db e colocando ela na constante db aqui

const Chamados = db.define( 'chamados', {

    idchamados:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allwNull: false,
        primaryKey: true
    
    },
    nome:{
        type:Sequelize.STRING,
        allwNull: false,
    },
    problema:{
        type: Sequelize.STRING(300),
        allwNull: false
    },
    setor:{
        type: Sequelize.STRING,
        allwNull: false
    }

});


  Chamados.sync();
   // verifica se tem diferença na tabela e realiza a alteração
   Chamados.sync({alter:true});

module.exports = Chamados;