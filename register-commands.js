import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [

  new SlashCommandBuilder()
    .setName('transito-registrar_multa')
    .setDescription('Realiza o registro de uma infração de transito')
       .addAttachmentOption(opt =>
      opt.setName('imagem')
         .setDescription('Registro_ocorrencia')
         .setRequired(true)
    ),  


  new SlashCommandBuilder()
    .setName('registrar_usuario')
    .setDescription('Registra um MEMBRO na BASE.')
    .addStringOption(opt =>
      opt.setName('id_discord')
         .setDescription('Texto para verificar')
         .setRequired(true)
    )
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
    .setName('registrar_emprego')
    .setDescription('Registra um MEMBRO na BASE.')
    .addStringOption(opt =>
      opt.setName('npf')
         .setDescription('Funcionario')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('inpf')
         .setDescription('empresa')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('position')
         .setDescription('Funcao')
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
    .setName('transito_registrar_veiculo')
    .setDescription('Realiza o registro de um veiculo para um personagem no RP.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem PERFIL do personagem')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('npf_proprietario')
         .setDescription('personagem proprietario')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('serie_modelo')
         .setDescription('codigo do modelo de veiculo')
         .setRequired(true)
    )
        .addStringOption(opt =>
      opt.setName('placa')
         .setDescription('sobrenome')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('prefixo')
         .setDescription('Prefixo de Frota')
         .setRequired(false)
    ),

     new SlashCommandBuilder()
    .setName('obter_personagem')
    .setDescription('Obtém informações de um personagem registrado.')
    .addStringOption(opt =>
      opt.setName('npf')
         .setDescription('NPF do personagem')
         .setRequired(true)
    )  ,

         new SlashCommandBuilder()
      .setName('obter_profissao_personagem')
      .setDescription('Obtém informações de profissao de um personagem.')
      .addStringOption(opt =>
        opt.setName('npf')
          .setDescription('NPF do personagem')
          .setRequired(true)
      )  ,

      
         new SlashCommandBuilder()
      .setName('obter_ficha_criminal_personagem')
      .setDescription('Obtém certidao negativa de um personagem.')
      .addStringOption(opt =>
        opt.setName('npf')
          .setDescription('NPF do personagem')
          .setRequired(true)
      )  ,

    
    new SlashCommandBuilder()
    .setName('registrar_empresa')
    .setDescription('Realiza o registro de uma empresa no RP.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem LOGO da empresa')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('proprietario')
         .setDescription('usuario a ser linkado como dono')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('rasao_social')
         .setDescription('razao social da empresa')
         .setRequired(true)
    )
        .addBooleanOption(opt =>
      opt.setName('orgao_publico')
         .setDescription('empresa é órgão público?')
         .setRequired(true)
    )   ,


     new SlashCommandBuilder()
    .setName('registrar_crime')
    .setDescription('Realiza o registro de uma prisao/detencao no RP.')
    .addAttachmentOption(opt =>
      opt.setName('arquivo')
         .setDescription('Imagem da detencao/prisao')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('usuario_infrator')
         .setDescription('usuario a ser linkado como infrator')
         .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('autoridade_registrante')
         .setDescription('autoridade registrante')
         .setRequired(true)
    )
        .addStringOption(opt =>
      opt.setName('descricao_da_infracao')
         .setDescription('Descricao da infracao (Artigos enquadrados)')
         .setRequired(true)
         
    )   
        .addNumberOption(opt =>
      opt.setName('valor_fiança')
         .setDescription('Valor afiançavel')
         .setRequired(true)
         
    )  
        .addNumberOption(opt =>
      opt.setName('tempo_detencao')
         .setDescription('Tempo de detencao')
         .setRequired(true)
         
    )  
        .addBooleanOption(opt =>
      opt.setName('fiança_paga')
         .setDescription('Registro de pagamento da fiaça e liberacao')
         .setRequired(true)
         
    )  ,

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