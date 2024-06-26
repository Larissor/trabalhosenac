const Sequelize = require('sequelize');
const db = require('./db');
const historicoChamados = require('./models/historicoChamados'); // Supondo que este seja o caminho correto

async function fecharChamado(idChamado, status, comentario) {
    const transaction = await db.transaction();

    try {
        // Obtém os dados do chamado antes de excluí-lo
        const chamadoExcluido = await db.models.chamados.findOne({
            where: { id: idChamado },
            transaction,
        });

        // Move o chamado para a tabela de chamados excluídos
        await db.models.chamados_excluidos.create(chamadoExcluido.get({ plain: true }), { transaction });

        // Exclui o chamado da tabela original
        await db.models.chamados.destroy({
            where: { id: idChamado },
            transaction,
        });

        // Adiciona ao histórico
        await historicoChamados.create(
            { chamadoId: idChamado, status: status, comentario: comentario },
            { transaction }
        );

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = { fecharChamado };
