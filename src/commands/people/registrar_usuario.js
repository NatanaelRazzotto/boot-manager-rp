
        export default async function registrarUsuario(interaction) {
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