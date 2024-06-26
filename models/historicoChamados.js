const Sequelize = require ('sequelize');
const db = require ('./db'); // importando a conexão que eu fiz em db e colocando ela na constante db aqui

const historicoChamados = db.define( 'historico', {

    idhistorico:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allwNull: false,
        primaryKey: true
    
    },
    chamadoId:{
        type:Sequelize.INTEGER,
        allwNull: false,

    },
    comentario:{
        type: Sequelize.STRING(300),
        allwNull: false
    }
  

});


    historicoChamados.sync();
  // verifica se tem diferença na tabela e realiza a alteração
    historicoChamados.sync({alter:true});



async function fecharChamado(idchamados, status, comentario) {
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      // Atualiza o chamado
      await connection.execute(
        'UPDATE chamados SET status = ? WHERE id = ?',
        [status, idChamado]
      );
  
      // Adiciona ao histórico
      await connection.execute(
        'INSERT INTO historico (chamadoId, status, comentario) VALUES (?, ?, ?)',
        [idchamados, status, comentario]
      );
  
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  module.exports = historicoChamados;
  
  module.exports = { fecharChamado };