export async function generate_EmbedCode(embed, TARGET_CHANNEL_ID, client, interaction) {


        // ou "123456789012345678" direto aqui, se preferir
        const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
        if (!channel || !channel.isTextBased()) {
          return interaction.reply({
            content: '❌ Não consegui encontrar o canal de destino.',
            ephemeral: true
          });
        }

        // 4) Posta o embed “anônimo” no canal alvo
        await channel.send({ embeds: [embed] });

        // 5) Confirma para quem executou, mas de modo oculto
        return interaction.editReply({ content: '✅ Registro criado e postado com sucesso!' });   
  
}
