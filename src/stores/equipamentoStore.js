import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { equipamentoService } from '../services/equipamentoService'

export const useEquipamentoStore = defineStore('equipamento', () => {
  const equipamentos = ref([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref(null)
  const searchterm = ref('')

  const filteredEquipamentos = computed(() => equipamentos.value)

  const loadEquipamentos = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await equipamentoService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Nome',
        orderByProperty: 'Codg',
        isAscending: true,
        searchterm: searchterm.value
      })
      const rawList = Array.isArray(result) ? result : (result?.Equipamentos || result?.equipamentos || [])
      const list = (rawList || []).map((e) => ({
        ...e,
        id: e?.id ?? e?.Id ?? e?.codg ?? e?.Codg,
        nome: e?.nome ?? e?.Nome,
        tipo: e?.tipo ?? e?.Tipo,
        marca: e?.marca ?? e?.Marca,
        modelo: e?.modelo ?? e?.Modelo,
        numeroSerie: e?.numeroSerie ?? e?.NumeroSerie,
        dataAquisicao: e?.dataAquisicao ?? e?.DataAquisicao,
        estado: e?.estado ?? e?.Estado,
        localizacao: e?.localizacao ?? e?.Localizacao
      }))
      equipamentos.value = list
      totalItems.value = (Array.isArray(result) ? list.length : (result?.TotalItems ?? result?.totalItems ?? list.length))
      totalPages.value = (Array.isArray(result) ? 1 : (result?.TotalPages ?? result?.totalPages ?? 1))
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar equipamentos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchTerm = async (term) => {
    pageNumber.value = 1
    searchterm.value = term || ''
    await loadEquipamentos()
  }

  const addEquipamento = async (equipamento) => {
    try {
      const newEquipamento = await equipamentoService.create(equipamento)
      await loadEquipamentos()
      return newEquipamento
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar equipamento'
      throw err
    }
  }

  const updateEquipamento = async (id, equipamento) => {
    try {
      const updatedEquipamento = await equipamentoService.update(id, equipamento)
      await loadEquipamentos()
      return updatedEquipamento
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar equipamento'
      throw err
    }
  }

  const deleteEquipamento = async (id) => {
    try {
      await equipamentoService.delete(id)
      await loadEquipamentos()
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar equipamento'
      throw err
    }
  }

  const changePage = async ({ page = 0, rows = 10 }) => {
    pageNumber.value = page + 1
    pageSize.value = rows
    await loadEquipamentos()
  }

  return {
    equipamentos,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    searchterm,
    filteredEquipamentos,
    loading,
    error,
    loadEquipamentos,
    addEquipamento,
    updateEquipamento,
    deleteEquipamento,
    changePage,
    setSearchTerm
  }
})
