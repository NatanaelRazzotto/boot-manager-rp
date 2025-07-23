
      export default async function obterFichaCriminalPersonagem(interaction) {
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
