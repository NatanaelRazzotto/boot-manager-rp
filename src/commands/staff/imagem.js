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
    export default async function imagemPost(interaction,client){
        // pega o attachment enviado no comando
        const title = interaction.options.getString('titulo');
  const rawDescription = interaction.options.getString('descricao') || '';
  const description = rawDescription.replace(/\\n/g, '\n'); // aqui faz a mágica
        const attachment = interaction.options.getAttachment('arquivo');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        // Aqui entra sua lógica de download/processamento
        // Exemplo simples de resposta
        const embed = new EmbedBuilder()
          .setTitle('📸' + title)
          .setDescription(description)
          .setImage(attachment.url)      // exibe a própria imagem
          .setColor(0xFFA500)
          .setFooter({ text: `Enviado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      }