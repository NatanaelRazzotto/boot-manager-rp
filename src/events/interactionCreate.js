// src/events/interactionCreate.js
import registrarUsuario from '../commands/people/registrar_usuario.js';
import registrarMulta from '../commands/transito/registrar_multa.js';
// ... outros imports

export default async function handleInteraction(interaction, client, userMultaData) {
  if (!interaction.inGuild()) return interaction.reply({ content: '❌ Só em servidores.', ephemeral: true });

  const member = interaction.member;
  const allowedRoleId = process.env.PERMISSIONS;
  if (!member.roles.cache.has(allowedRoleId)) return interaction.reply({ content: '❌ Sem permissão.', ephemeral: true });

  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;

    const commands = {
      registrar_usuario: registrarUsuario,
      transito_registrar_multa: registrarMulta,
      // ... outros
    };

    const command = commands[commandName];
    if (command) return command(interaction, client, userMultaData);
  }

  // Lidadores de buttons, modals e selects seguem lógica similar

     // 📌 BOTÃO
  if (interaction.isButton()) {


  
  }

  // 📌 Modal
  if (interaction.isModalSubmit() ) {
    

    

  }

    // 📌 SELECT MENU
  if (interaction.isStringSelectMenu()) {


  }
}
