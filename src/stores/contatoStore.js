import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contatoService } from '../services/contatoService'

export const useContatoStore = defineStore('contato', () => {
  const contatos = ref([])
  const totalItems = ref(0)
  const totalPages = ref(0)
  const pageNumber = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref(null)

  const filteredContatos = computed(() => contatos.value)

  const loadContatos = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await contatoService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Nome',
        orderByProperty: 'Codg',
        isAscending: true
      })
      contatos.value = result.contatos || []
      totalItems.value = result.totalItems || contatos.value.length
      totalPages.value = result.totalPages || 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar contatos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addContato = async (contato) => {
    try {
      const newContato = await contatoService.create(contato)
      // Recarrega lista para refletir paginação do servidor
      await loadContatos()
      return newContato
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar contato'
      throw err
    }
  }

  const updateContato = async (id, contato) => {
    try {
      const updatedContato = await contatoService.update(id, contato)
      await loadContatos()
      return updatedContato
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar contato'
      throw err
    }
  }

  const deleteContato = async (id) => {
    try {
      await contatoService.delete(id)
      await loadContatos()
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar contato'
      throw err
    }
  }

  const searchContatos = async (term) => {
    // Busca paginada no servidor utilizando as mesmas chaves da API
    loading.value = true
    error.value = null
    try {
      const result = await contatoService.getPaged({
        pageNumber: pageNumber.value,
        pageSize: pageSize.value,
        searchProperty: 'Nome',
        orderByProperty: 'Codg',
        isAscending: true
      })

      // Caso deseje filtrar por termo no servidor, ajuste a API para aceitar 'term'
      // e inclua em params. Por ora, filtramos localmente mantendo paginação atual.
      let list = result.contatos || []
      if (term) {
        const termLower = term.toLowerCase()
        list = list.filter(c =>
          c.nome?.toLowerCase().includes(termLower) ||
          c.email?.toLowerCase().includes(termLower) ||
          c.telefone?.includes(termLower)
        )
      }
      contatos.value = list
      totalItems.value = result.totalItems || list.length
      totalPages.value = result.totalPages || 1
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro na busca paginada'
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePage = async ({ page = 0, rows = 10 }) => {
    // PrimeVue DataTable emite page indexado em 0
    pageNumber.value = page + 1
    pageSize.value = rows
    await loadContatos()
  }

  return {
    contatos,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    filteredContatos,
    loading,
    error,
    loadContatos,
    addContato,
    updateContato,
    deleteContato,
    searchContatos,
    changePage
  }
})