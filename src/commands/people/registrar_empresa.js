
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
   export default async function registrarEmpresa(interaction,client){

        const attachment = interaction.options.getAttachment('arquivo');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        const userIdNotFormat = interaction.options.getString('proprietario');
        const userIdDiscord = userIdNotFormat?.replace(/[<@>]/g, '');

        const companyName = interaction.options.getString('rasao_social');
        const publicCompany = interaction.options.getBoolean('orgao_publico');
    
        const urlImage = attachment.url

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/pessoa-juridica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIdDiscord,
            companyName,
            publicCompany,
            urlImage
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
            return interaction.editReply(`❌ Erro ao criar Empresa: ${errorText}`);
          }

          const data = await response.json();
        
                        // 3) Envia no canal desejado:
            const TARGET_CHANNEL_ID = process.env.REGISTER_COMPANY;  

          const stringName = data.companyName
            const embed = new EmbedBuilder()
              .setTitle(stringName.toUpperCase())
              .setDescription("NOME DA COMPANHIA: "+ data.companyName +"\n"+"INPJ - (Indice Numerico de Pessoa Juridica):" + data.INPJ +"\n" + "USUARIO DISCORD: @" + data.person.user.nickname )
              .setImage(data.person.urlImage)
              .setColor(0xFFA500)
              .setTimestamp();

              return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }