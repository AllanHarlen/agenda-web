import api from './api'

export const patrimonioService = {
  // Lista todos os patrimônios
  async getAll() {
    const response = await api.get('Patrimonio/ListarTodosPatrimonios')
    return response.data
  },

  // Lista patrimônios paginados
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Descricao', orderByProperty = 'Codg', isAscending = true, searchterm = '' } = {}) {
    const response = await api.get('Patrimonio/ListarPatrimoniosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending, searchTerm: searchterm }
    })
    return response.data
  },

  // Busca por id
  async getById(id) {
    const response = await api.get(`Patrimonio/${id}`)
    return response.data
  },

  // Cria patrimônio
  async create(patrimonio) {
    const payload = {
      Descricao: patrimonio?.Descricao ?? patrimonio?.descricao,
      Categoria: patrimonio?.Categoria ?? patrimonio?.categoria,
      Valor: patrimonio?.Valor ?? patrimonio?.valor,
      DataAquisicao: patrimonio?.DataAquisicao ?? patrimonio?.dataAquisicao,
      Estado: patrimonio?.Estado ?? patrimonio?.estado,
      Localizacao: patrimonio?.Localizacao ?? patrimonio?.localizacao,
      Observacoes: patrimonio?.Observacoes ?? patrimonio?.observacoes
    }
    const response = await api.post('Patrimonio', payload)
    return response.data
  },

  // Atualiza patrimônio
  async update(id, patrimonio) {
    const payload = {
      Descricao: patrimonio?.Descricao ?? patrimonio?.descricao,
      Categoria: patrimonio?.Categoria ?? patrimonio?.categoria,
      Valor: patrimonio?.Valor ?? patrimonio?.valor,
      DataAquisicao: patrimonio?.DataAquisicao ?? patrimonio?.dataAquisicao,
      Estado: patrimonio?.Estado ?? patrimonio?.estado,
      Localizacao: patrimonio?.Localizacao ?? patrimonio?.localizacao,
      Observacoes: patrimonio?.Observacoes ?? patrimonio?.observacoes
    }
    const response = await api.put(`Patrimonio/${id}`, payload)
    return response.data
  },

  // Deleta patrimônio
  async delete(id) {
    await api.delete(`Patrimonio/${id}`)
  }
}

export default patrimonioService
