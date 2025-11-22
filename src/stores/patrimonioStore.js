import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { patrimonioService } from '../services/patrimonioService'

export const usePatrimonioStore = defineStore('patrimonio', () => {
  const patrimonios = ref([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref(null)
  const searchterm = ref('')

  const filteredPatrimonios = computed(() => patrimonios.value)

  const loadPatrimonios = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await patrimonioService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Descricao',
        orderByProperty: 'Codg',
        isAscending: true,
        searchterm: searchterm.value
      })
      const rawList = Array.isArray(result) ? result : (result?.Patrimonios || result?.patrimonios || [])
      const list = (rawList || []).map((p) => ({
        ...p,
        id: p?.id ?? p?.Id ?? p?.codg ?? p?.Codg,
        descricao: p?.descricao ?? p?.Descricao,
        categoria: p?.categoria ?? p?.Categoria,
        valor: p?.valor ?? p?.Valor,
        dataAquisicao: p?.dataAquisicao ?? p?.DataAquisicao,
        estado: p?.estado ?? p?.Estado,
        localizacao: p?.localizacao ?? p?.Localizacao,
        observacoes: p?.observacoes ?? p?.Observacoes
      }))
      patrimonios.value = list
      totalItems.value = (Array.isArray(result) ? list.length : (result?.TotalItems ?? result?.totalItems ?? list.length))
      totalPages.value = (Array.isArray(result) ? 1 : (result?.TotalPages ?? result?.totalPages ?? 1))
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar patrimônios'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchTerm = async (term) => {
    pageNumber.value = 1
    searchterm.value = term || ''
    await loadPatrimonios()
  }

  const addPatrimonio = async (patrimonio) => {
    try {
      const newPatrimonio = await patrimonioService.create(patrimonio)
      await loadPatrimonios()
      return newPatrimonio
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar patrimônio'
      throw err
    }
  }

  const updatePatrimonio = async (id, patrimonio) => {
    try {
      const updatedPatrimonio = await patrimonioService.update(id, patrimonio)
      await loadPatrimonios()
      return updatedPatrimonio
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar patrimônio'
      throw err
    }
  }

  const deletePatrimonio = async (id) => {
    try {
      await patrimonioService.delete(id)
      await loadPatrimonios()
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar patrimônio'
      throw err
    }
  }

  const changePage = async ({ page = 0, rows = 10 }) => {
    pageNumber.value = page + 1
    pageSize.value = rows
    await loadPatrimonios()
  }

  return {
    patrimonios,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    searchterm,
    filteredPatrimonios,
    loading,
    error,
    loadPatrimonios,
    addPatrimonio,
    updatePatrimonio,
    deletePatrimonio,
    changePage,
    setSearchTerm
  }
})
