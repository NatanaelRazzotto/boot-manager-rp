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
  TextInputStyle,             // ✅
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(); 
import http from 'http';


import { generate_EmbedCode } from './utils/utilitys.js';


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
// …imports e client já configurados…

const userMultaData = new Map(); // fora do listener!

client.once('ready', () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.inGuild()) {
    return interaction.reply({
      content: '❌ Este comando só pode ser usado em servidores.',
      ephemeral: true
    });
  }

  const member = interaction.member;

  const allowedRoleId = process.env.PERMISSIONS; // ID do cargo permitido

  if (!member.roles.cache.has(allowedRoleId)) {
    return interaction.reply({
      content: '❌ Você não possui o cargo necessário para usar este comando.',
      ephemeral: true
    });
  }

   // 📌 SLASH COMMAND
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'transito-registrar_multa') {

        const attachment = interaction.options.getAttachment('imagem');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

      const urlRecord = attachment.url;
      userMultaData.set(interaction.user.id, { urlRecord });

      const button1 = new ButtonBuilder()
        .setCustomId('bprv_registrar')
        .setLabel('BPRv REGISTRO')
        .setStyle(ButtonStyle.Primary);

      const button2 = new ButtonBuilder()
        .setCustomId('DER_registro')
        .setLabel('DER REGISTRO')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button1, button2);

      await interaction.reply({
        content: 'Selecione a CORPORAÇÃO AUTUADORA (Apenas servidores públicos):',
        components: [row],
        ephemeral: true
      });

     
    }

    if (interaction.commandName === 'obter_ficha_criminal_personagem') {
      const npf = interaction.options.getString('npf');
      const userIdNotFormat = interaction.user.id;

      await interaction.deferReply({ ephemeral: true });

      try {
      const response = await fetch(process.env.SERVER+'/criminal-record/history-criminal/'+userIdNotFormat+'/'+npf, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },        
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.log("🚀 ~ errorText:", errorText)
          return interaction.editReply(`❌ Erro ao criar usuário: ${errorText}`);
        }

          const data = await response.json();
          console.log(data)
          return interaction.editReply(`✅ Usuário buscado com sucesso`);
      } catch (err) {
        console.error(err);
        return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
      }

      }

    if (interaction.commandName === 'registrar_usuario') {
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

       if (interaction.commandName === 'registrar_emprego') {

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


    if (interaction.commandName === 'registrar_personagem') {

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

       if (interaction.commandName === 'transito-registrar_veiculo') {

        const attachment = interaction.options.getAttachment('arquivo');
        
        if (!attachment || !attachment.contentType?.startsWith('image/')) {
          return interaction.reply({
            content: '❌ Por favor envie um arquivo de imagem válido.',
            ephemeral: true
          });
        }

        // const userIdNotFormat = interaction.options.getString('usuario');
        // const userIdDiscord = userIdNotFormat?.replace(/[<@>]/g, '');

        const bodyworkSerial = interaction.options.getString('serie_modelo');
        const ownerNPF = interaction.options.getString('npf_proprietario');
      
        const plate = interaction.options.getString('placa');
        const serialNumber = interaction.options.getString('prefixo');
        const urlImage = attachment.url

      await interaction.deferReply({ ephemeral: true });

      try {
        const response = await fetch(process.env.SERVER+'/vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bodyworkSerial,
            plate,
            ownerNPF,
            serialNumber,
            urlImage
          })
        });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("🚀 ~ errorText:", errorText)
          
            return interaction.editReply(`❌ Erro ao criar veiculo: ${errorText}`);
          }

          const data = await response.json();
          console.log(data)

          const TARGET_CHANNEL_ID = process.env.REGISTER_VEHICLE;  

          const stringName = "VEICULO DE PLACA: " + data.plate
            const embed = new EmbedBuilder()
              .setTitle(stringName.toUpperCase())
              .setDescription("VEICULO DE PLACA: " + data.plate )
              .setImage(data.urlImage)
              .setColor(0xFFA500)
              .setTimestamp();

          return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
          
      } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }
      }

      if (interaction.commandName === 'registrar_empresa') {

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

    if (interaction.commandName === 'registrar_crime') {

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

      // ---- /verificar ----
      if (interaction.commandName === 'verificar_info') {
        const info = interaction.options.getString('texto');
        return interaction.reply(`🔍 Verificando: **${info}**`);
      }

      // ---- /imagem ----
      if (interaction.commandName === 'imagem') {
        // pega o attachment enviado no comando
        const title = interaction.options.getString('titulo');
        const description = interaction.options.getString('descricao');
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

      if (interaction.commandName === 'postmensagem') {
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



  }

    // 📌 BOTÃO
  if (interaction.isButton()) {


   if (interaction.customId === 'bprv_registrar') {


              const userData = userMultaData.get(interaction.user.id);

          if (!userData) {
            return interaction.reply({
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

     console.log("teste")

       

     }
  }

  // 📌 Modal
  if (interaction.isModalSubmit() ) {
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
        
          // // 3) Envia no canal desejado:
          // const TARGET_CHANNEL_ID = process.env.REGISTER_COMPANY;  

          // const stringName = data.companyName
          //   const embed = new EmbedBuilder()
          //     .setTitle(stringName.toUpperCase())
          //     .setDescription("NOME DA COMPANHIA: "+ data.companyName +"\n"+"INPJ - (Indice Numerico de Pessoa Juridica):" + data.INPJ +"\n" + "USUARIO DISCORD: @" + data.person.user.nickname )
          //     .setImage(data.person.urlImage)
          //     .setColor(0xFFA500)
          //     .setTimestamp();

          //     return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
        } catch (err) {
          console.error(err);
          return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
        }


      await interaction.reply({
        content: `✅ Multa registrada:\n• Infração: ${selectedViolation}\n• Placa: ${placa}`,
        ephemeral: true
      });

      // Limpa o map para evitar conflitos
      userMultaData.delete(interaction.user.id);

  }

    // 📌 SELECT MENU
  if (interaction.isStringSelectMenu()) {

    if (interaction.customId === 'selecionar_infracao') {

      const userData = userMultaData.get(interaction.user.id);

      if (!userData) {
        return interaction.reply({
          content: '❌ Nenhuma informação anterior encontrada. Reenvie o comando.',
          ephemeral: true
        });
      }

      const { urlRecord , NPF} = userData;


    const selected = interaction.values[0];

        // Salva ambos no Map para uso depois do modal
    userMultaData.set(interaction.user.id, {
      NPF,
      urlRecord,
      selectedViolation: selected
    });

    // Cria um modal
    const modal = new ModalBuilder()
      .setCustomId('formulario_infracao')
      .setTitle('Detalhes da infração');

    //     // Campo de texto 1: placa
    // const idInput = new TextInputBuilder()
    //   .setCustomId('autor_NPF')
    //   .setLabel('NPF do registrante')
    //   .setStyle(TextInputStyle.Short)
    //   .setRequired(true);

        // Campo de texto 1: placa
    const placaInput = new TextInputBuilder()
      .setCustomId('placa_veiculo')
      .setLabel('Placa do veículo')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    // Campo de texto 2: observações
    const observacaoInput = new TextInputBuilder()
      .setCustomId('observacoes')
      .setLabel('Observações adicionais')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    // Adiciona campos ao modal
    const firstRow = new ActionRowBuilder().addComponents(placaInput);
    const secondRow = new ActionRowBuilder().addComponents(observacaoInput);

    modal.addComponents(firstRow, secondRow);

    // Mostra o modal para o usuário
    return interaction.showModal(modal);
  }

  }
    

 

});

// Se quiser manter listener de MessageCreate, tudo bem, mas não é mais necessário
// client.on(Events.MessageCreate, async message => { … });

client.login(process.env.TOKEN);

// server http (opcional)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot está rodando!');
}).listen(process.env.PORT || 3000);
