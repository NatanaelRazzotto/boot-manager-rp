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
import dotenv from 'dotenv';
import http from 'http'

import handleInteraction from './src/events/interactionCreate.js';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const userMultaData = new Map();

client.once('ready', () => console.log(`✅ Bot iniciado como ${client.user.tag}`));
client.on(Events.InteractionCreate, interaction => handleInteraction(interaction, client, userMultaData));

client.login(process.env.TOKEN);

// HTTP server opcional
http.createServer((_, res) => {
  res.writeHead(200);
  res.end('Bot está rodando!');
}).listen(process.env.PORT || 3000);
