const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('registrar_usuario')
    .setDescription('Verifica uma informação textual.')
    .addStringOption(opt =>
      opt.setName('nick_discord')
         .setDescription('Texto para verificar')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('name_server')
         .setDescription('Texto para verificar')
         .setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName('registrar_personagem')
    .setDescription('Realiza o registro de um personagem no RP.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem PERFIL do personagem')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('usuario')
         .setDescription('usuario a ser linkado')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('primeiro_nome')
         .setDescription('primeiro_nome')
         .setRequired(true)
    )
        .addStringOption(opt =>
      opt.setName('sobrenome')
         .setDescription('sobrenome')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('data_nascimento')
         .setDescription('Nascimento do personagem')
         .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('postmensagem')
    .setDescription('Posta um embed de imagem em canal específico.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem para analisar')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('titulo')
         .setDescription('Título para o embed')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('descricao')
         .setDescription('Descrição para o embed')
         .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('imagem')
    .setDescription('Envia uma imagem para análise no mesmo canal.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem para analisar')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('titulo')
         .setDescription('Título para o embed')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('descricao')
         .setDescription('Descrição para o embed')
         .setRequired(false)
    ),
].map(cmd => cmd.toJSON());  // importante converter para JSON


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('📡 Registrando comandos...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUID_ID), // Para testes
      // Routes.applicationCommands(CLIENT_ID), // Para uso global
      { body: commands }
    );

    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();