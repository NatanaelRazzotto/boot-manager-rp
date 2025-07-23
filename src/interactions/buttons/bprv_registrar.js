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
    export default async function bprvRegistrar(interaction,client) {
     const userData = userMultaData.get(interaction.user.id);

          if (!userData) {
            return interaction.editReply({
              content: '❌ Nenhuma informação anterior encontrada. Reenvie o comando.',
              ephemeral: true
            });
          }

          const { urlRecord } = userData;




      const userIdNotFormat = interaction.user.id;

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/employment/search_relation/'+userIdNotFormat+'/'+"811713890", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },        
        });

       if (!response.ok) {
          const errorText = await response.json();
          console.log("🚀 ~ errorText:", errorText);
          return interaction.editReply(`❌ Erro ${errorText.message}`);
        }

         
     const data = await response.json();

              // Salva ambos no Map para uso depois do modal
          userMultaData.set(interaction.user.id, {
            NPF:data.NPF,
            urlRecord,        
          });

          const TrafficViolationDescriptions = {
                    SPEEDING: "Excesso de velocidade",
                    STREET_RACING: "Racha ilegal",
                    RUNNING_RED_LIGHT: "Avançar sinal vermelho",
                    FAILURE_TO_OBEY_SIGNS: "Ignorar sinalização",
                    FAILURE_TO_YIELD_PEDESTRIANS: "Não dar preferência ao pedestre",
                    DRIVING_WITHOUT_LICENSE: "Sem habilitação",
                    EXPIRED_VEHICLE_REGISTRATION: "Licenciamento vencido",
                    DRIVING_WITHOUT_PLATES: "Sem placas",
                    DUI_DWI: "Álcool ou drogas",
                    TEXTING_WHILE_DRIVING: "Celular ao volante",
                    RECKLESS_DRIVING: "Direção perigosa",
                    ILLEGAL_PARKING: "Estacionamento proibido",
                    PARKING_DISABLED_SPOT: "Vaga deficiente sem autorização",
                    PARKING_FIRE_HYDRANT: "Hidrante bloqueado",
                  };

                  const select = new StringSelectMenuBuilder()
                  .setCustomId('selecionar_infracao')
                  .setPlaceholder('Escolha a infração...')
                  .addOptions(
                    Object.entries(TrafficViolationDescriptions).map(([value, label]) => ({
                      label,
                      value,
                    }))
                  );

                const row = new ActionRowBuilder().addComponents(select);


                  await interaction.editReply({
                    content: 'Selecione a infração cometida:',
                    components: [row],
                    
                  });
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar buscar o usuário.');
        }

    }