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
    export default async function registrarPersonagem(interaction,client) {


        const attachment = interaction.options.getAttachment('arquivo');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        const userIdNotFormat = interaction.options.getString('usuario');
        const userIdDiscord = userIdNotFormat?.replace(/[<@>]/g, '');

        const primaryName = interaction.options.getString('primeiro_nome');
        const lastName = interaction.options.getString('sobrenome');
      
        const birth = interaction.options.getString('data_nascimento');
        const urlImage = attachment.url

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/pessoa-fisica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIdDiscord,
            primaryName,
            lastName,
            birth,
            urlImage
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
          
            return interaction.editReply(`❌ Erro ao criar usuário: ${errorText}`);
          }

          const data = await response.json();

                  // 3) Envia no canal desejado:
            const TARGET_CHANNEL_ID = process.env.REGISTER_USERS;  

          const stringName = data.primaryName +" "+ data.lastName
            const embed = new EmbedBuilder()
              .setTitle(stringName.toUpperCase())
              .setDescription("PRIMEIRO NOME: "+ data.primaryName +"\n" + "SOBRENOME: "+ data.lastName  +"\n"+"NPF - (Numero de Pessoa Fisica):" + data.NPF +"\n" + "USUARIO DISCORD: @" + data.person.user.nickname )
              .setImage(data.person.urlImage)
              .setColor(0xFFA500)
              .setTimestamp();

          return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
          
      } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }