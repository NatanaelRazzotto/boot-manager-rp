import { 
  Client, 
  GatewayIntentBits, 
  Events, 
  StringSelectMenuBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle ,
  ModalBuilder,               // ✅ <- adicione isso
  TextInputBuilder,           // ✅ <- e isso também, se ainda não tiver
  TextInputStyle,   
  EmbedBuilder          // ✅
} from 'discord.js';

            export default async function postMensagem(interaction,client) {
        // 1) Pega as opções:
        const title       = interaction.options.getString('titulo');
        const description = interaction.options.getString('descricao');
        const attachment  = interaction.options.getAttachment('arquivo');

        const descricao = description.replace(/\\n/g, '\n');

        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        // 2) Monta o embed (sem rodapé que revele quem usou):
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(descricao ?? '')
          .setImage(attachment.url)
          .setColor(0xFFA500)
          .setTimestamp();

        // 3) Envia no canal desejado:
        const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;  
        // ou "123456789012345678" direto aqui, se preferir
        const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
        if (!channel || !channel.isTextBased()) {
          return interaction.reply({
            content: '❌ Não consegui encontrar o canal de destino.',
            ephemeral: true
          });
        }

        // opcional: acknowledge imediato, para evitar timeout
        await interaction.deferReply({ ephemeral: true });

        // 4) Posta o embed “anônimo” no canal alvo
        await channel.send({ embeds: [embed] });

        // 5) Confirma para quem executou, mas de modo oculto
        return interaction.editReply({ content: '✅ Imagem postada no canal com sucesso!' }); 
      }
