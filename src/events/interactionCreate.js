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
import obterFichaCriminalPersonagem from '../commands/criminal/obter_ficha_criminal_personagem.js';
import registrarCrime from '../commands/criminal/registrar_crime.js';
import registrarEmprego from '../commands/employment/registrar_emprego.js';
import registrarEmpresa from '../commands/people/registrar_empresa.js';
import registrarPersonagem from '../commands/people/registrar_personagem.js';
import registrarUsuario from '../commands/people/registrar_usuario.js';
import imagemPost from '../commands/staff/imagem.js';
import postMensagem from '../commands/staff/post_mensagem.js'

import verificarInfo from '../commands/staff/verificar_info.js';
import registrarMulta from '../commands/transito/registrar_multa.js';
import registrarVeiculo from '../commands/transito/registrar_veiculo.js';
import bprvRegistrar from '../interactions/buttons/bprv_registrar.js';
import formularioInfracao from '../interactions/modals/formulario_infracao.js';
import selecionarInfracao from '../interactions/selectMenus/selecionar_infracao.js';
// ... outros imports

export default async function handleInteraction(interaction, client, userMultaData) {
  console.log("entrou no tratamento")

  const restrictedStaffCommands = [
  'registrar_crime',
  'registrar_emprego',
  'registrar_empresa',
  'registrar_personagem',
  'registrar_usuario',
  'transito_registrar_multa',
  'transito_registrar_veiculo',
  'imagem',
  'postmensagem',
  'verificar_info'
];

  const restrictedOfficerCommands = [
  'registrar_crime',
  'transito_registrar_multa',
   'transito_registrar_veiculo'
];


  if (!interaction.inGuild()) return interaction.reply({ content: '❌ Só em servidores.', ephemeral: true });

  // const member = interaction.member;
  // const allowedRoleId = process.env.PERMISSIONS;
  // if (!member.roles.cache.has(allowedRoleId)) return interaction.reply({ content: '❌ Sem permissão.', ephemeral: true });

  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

        // Verifica permissão SOMENTE para os comandos restritos
    if (restrictedStaffCommands.includes(commandName)) {
      const member = interaction.member;
      const allowedRoleId = process.env.PERMISSIONS;

      if (!member.roles.cache.has(allowedRoleId)) {
        return interaction.reply({ content: '❌ Sem permissão para este comando.', ephemeral: true });
      }
    }

            // Verifica permissão SOMENTE para os comandos restritos
    if (restrictedOfficerCommands.includes(commandName)) {
      const member = interaction.member;
      const allowedMilitarRoleId = process.env.PERMISSIONS_MILITAR;
      const allowedCivilRoleId = process.env.PERMISSIONS_CIVIL;

      if (!member.roles.cache.has(allowedMilitarRoleId)||!member.roles.cache.has(allowedCivilRoleId)) {
        return interaction.reply({ content: '❌ Você não esta em uma força policial para executar este comando.', ephemeral: true });
      }
    }

    const commands = {
        obter_ficha_criminal_personagem: obterFichaCriminalPersonagem,
        registrar_crime: registrarCrime,
        registrar_emprego : registrarEmprego,
        registrar_empresa : registrarEmpresa,
        registrar_personagem: registrarPersonagem,        
        registrar_usuario: registrarUsuario,
        transito_registrar_multa: registrarMulta,
        transito_registrar_veiculo : registrarVeiculo,
        imagem :  imagemPost,
        postmensagem: postMensagem,
        verificar_info: verificarInfo
      // ... outros
    };

    const command = commands[commandName];
     console.log("entrou no  de slash")
     console.log("Command recebido:", commandName);
    console.log("Comandos disponíveis:", Object.keys(commands));

    if (command)
    {
       console.log("selecionado no  de slash")
      return await command(interaction, client, userMultaData);
    }
     
  }

  // Lidadores de buttons, modals e selects seguem lógica similar

     // 📌 BOTÃO
  if (interaction.isButton()) {
    const { commandName } = interaction;

    const commandsButton = {
        bprv_registrar: bprvRegistrar, 
    };

     const command = commandsButton[commandName];
     console.log("entrou no  de slash")
      console.log("Command recebido:", commandName);
      console.log("Comandos disponíveis:", Object.keys(commandsButton));

      if (command)
      {
        console.log("selecionado no  de slash")
        return await command(interaction, client, userMultaData);
      }

  
  }

  // 📌 Modal
  if (interaction.isModalSubmit() ) {
    const { commandName } = interaction;

    const commandsModal = {
        formulario_infracao: formularioInfracao, 
    };

     const command = commandsModal[commandName];
     console.log("entrou no  de slash")
      console.log("Command recebido:", commandName);
      console.log("Comandos disponíveis:", Object.keys(commandsModal));

      if (command)
      {
        console.log("selecionado no  de slash")
        return await command(interaction, client, userMultaData);
      }

    

  }

    // 📌 SELECT MENU
  if (interaction.isStringSelectMenu()) {
    const { commandName } = interaction;

    const commandsSelect = {
        selecionar_infracao: selecionarInfracao, 
    };

     const command = commandsSelect[commandName];
     console.log("entrou no  de slash")
      console.log("Command recebido:", commandName);
      console.log("Comandos disponíveis:", Object.keys(commandsSelect));

      if (command)
      {
        console.log("selecionado no  de slash")
        return await command(interaction, client, userMultaData);
      }

  }
}
