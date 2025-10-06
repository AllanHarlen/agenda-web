import api from './api'

export const contatoService = {
  // Lista todos os contatos
  async getAll() {
    const response = await api.get('Contato/ListarTodosContatos')
    return response.data
  },

  // Lista contatos paginados conforme especificação
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Nome', orderByProperty = 'Codg', isAscending = true, searchterm = '' } = {}) {
    const response = await api.get('Contato/ListarContatosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending, searchTerm: searchterm }
    })
    return response.data
  },

  // Busca por id (se existir no backend)
  async getById(id) {
    const response = await api.get(`Contato/${id}`)
    return response.data
  },

  // Cria contato
  async create(contato) {
    const payload = {
      Nome: contato?.Nome ?? contato?.nome,
      Email: contato?.Email ?? contato?.email,
      Telefone: contato?.Telefone ?? contato?.telefone
    }
    const response = await api.post('Contato', payload)
    return response.data
  },

  // Atualiza contato
  async update(id, contato) {
    const payload = {
      Nome: contato?.Nome ?? contato?.nome,
      Email: contato?.Email ?? contato?.email,
      Telefone: contato?.Telefone ?? contato?.telefone
    }
    const response = await api.put(`Contato/${id}`, payload)
    return response.data
  },

  // Deleta contato
  async delete(id) {
    await api.delete(`Contato/${id}`)
  },

  // Busca (mantido para compatibilidade com a store)
  async search(term) {
    const response = await api.get('Contato/search', { params: { term } })
    return response.data
  }
}

export default contatoService

