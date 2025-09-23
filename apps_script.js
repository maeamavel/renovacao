function doGet(e) {
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configurações");
  
  // Lê todas as informações da planilha de configurações
  const status = configSheet.getRange("B9").getValue().toLowerCase();
  const message = configSheet.getRange("B10").getValue();
  const title = configSheet.getRange("B1").getValue();
  const links = configSheet.getRange("B2:B8").getValues().flat();
  const observacao = configSheet.getRange("B11").getValue(); // Novo campo
  const imageUrl = configSheet.getRange("B12").getValue(); // Novo campo
  
  return ContentService.createTextOutput(JSON.stringify({
    status: status,
    message: message,
    title: title,
    whatsappLinks: links,
    observacao: observacao, // Retorna a observação
    imageUrl: imageUrl // Retorna a URL da imagem
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Página1");
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Configurações");
  
  // Lê o ID do Retiro da planilha de Configurações
  const idRetiro = configSheet.getRange("B13").getValue();

  // Condição para garantir que os campos obrigatórios foram preenchidos
  if (e.parameter.nome && e.parameter.email && e.parameter.telefone && e.parameter.pais) {
    const lastRow = sheet.getLastRow();
    const groupIndex = (lastRow - 1) % 7; 
    const selectedLink = configSheet.getRange(groupIndex + 2, 2).getValue();
    
    // Cria a nova linha com todos os dados do formulário, incluindo o ID do Retiro
    const newRow = [
      new Date(), // Timestamp de envio
      e.parameter.nome,
      e.parameter.email,
      e.parameter.pais, 
      e.parameter.estado, 
      e.parameter.cidade, 
      e.parameter.telefone,
      e.parameter.anoConsagracao, 
      e.parameter.consentimento, // Novo campo
      `Grupo ${groupIndex + 1}`, // Nome do grupo
      idRetiro // ID do Retiro
    ];
    
    // Adiciona a nova linha com todos os dados na planilha
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      status: 'Dados recebidos e grupo selecionado com sucesso.',
      whatsappLink: selectedLink
    }));
  } else {
    // Se algum dado obrigatório estiver faltando, retorna um erro
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      status: 'Dados do formulário ausentes.'
    }));
  }
}