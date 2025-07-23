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
    export default async function formularioInfracao(interaction,client) {
         const userData = userMultaData.get(interaction.user.id);
        
              if (!userData) {
                return interaction.reply({
                  content: '❌ Não foi possível recuperar os dados anteriores. Reenvie o comando.',
                  ephemeral: true
                });
              }
        
              // Recupera os dados anteriores + inputs do modal
              const { urlRecord, selectedViolation, NPF } = userData;
              const vehicleID = interaction.fields.getTextInputValue('placa_veiculo');
              const descriptionSituation = interaction.fields.getTextInputValue('observacoes');
        
        
        
              // Agora você pode salvar ou enviar tudo junto
              console.log({ urlRecord, selectedViolation, vehicleID, descriptionSituation });
        
              await interaction.deferReply({ ephemeral: true });
        
              try {
                const response = await fetch(process.env.SERVER+'/traffic-tickets', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    vehicleID,
                    trafficViolation : selectedViolation,
                    descriptionSituation,
                    authorRecordNPF : NPF,
                    urlImage : urlRecord,
                  })
                });
        
                  if (!response.ok) {
                    const errorText = await response.text();
                    console.log("🚀 ~ errorText:", errorText)
                    return interaction.editReply(`❌ Erro ao criar Empresa: ${errorText}`);
                  }
        
                  const data = await response.json();
                
              // 3) Envia no canal desejado:
                const TARGET_CHANNEL_ID = process.env.REGISTER_TICKET;  
        
                const stringName = "REGISTRO DE INFRACAO PLACA" + data.vehicle.plate
                const embed = new EmbedBuilder()
                  .setTitle(stringName.toUpperCase())
                  .setDescription("TIPO DE INFRACAO: "+ data.trafficViolation +"\n"+"PLACA DO VEICULO" + data.vehicle.plate +"\n" + "DESCRIÇÃO OCORRENCIA" + data.descriptionSituation +"\n" + "CUSTO: R$" + data.coast )
                  .setImage(data.urlImage)
                  .setColor(0xFFA500)
                  .setTimestamp();
        
                    // Limpa o map para evitar conflitos
              userMultaData.delete(interaction.user.id);
        
                  return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
                } catch (err) {
                  console.error(err);
                  return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
                }
        
        
       
    }