import api from './api'

export const contatoService = {
  // Lista todos os contatos
  async getAll() {
    const response = await api.get('/api/Contato/ListarTodosContatos')
    return response.data
  },

  // Lista contatos paginados conforme especificação
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Nome', orderByProperty = 'Codg', isAscending = true } = {}) {
    const response = await api.get('/api/Contato/ListarContatosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending }
    })
    return response.data
  },

  // Busca por id (se existir no backend)
  async getById(id) {
    const response = await api.get(`/api/Contato/${id}`)
    return response.data
  },

  // Cria contato
  async create(contato) {
    const response = await api.post('/api/Contato', contato)
    return response.data
  },

  // Atualiza contato
  async update(id, contato) {
    const response = await api.put(`/api/Contato/${id}`, contato)
    return response.data
  },

  // Deleta contato
  async delete(id) {
    await api.delete(`/api/Contato/${id}`)
  },

  // Busca (mantido para compatibilidade com a store)
  async search(term) {
    const response = await api.get('/api/Contato/search', { params: { term } })
    return response.data
  }
}

export default contatoService

