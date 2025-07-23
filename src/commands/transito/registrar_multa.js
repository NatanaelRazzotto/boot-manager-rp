
    export default async function registrarMulta(interaction) {//transito-registrar_multa

        const attachment = interaction.options.getAttachment('imagem');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

      const urlRecord = attachment.url;
      userMultaData.set(interaction.user.id, { urlRecord });

      const button1 = new ButtonBuilder()
        .setCustomId('bprv_registrar')
        .setLabel('BPRv REGISTRO')
        .setStyle(ButtonStyle.Primary);

      const button2 = new ButtonBuilder()
        .setCustomId('DER_registro')
        .setLabel('DER REGISTRO')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button1, button2);

      await interaction.reply({
        content: 'Selecione a CORPORAÇÃO AUTUADORA (Apenas servidores públicos):',
        components: [row],
        ephemeral: true
      });

     
    }