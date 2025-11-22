<template>
  <div class="afiliado-list-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <i class="pi pi-id-card"></i>
          <span>Afiliados</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3 toolbar-search">
          <span class="hidden sm:inline">Pesquisar:</span>
          <span class="p-input-icon-left">
            <i class="pi pi-search gap-3" />
            <InputText
              v-model="searchQuery"
              placeholder="Buscar afiliado..."
              @keyup.enter="applySearch"
              :disabled="loading"
              style="width: 260px"
            />
          </span>
          <Button icon="pi pi-times" class="p-button-text" @click="clearSearch" :disabled="loading || !searchQuery" />
          <Divider layout="vertical" class="hidden sm:flex" />
          <Button icon="pi pi-plus" label="Novo afiliado" class="p-button-success" @click="navigateToCreate" />
          <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="reload" />
        </div>
      </template>
    </Toolbar>

    <Card class="main-card mt-2 elevated-card brand-datatable">
      <template #content>
        <DataTable
          :value="afiliadoStore.afiliados"
          :paginator="true"
          :lazy="true"
          :totalRecords="afiliadoStore.totalItems"
          :first="(afiliadoStore.pageNumber - 1) * afiliadoStore.pageSize"
          :rows="afiliadoStore.pageSize"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} afiliados"
          :loading="loading"
          @page="afiliadoStore.changePage"
          responsiveLayout="scroll"
          dataKey="id"
        >
          <Column field="nome" header="Nome">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-user text-color-secondary"></i>
                <span class="font-semibold">{{ data.nome }}</span>
              </div>
            </template>
          </Column>
          <Column field="cpf" header="CPF">
            <template #body="{ data }">
              {{ formatCPF(data.cpf) }}
            </template>
          </Column>
          <Column field="email" header="Email">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-envelope text-color-secondary"></i>
                <a :href="`mailto:${data.email}`" class="text-primary hover:underline">{{ data.email || '-' }}</a>
              </div>
            </template>
          </Column>
          <Column field="telefone" header="Telefone">
            <template #body="{ data }">
              {{ formatTelefone(data.telefone) || '-' }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag :value="data.status || 'Ativo'" :severity="getStatusSeverity(data.status)" />
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
              <p>Nenhum afiliado encontrado</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center py-4">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">Carregando afiliados...</p>
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
import { useAfiliadoStore } from '@/stores/afiliadoStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'AfiliadoListView',
  setup() {
    const router = useRouter()
    const afiliadoStore = useAfiliadoStore()
    const authStore = useAuthStore()

    const loading = computed(() => afiliadoStore.loading)
    const searchQuery = ref(afiliadoStore.searchterm || '')

    const loadAfiliados = async () => {
      try {
        await afiliadoStore.loadAfiliados()
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      }
    }

    const applySearch = async () => {
      try {
        await afiliadoStore.setSearchTerm(searchQuery.value)
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
      await loadAfiliados()
    }

    const navigateToCreate = () => {
      router.push('/afiliados/novo')
    }

    const edit = (row) => {
      const id = row.id ?? row.Id ?? row.codg ?? row.Codg
      router.push(`/afiliados/editar/${id}`)
    }

    const remove = async (row) => {
      if (confirm(`Excluir afiliado "${row.nome}"?`)) {
        const id = row.id ?? row.Id ?? row.codg ?? row.Codg
        await afiliadoStore.deleteAfiliado(id)
      }
    }

    const formatCPF = (cpf) => {
      if (!cpf) return '-'
      const cleaned = String(cpf).replace(/\D/g, '')
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    const formatTelefone = (telefone) => {
      if (!telefone) return ''
      const cleaned = String(telefone).replace(/\D/g, '')
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    const getStatusSeverity = (status) => {
      const severities = {
        'Ativo': 'success',
        'Inativo': 'danger',
        'Pendente': 'warning'
      }
      return severities[status] || 'info'
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        authStore.initAuth()
      }
      if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
        router.push('/login')
        return
      }
      await loadAfiliados()
    })

    return {
      afiliadoStore,
      authStore,
      loading,
      searchQuery,
      loadAfiliados,
      navigateToCreate,
      edit,
      remove,
      applySearch,
      clearSearch,
      reload,
      formatCPF,
      formatTelefone,
      getStatusSeverity
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
