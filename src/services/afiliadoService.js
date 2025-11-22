import api from './api'

export const afiliadoService = {
  // Lista todos os afiliados
  async getAll() {
    const response = await api.get('Afiliado/ListarTodosAfiliados')
    return response.data
  },

  // Lista afiliados paginados
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Nome', orderByProperty = 'Codg', isAscending = true, searchterm = '' } = {}) {
    const response = await api.get('Afiliado/ListarAfiliadosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending, searchTerm: searchterm }
    })
    return response.data
  },

  // Busca por id
  async getById(id) {
    const response = await api.get(`Afiliado/${id}`)
    return response.data
  },

  // Cria afiliado
  async create(afiliado) {
    const payload = {
      Nome: afiliado?.Nome ?? afiliado?.nome,
      Email: afiliado?.Email ?? afiliado?.email,
      Telefone: afiliado?.Telefone ?? afiliado?.telefone,
      CPF: afiliado?.CPF ?? afiliado?.cpf,
      DataNascimento: afiliado?.DataNascimento ?? afiliado?.dataNascimento,
      Endereco: afiliado?.Endereco ?? afiliado?.endereco,
      Cidade: afiliado?.Cidade ?? afiliado?.cidade,
      Estado: afiliado?.Estado ?? afiliado?.estado,
      CEP: afiliado?.CEP ?? afiliado?.cep,
      DataAfiliacao: afiliado?.DataAfiliacao ?? afiliado?.dataAfiliacao,
      Status: afiliado?.Status ?? afiliado?.status ?? 'Ativo'
    }
    const response = await api.post('Afiliado', payload)
    return response.data
  },

  // Atualiza afiliado
  async update(id, afiliado) {
    const payload = {
      Nome: afiliado?.Nome ?? afiliado?.nome,
      Email: afiliado?.Email ?? afiliado?.email,
      Telefone: afiliado?.Telefone ?? afiliado?.telefone,
      CPF: afiliado?.CPF ?? afiliado?.cpf,
      DataNascimento: afiliado?.DataNascimento ?? afiliado?.dataNascimento,
      Endereco: afiliado?.Endereco ?? afiliado?.endereco,
      Cidade: afiliado?.Cidade ?? afiliado?.cidade,
      Estado: afiliado?.Estado ?? afiliado?.estado,
      CEP: afiliado?.CEP ?? afiliado?.cep,
      DataAfiliacao: afiliado?.DataAfiliacao ?? afiliado?.dataAfiliacao,
      Status: afiliado?.Status ?? afiliado?.status
    }
    const response = await api.put(`Afiliado/${id}`, payload)
    return response.data
  },

  // Deleta afiliado
  async delete(id) {
    await api.delete(`Afiliado/${id}`)
  }
}

export default afiliadoService
