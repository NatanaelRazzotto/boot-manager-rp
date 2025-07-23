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
  // ---- /verificar ----
      export default async function verificarInfo(interaction,client) {

        const info = interaction.options.getString('texto');
        return interaction.reply(`🔍 Verificando: **${info}**`);
      }