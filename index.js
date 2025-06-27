const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  MessageFlags,
  EmbedBuilder      
} = require('discord.js');

require('dotenv').config();

const http = require('http');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
// …imports e client já configurados…

client.once('ready', () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

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

 if (interaction.commandName === 'registrar_usuario') {
  const userIdNotFormat = interaction.options.getString('nick_discord');
  const idDiscord = userIdNotFormat?.replace(/[<@>]/g, '');
  const nickname = "user"
  const nameServer = interaction.options.getString('name_server');
  const userType = 'PLAYER';

  await interaction.deferReply({ ephemeral: true });

  try {
    const response = await fetch('http://localhost:4000/user', {
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
    const response = await fetch('http://localhost:4000/pessoa-fisica', {
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
      return interaction.editReply(`✅ Usuário criado com sucesso: ${data.name}`);
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

});

// Se quiser manter listener de MessageCreate, tudo bem, mas não é mais necessário
// client.on(Events.MessageCreate, async message => { … });

client.login(process.env.TOKEN);

// server http (opcional)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot está rodando!');
}).listen(process.env.PORT || 3000);
