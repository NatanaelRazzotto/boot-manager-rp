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
  export default async function registrarCrime(interaction,client){

        const attachment = interaction.options.getAttachment('arquivo');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        const authorIdNotFormat = interaction.options.getString('autoridade_registrante');
        const authorRecordIDDiscord = authorIdNotFormat?.replace(/[<@>]/g, '');

        const offenderIdNotFormat = interaction.options.getString('usuario_infrator');
        const offenderIDDiscord = offenderIdNotFormat?.replace(/[<@>]/g, '');

        const descriptionSituation = interaction.options.getString('descricao_da_infracao');
        const coast = interaction.options.getNumber('valor_fiança');
        const timeOfConfinement = interaction.options.getNumber('tempo_detencao');
        const paymentPending = interaction.options.getBoolean('fiança_paga');

        const urlImage = attachment.url

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/criminal-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorRecordIDDiscord,
            offenderIDDiscord,
            descriptionSituation,
            coast,
            timeOfConfinement,
            paymentPending,
            urlImage
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
            return interaction.editReply(`❌ Erro ao criar usuário: ${errorText}`);
          }

          const data = await response.json();   

            const embed = new EmbedBuilder()
              .setTitle("FICHA CRIMINAL")
              .setDescription("NPF - infrator: " + data.offender.NPF +"\n"+"NPF - autoridade: " + data.authorRecord.NPF +"\n"  + "DESCRIÇÃO DA DETENCAO: " + data.descriptionSituation )
              .setImage(data.urlImage)
              .setColor(0xAE0F00)
              .setTimestamp();

            // 3) Envia no canal desejado:
            const TARGET_CHANNEL_ID = process.env.REGISTER_CRIMINAL;  
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
            return interaction.editReply({ content: '✅ Usuario criado e postado com sucesso!' });   
      
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }