import api from './api'

export const agendamentoService = {
  // Lista todos os agendamentos (sem paginação)
  async getAll() {
    const response = await api.get('Agendamento/ListarTodosAgendamentos')
    return response.data
  },

  // Lista paginada
  async getPaged({ pageNumber = 1, pageSize = 10, searchProperty = 'Dscr', orderByProperty = 'Codg', isAscending = true, searchterm = '' } = {}) {
    const response = await api.get('Agendamento/ListarAgendamentosPaginados', {
      params: { pageNumber, pageSize, searchProperty, orderByProperty, isAscending, searchterm }
    })
    return response.data
  },

  // Obtém um agendamento por id
  async getById(id) {
    const response = await api.get(`Agendamento/${id}`)
    return response.data
  },

  // Cria um agendamento
  async create(agendamento) {
    const response = await api.post('Agendamento', agendamento)
    return response.data
  },

  // Atualiza um agendamento
  async update(id, agendamento) {
    const response = await api.put(`Agendamento/${id}`, agendamento)
    return response.data
  },

  // Exclui um agendamento
  async delete(id) {
    await api.delete(`Agendamento/${id}`)
  },

  // Calendário
  async getCalendar({ days = 7, startDate = null } = {}) {
    const response = await api.get('Agendamento/Calendario', {
      params: { days, startDate }
    })
    return response.data
  }
}

export default agendamentoService

