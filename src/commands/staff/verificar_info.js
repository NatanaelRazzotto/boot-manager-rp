  // ---- /verificar ----
      export default async function verificarInfo(interaction) {

        const info = interaction.options.getString('texto');
        return interaction.reply(`🔍 Verificando: **${info}**`);
      }