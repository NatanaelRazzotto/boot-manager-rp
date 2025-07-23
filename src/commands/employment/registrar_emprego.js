
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
    export default async function registrarEmprego(interaction,client) {


      const naturalPersonNPF = interaction.options.getString('npf');
      const legalPersonINPF = interaction.options.getString('inpf');
       const position = interaction.options.getString('position');

       
      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/employment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            naturalPersonNPF,
            legalPersonINPF,
            position,
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
            return interaction.editReply(`❌ Erro ao criar emprego: ${errorText}`);
          }

          const data = await response.json();
          return interaction.editReply(`✅ emprego criado com sucesso: ${data.position}`);
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }