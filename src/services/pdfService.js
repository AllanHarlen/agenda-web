import jsPDF from 'jspdf'

export const generateAdesaoPDF = (formData) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let y = 20

  // Helper function to add text with word wrap
  const addText = (text, x, yPos, fontSize = 10, isBold = false) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.text(text, x, yPos)
  }

  // Helper to format date
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR')
  }

  // Header - Logo and Title
  addText('ASPJ-PE', pageWidth / 2, y, 16, true)
  y += 7
  addText('Associação dos Servidores do Poder Judiciário do Estado de Pernambuco', pageWidth / 2, y, 10)
  y += 15

  // Document Title
  doc.setFillColor(34, 92, 90)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 10, 'F')
  doc.setTextColor(255, 255, 255)
  addText('PROPOSTA DE ADESÃO DO SERVIDOR', pageWidth / 2, y + 2, 12, true)
  doc.setTextColor(0, 0, 0)
  y += 15

  // Tipo de Cadastro
  addText('Tipo de Cadastro:', margin, y, 10, true)
  y += 6
  addText(`☐ 01 - CADASTRAMENTO ${formData.tipoCadastro === '01' ? '☑' : ''}`, margin, y)
  addText(`☐ 02 - RECADASTRAMENTO ${formData.tipoCadastro === '02' ? '☑' : ''}`, margin + 70, y)
  y += 6
  addText(`☐ A - ATIVO ${formData.situacao === 'A' ? '☑' : ''}`, margin, y)
  addText(`☐ B - INATIVO ${formData.situacao === 'B' ? '☑' : ''}`, margin + 70, y)
  addText(`Matrícula Nº: ${formData.matricula || '_________________'}`, margin + 140, y)
  y += 12

  // Section: Dados Pessoais
  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('DADOS PESSOAIS - PREENCHA EM LETRA DE FORMA', margin + 2, y + 1, 10, true)
  y += 10

  addText('Nome:', margin, y, 10, true)
  addText(formData.nome || '_______________________________________________', margin + 15, y)
  y += 8

  addText('RG Nº:', margin, y, 10, true)
  addText(formData.rg || '__________________', margin + 15, y)
  addText('CPF:', margin + 80, y, 10, true)
  addText(formData.cpf || '__________________', margin + 95, y)
  y += 8

  addText('Data Nasc.:', margin, y, 10, true)
  addText(formatDate(formData.dataNascimento) || '__________', margin + 25, y)
  addText('Estado Civil:', margin + 80, y, 10, true)
  addText(formData.estadoCivil || '______________', margin + 108, y)
  y += 10

  addText('Nacionalidade:', margin, y, 10, true)
  addText(formData.nacionalidade || '_______________', margin + 30, y)
  addText('Naturalidade:', margin + 100, y, 10, true)
  addText(`${formData.naturalidadeCidade || '________'} - ${formData.naturalidadeUf || '__'}`, margin + 130, y)
  y += 12

  // Section: Endereço
  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('ENDEREÇO', margin + 2, y + 1, 10, true)
  y += 10

  addText('Endereço:', margin, y, 10, true)
  addText(formData.endereco || '___________________________________________________', margin + 23, y)
  y += 8

  addText('Bairro:', margin, y, 10, true)
  addText(formData.bairro || '_______________________', margin + 18, y)
  addText('BL/APTº/ANDAR:', margin + 100, y, 10, true)
  addText(formData.complemento || '__________', margin + 138, y)
  y += 8

  addText('Cidade/UF:', margin, y, 10, true)
  addText(formData.cidade || '____________________', margin + 25, y)
  addText('CEP:', margin + 100, y, 10, true)
  addText(formData.cep || '___________', margin + 115, y)
  y += 12

  // Section: Filiação
  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('FILIAÇÃO', margin + 2, y + 1, 10, true)
  y += 10

  addText('Pai:', margin, y, 10, true)
  addText(formData.filiacaoPai || '___________________________________________________', margin + 13, y)
  y += 8

  addText('Mãe:', margin, y, 10, true)
  addText(formData.filiacaoMae || '___________________________________________________', margin + 15, y)
  y += 12

  // Section: Contato e Dados Profissionais
  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('CONTATO E DADOS PROFISSIONAIS', margin + 2, y + 1, 10, true)
  y += 10

  addText('Telefone:', margin, y, 10, true)
  addText(formData.telefoneResidencial || '__________________', margin + 22, y)
  addText('Cargo:', margin + 100, y, 10, true)
  addText(formData.cargo || '___________________', margin + 118, y)
  y += 8

  addText('Comarca:', margin, y, 10, true)
  addText(formData.comarca || '____________________', margin + 23, y)
  addText('Setor:', margin + 100, y, 10, true)
  addText(formData.setor || '___________________', margin + 115, y)
  y += 8

  addText('Data de Admissão:', margin, y, 10, true)
  addText(formatDate(formData.dataAdmissao) || '__________', margin + 38, y)
  addText('E-mail:', margin + 100, y, 10, true)
  addText(formData.email || '___________________', margin + 118, y)
  y += 12

  // Check if we need a new page
  if (y > pageHeight - 80) {
    doc.addPage()
    y = 20
  }

  // Section: Autorização
  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('AUTORIZAÇÃO', margin + 2, y + 1, 10, true)
  y += 10

  const authText = [
    'Autorizo o desconto nos meus vencimentos referente à contribuição social em favor da',
    'ASPJ-PE (Associação dos Servidores do Poder Judiciário do Estado de PE).',
    '',
    'Ciente de que da desvinculação com esta entidade perderei todas as vantagens',
    'inerentes à condição de sócio.'
  ]

  authText.forEach(line => {
    addText(line, margin + 5, y)
    y += 5
  })

  y += 10

  const today = new Date()
  addText(`Recife, ${today.getDate()} de ${today.toLocaleDateString('pt-BR', { month: 'long' })} de ${today.getFullYear()}.`, margin, y)
  y += 15

  addText('_________________________________________', pageWidth / 2 - 40, y)
  y += 5
  addText('Assinatura do Associado(a)', pageWidth / 2 - 30, y)
  y += 15

  // Section: Dependentes
  if (y > pageHeight - 60) {
    doc.addPage()
    y = 20
  }

  doc.setFillColor(200, 200, 200)
  doc.rect(margin, y - 5, pageWidth - 2 * margin, 8, 'F')
  addText('RELAÇÃO DE DEPENDENTES', margin + 2, y + 1, 10, true)
  y += 10

  formData.dependentes.forEach((dep, index) => {
    if (dep.nome || dep.grauParentesco || dep.dataNascimento) {
      addText(`${String(index + 1).padStart(2, '0')} - Nome:`, margin, y, 9, true)
      addText(dep.nome || '___________________________', margin + 20, y, 9)
      y += 5
      addText('Grau de Parentesco:', margin + 10, y, 9, true)
      addText(dep.grauParentesco || '______________', margin + 50, y, 9)
      addText('Data Nasc.:', margin + 110, y, 9, true)
      addText(formatDate(dep.dataNascimento) || '__________', margin + 135, y, 9)
      y += 8
    }
  })

  // Footer
  y = pageHeight - 20
  doc.setFontSize(8)
  addText('www.aspj-pe.org.br - e-mail: aspj@aspj-pe.org.br', pageWidth / 2, y, 8)
  y += 4
  addText('Avenida Guararapes, 120 - Edf Conde da Boa Vista - 4º Andar', pageWidth / 2, y, 8)
  y += 4
  addText('Santo Antônio - Recife - PE - CEP 50010-000', pageWidth / 2, y, 8)
  y += 4
  addText('Tel.: (81) 3424.7677 - 3224.9789 - Fax: 3424.6968', pageWidth / 2, y, 8)

  // Center all text
  doc.setProperties({
    title: 'Proposta de Adesão - ASPJ-PE',
    subject: 'Formulário de Adesão',
    author: 'ASPJ-PE',
    creator: 'ASPJ-PE Sistema'
  })

  return doc
}

export const downloadAdesaoPDF = (formData, filename = 'proposta-adesao-aspj-pe.pdf') => {
  const doc = generateAdesaoPDF(formData)
  doc.save(filename)
}
