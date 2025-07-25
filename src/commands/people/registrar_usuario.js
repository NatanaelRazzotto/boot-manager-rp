
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
    export default async function registrarUsuario(interaction,client) {
      const userIdNotFormat = interaction.options.getString('id_discord');
      const idDiscord = userIdNotFormat?.replace(/[<@>]/g, '');
      const nickname = interaction.options.getString('nick_discord');
      const nameServer = interaction.options.getString('name_server');
      const userType = 'PLAYER';

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            nameServer,
            userType,
            idDiscord
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
            return interaction.editReply(`❌ Erro ao criar usuário: ${errorText}`);
          }

          const data = await response.json();
          return interaction.editReply(`✅ Usuário criado com sucesso: ${data.name}`);
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }

         