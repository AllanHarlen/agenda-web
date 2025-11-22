import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { afiliadoService } from '../services/afiliadoService'

export const useAfiliadoStore = defineStore('afiliado', () => {
  const afiliados = ref([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref(null)
  const searchterm = ref('')

  const filteredAfiliados = computed(() => afiliados.value)

  const loadAfiliados = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await afiliadoService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Nome',
        orderByProperty: 'Codg',
        isAscending: true,
        searchterm: searchterm.value
      })
      const rawList = Array.isArray(result) ? result : (result?.Afiliados || result?.afiliados || [])
      const list = (rawList || []).map((a) => ({
        ...a,
        id: a?.id ?? a?.Id ?? a?.codg ?? a?.Codg,
        nome: a?.nome ?? a?.Nome,
        email: a?.email ?? a?.Email,
        telefone: a?.telefone ?? a?.Telefone,
        cpf: a?.cpf ?? a?.CPF,
        dataNascimento: a?.dataNascimento ?? a?.DataNascimento,
        endereco: a?.endereco ?? a?.Endereco,
        cidade: a?.cidade ?? a?.Cidade,
        estado: a?.estado ?? a?.Estado,
        cep: a?.cep ?? a?.CEP,
        dataAfiliacao: a?.dataAfiliacao ?? a?.DataAfiliacao,
        status: a?.status ?? a?.Status
      }))
      afiliados.value = list
      totalItems.value = (Array.isArray(result) ? list.length : (result?.TotalItems ?? result?.totalItems ?? list.length))
      totalPages.value = (Array.isArray(result) ? 1 : (result?.TotalPages ?? result?.totalPages ?? 1))
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar afiliados'
      throw err
    } finally {
      loading.value = false
    }
  }

  const setSearchTerm = async (term) => {
    pageNumber.value = 1
    searchterm.value = term || ''
    await loadAfiliados()
  }

  const addAfiliado = async (afiliado) => {
    try {
      const newAfiliado = await afiliadoService.create(afiliado)
      await loadAfiliados()
      return newAfiliado
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar afiliado'
      throw err
    }
  }

  const updateAfiliado = async (id, afiliado) => {
    try {
      const updatedAfiliado = await afiliadoService.update(id, afiliado)
      await loadAfiliados()
      return updatedAfiliado
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar afiliado'
      throw err
    }
  }

  const deleteAfiliado = async (id) => {
    try {
      await afiliadoService.delete(id)
      await loadAfiliados()
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar afiliado'
      throw err
    }
  }

  const changePage = async ({ page = 0, rows = 10 }) => {
    pageNumber.value = page + 1
    pageSize.value = rows
    await loadAfiliados()
  }

  return {
    afiliados,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    searchterm,
    filteredAfiliados,
    loading,
    error,
    loadAfiliados,
    addAfiliado,
    updateAfiliado,
    deleteAfiliado,
    changePage,
    setSearchTerm
  }
})
