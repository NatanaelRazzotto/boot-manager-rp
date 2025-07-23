    export default async function registrarVeiculo(interaction) {
        
                const attachment = interaction.options.getAttachment('arquivo');
                
                if (!attachment || !attachment.contentType?.startsWith('image/')) {
                  return interaction.reply({
                    content: '❌ Por favor envie um arquivo de imagem válido.',
                    ephemeral: true
                  });
                }
        
                // const userIdNotFormat = interaction.options.getString('usuario');
                // const userIdDiscord = userIdNotFormat?.replace(/[<@>]/g, '');
        
                const bodyworkSerial = interaction.options.getString('serie_modelo');
                const ownerNPF = interaction.options.getString('npf_proprietario');
              
                const plate = interaction.options.getString('placa');
                const serialNumber = interaction.options.getString('prefixo');
                const urlImage = attachment.url
        
              await interaction.deferReply({ ephemeral: true });
        
              try {
                const response = await fetch(process.env.SERVER+'/vehicle', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    bodyworkSerial,
                    plate,
                    ownerNPF,
                    serialNumber,
                    urlImage
                  })
                });
        
                  if (!response.ok) {
                    const errorText = await response.text();
                    console.log("🚀 ~ errorText:", errorText)
                  
                    return interaction.editReply(`❌ Erro ao criar veiculo: ${errorText}`);
                  }
        
                  const data = await response.json();
                  console.log(data)
        
                  const TARGET_CHANNEL_ID = process.env.REGISTER_VEHICLE;  
        
                  const stringName = "VEICULO DE PLACA: " + data.plate
                    const embed = new EmbedBuilder()
                      .setTitle(stringName.toUpperCase())
                      .setDescription("VEICULO DE PLACA: " + data.plate +"\n" + "MODELO: " + data.bodywork.nameModel +"\n" + "CATEGORIA: " + data.operatingCategory  +"\n" + "PROPRIETARIO: " + data.ownerID  )
                      .setImage(data.urlImage)
                      .setColor(0xFFA500)
                      .setTimestamp();
        
                  return await generate_EmbedCode(embed,TARGET_CHANNEL_ID, client, interaction);
                  
              } catch (err) {
                  console.error(err);
                  return interaction.editReply('❌ Ocorreu um erro ao tentar criar o usuário.');
                }
              }