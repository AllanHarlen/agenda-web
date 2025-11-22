import api from './api'

export const equipamentoService = {
  // Lista todos os equipamentos
  async getAll() {
    const response = await api.get('Equipamento/ListarTodosEquipamentos')
    return response.data
  },

  // Lista equipamentos paginados
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Nome', orderByProperty = 'Codg', isAscending = true, searchterm = '' } = {}) {
    const response = await api.get('Equipamento/ListarEquipamentosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending, searchTerm: searchterm }
    })
    return response.data
  },

  // Busca por id
  async getById(id) {
    const response = await api.get(`Equipamento/${id}`)
    return response.data
  },

  // Cria equipamento
  async create(equipamento) {
    const payload = {
      Nome: equipamento?.Nome ?? equipamento?.nome,
      Tipo: equipamento?.Tipo ?? equipamento?.tipo,
      Marca: equipamento?.Marca ?? equipamento?.marca,
      Modelo: equipamento?.Modelo ?? equipamento?.modelo,
      NumeroSerie: equipamento?.NumeroSerie ?? equipamento?.numeroSerie,
      DataAquisicao: equipamento?.DataAquisicao ?? equipamento?.dataAquisicao,
      Estado: equipamento?.Estado ?? equipamento?.estado,
      Localizacao: equipamento?.Localizacao ?? equipamento?.localizacao
    }
    const response = await api.post('Equipamento', payload)
    return response.data
  },

  // Atualiza equipamento
  async update(id, equipamento) {
    const payload = {
      Nome: equipamento?.Nome ?? equipamento?.nome,
      Tipo: equipamento?.Tipo ?? equipamento?.tipo,
      Marca: equipamento?.Marca ?? equipamento?.marca,
      Modelo: equipamento?.Modelo ?? equipamento?.modelo,
      NumeroSerie: equipamento?.NumeroSerie ?? equipamento?.numeroSerie,
      DataAquisicao: equipamento?.DataAquisicao ?? equipamento?.dataAquisicao,
      Estado: equipamento?.Estado ?? equipamento?.estado,
      Localizacao: equipamento?.Localizacao ?? equipamento?.localizacao
    }
    const response = await api.put(`Equipamento/${id}`, payload)
    return response.data
  },

  // Deleta equipamento
  async delete(id) {
    await api.delete(`Equipamento/${id}`)
  }
}

export default equipamentoService
