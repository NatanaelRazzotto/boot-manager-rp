    export default async function selecionarInfracao(interaction) {

         const userData = userMultaData.get(interaction.user.id);

      if (!userData) {
        return interaction.reply({
          content: '❌ Nenhuma informação anterior encontrada. Reenvie o comando.',
          ephemeral: true
        });
      }

      const { urlRecord , NPF} = userData;


    const selected = interaction.values[0];

        // Salva ambos no Map para uso depois do modal
    userMultaData.set(interaction.user.id, {
      NPF,
      urlRecord,
      selectedViolation: selected
    });

    // Cria um modal
    const modal = new ModalBuilder()
      .setCustomId('formulario_infracao')
      .setTitle('Detalhes da infração');

    //     // Campo de texto 1: placa
    // const idInput = new TextInputBuilder()
    //   .setCustomId('autor_NPF')
    //   .setLabel('NPF do registrante')
    //   .setStyle(TextInputStyle.Short)
    //   .setRequired(true);

        // Campo de texto 1: placa
    const placaInput = new TextInputBuilder()
      .setCustomId('placa_veiculo')
      .setLabel('Placa do veículo')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    // Campo de texto 2: observações
    const observacaoInput = new TextInputBuilder()
      .setCustomId('observacoes')
      .setLabel('Observações adicionais')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    // Adiciona campos ao modal
    const firstRow = new ActionRowBuilder().addComponents(placaInput);
    const secondRow = new ActionRowBuilder().addComponents(observacaoInput);

    modal.addComponents(firstRow, secondRow);

    // Mostra o modal para o usuário
    return interaction.showModal(modal);
    }