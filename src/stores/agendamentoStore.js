import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { agendamentoService } from '@/services/agendamentoService'

export const useAgendamentoStore = defineStore('agendamento', () => {
  const agendamentos = ref([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref(null)

  const calendar = ref({ startDate: null, endDate: null, events: [] })

  const loadAgendamentos = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await agendamentoService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Dscr',
        orderByProperty: 'Codg',
        isAscending: true
      })
      agendamentos.value = result.agendamentos || []
      totalItems.value = result.totalItems || agendamentos.value.length
      totalPages.value = result.totalPages || 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar agendamentos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addAgendamento = async (payload) => {
    await agendamentoService.create(payload)
    await loadAgendamentos()
  }

  const updateAgendamento = async (id, payload) => {
    await agendamentoService.update(id, payload)
    await loadAgendamentos()
  }

  const deleteAgendamento = async (id) => {
    await agendamentoService.delete(id)
    await loadAgendamentos()
  }

  const changePage = async ({ page = 0, rows = 10 }) => {
    pageNumber.value = page + 1
    pageSize.value = rows
    await loadAgendamentos()
  }

  const loadCalendar = async ({ days = 7, startDate = null } = {}) => {
    loading.value = true
    error.value = null
    try {
      const data = await agendamentoService.getCalendar({ days, startDate })
      calendar.value = data
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar calendário'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    agendamentos,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    calendar,
    loadAgendamentos,
    addAgendamento,
    updateAgendamento,
    deleteAgendamento,
    changePage,
    loadCalendar
  }
})


