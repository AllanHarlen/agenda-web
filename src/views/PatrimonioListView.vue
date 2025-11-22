<template>
  <div class="patrimonio-list-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <i class="pi pi-building"></i>
          <span>Patrimônios</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3 toolbar-search">
          <span class="hidden sm:inline">Pesquisar:</span>
          <span class="p-input-icon-left">
            <i class="pi pi-search gap-3" />
            <InputText
              v-model="searchQuery"
              placeholder="Buscar patrimônio..."
              @keyup.enter="applySearch"
              :disabled="loading"
              style="width: 260px"
            />
          </span>
          <Button icon="pi pi-times" class="p-button-text" @click="clearSearch" :disabled="loading || !searchQuery" />
          <Divider layout="vertical" class="hidden sm:flex" />
          <Button icon="pi pi-plus" label="Novo patrimônio" class="p-button-success" @click="navigateToCreate" />
          <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="reload" />
        </div>
      </template>
    </Toolbar>

    <Card class="main-card mt-2 elevated-card brand-datatable">
      <template #content>
        <DataTable
          :value="patrimonioStore.patrimonios"
          :paginator="true"
          :lazy="true"
          :totalRecords="patrimonioStore.totalItems"
          :first="(patrimonioStore.pageNumber - 1) * patrimonioStore.pageSize"
          :rows="patrimonioStore.pageSize"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} patrimônios"
          :loading="loading"
          @page="patrimonioStore.changePage"
          responsiveLayout="scroll"
          dataKey="id"
        >
          <Column field="descricao" header="Descrição">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-building text-color-secondary"></i>
                <span class="font-semibold">{{ data.descricao }}</span>
              </div>
            </template>
          </Column>
          <Column field="categoria" header="Categoria">
            <template #body="{ data }">
              <Tag :value="data.categoria || 'Sem categoria'" severity="info" />
            </template>
          </Column>
          <Column field="valor" header="Valor">
            <template #body="{ data }">
              {{ formatCurrency(data.valor) }}
            </template>
          </Column>
          <Column field="estado" header="Estado">
            <template #body="{ data }">
              <Tag :value="data.estado || 'N/A'" :severity="getEstadoSeverity(data.estado)" />
            </template>
          </Column>
          <Column field="localizacao" header="Localização">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-map-marker text-color-secondary"></i>
                <span>{{ data.localizacao || '-' }}</span>
              </div>
            </template>
          </Column>
          <Column header="Ações" style="width: 140px">
            <template #body="{ data }">
              <div class="flex gap-2 justify-content-end">
                <Button icon="pi pi-pencil" class="p-button-text p-button-success" @click="edit(data)" />
                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="remove(data)" />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-4 text-color-secondary">
              <i class="pi pi-inbox text-4xl mb-2"></i>
              <p>Nenhum patrimônio encontrado</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center py-4">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">Carregando patrimônios...</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatrimonioStore } from '@/stores/patrimonioStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'PatrimonioListView',
  setup() {
    const router = useRouter()
    const patrimonioStore = usePatrimonioStore()
    const authStore = useAuthStore()

    const loading = computed(() => patrimonioStore.loading)
    const searchQuery = ref(patrimonioStore.searchterm || '')

    const loadPatrimonios = async () => {
      try {
        await patrimonioStore.loadPatrimonios()
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      }
    }

    const applySearch = async () => {
      try {
        await patrimonioStore.setSearchTerm(searchQuery.value)
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      }
    }

    const clearSearch = async () => {
      if (!searchQuery.value) return
      searchQuery.value = ''
      await applySearch()
    }

    const reload = async () => {
      await loadPatrimonios()
    }

    const navigateToCreate = () => {
      router.push('/patrimonios/novo')
    }

    const edit = (row) => {
      const id = row.id ?? row.Id ?? row.codg ?? row.Codg
      router.push(`/patrimonios/editar/${id}`)
    }

    const remove = async (row) => {
      if (confirm(`Excluir patrimônio "${row.descricao}"?`)) {
        const id = row.id ?? row.Id ?? row.codg ?? row.Codg
        await patrimonioStore.deletePatrimonio(id)
      }
    }

    const formatCurrency = (value) => {
      if (!value) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    const getEstadoSeverity = (estado) => {
      const estados = {
        'Novo': 'success',
        'Bom': 'info',
        'Regular': 'warning',
        'Ruim': 'danger'
      }
      return estados[estado] || 'secondary'
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        authStore.initAuth()
      }
      if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
        router.push('/login')
        return
      }
      await loadPatrimonios()
    })

    return {
      patrimonioStore,
      authStore,
      loading,
      searchQuery,
      loadPatrimonios,
      navigateToCreate,
      edit,
      remove,
      applySearch,
      clearSearch,
      reload,
      formatCurrency,
      getEstadoSeverity
    }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }

.brand-toolbar :deep(.p-toolbar) {
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.toolbar-title {
  color: #000;
}

.toolbar-title i {
  font-size: 1.5rem;
}

.toolbar-search :deep(.p-button),
.toolbar-search :deep(.p-inputtext) {
  color: #000;
  border-color: rgba(0, 0, 0, 0.2);
}

.toolbar-search :deep(.p-button-text) {
  color: #000;
}

.toolbar-search :deep(.p-inputtext::placeholder) {
  color: rgba(0, 0, 0, 0.5);
}

.elevated-card :deep(.p-card) {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
}
</style>
