<template>
  <div class="contato-list-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="flex align-items-center gap-3 toolbar-title">
          <i class="pi pi-users"></i>
          <span>Contatos</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-3 toolbar-search">
          <span class="hidden sm:inline">Pesquisar:</span>
          <span class="p-input-icon-left">
            <i class="pi pi-search gap-3" />
            <InputText
              v-model="searchQuery"
              placeholder="Buscar por nome/email/telefone..."
              @keyup.enter="applySearch"
              :disabled="loading"
              style="width: 260px"
            />
          </span>
          <Button icon="pi pi-times" class="p-button-text" @click="clearSearch" :disabled="loading || !searchQuery" />
          <Divider layout="vertical" class="hidden sm:flex" />
          <Button icon="pi pi-plus" label="Novo" class="p-button-success" @click="openNew" />
          <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="reload" />
        </div>
      </template>
    </Toolbar>

    <Card class="main-card mt-2 elevated-card brand-datatable">
      <template #content>
        <DataTable
          :value="contatoStore.contatos"
          :paginator="true"
          :lazy="true"
          :totalRecords="contatoStore.totalItems"
          :first="(contatoStore.pageNumber - 1) * contatoStore.pageSize"
          :rows="contatoStore.pageSize"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} contatos"
          :loading="loading"
          @page="contatoStore.changePage"
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
              <div class="flex align-items-center gap-2">
                <i class="pi pi-phone text-color-secondary"></i>
                <a :href="`tel:${data.telefone}`" class="text-primary hover:underline">{{ formatTelefone(data.telefone) || '-' }}</a>
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
              <p>Nenhum contato encontrado</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center py-4">
              <i class="pi pi-spin pi-spinner text-2xl"></i>
              <p class="mt-2">Carregando contatos...</p>
            </div>
          </template>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ width: '520px' }" class="dialog-brand">
      <template #header>
        <div class="dialog-title">
          <i class="pi pi-user-plus"></i>
          <span>{{ formTitle }}</span>
        </div>
      </template>
      <div class="p-fluid">
        <div class="field">
          <label>Nome</label>
          <InputText v-model="form.nome" />
        </div>
        <div class="field">
          <label>Email</label>
          <InputText v-model="form.email" />
        </div>
        <div class="field">
          <label>Telefone</label>
          <InputText v-model="form.telefone" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" class="p-button-text" @click="dialogVisible=false" />
        <Button :label="form.id ? 'Salvar' : 'Criar'" :loading="loading" @click="save" />
      </template>
    </Dialog>
  </div>
  
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContatoStore } from '@/stores/contatoStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'ContatoListView',
  setup() {
    const router = useRouter()
    const contatoStore = useContatoStore()
    const authStore = useAuthStore()

    const dialogVisible = ref(false)
    const form = ref({ id: null, nome: '', email: '', telefone: '' })
    const loading = computed(() => contatoStore.loading)
    const searchQuery = ref(contatoStore.searchterm || '')
    const formTitle = computed(() => (form.value.id ? 'Editar Contato' : 'Novo Contato'))

    const loadContatos = async () => {
      try {
        await contatoStore.loadContatos()
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout()
          router.push('/login')
        }
      }
    }

    const applySearch = async () => {
      try {
        await contatoStore.setSearchTerm(searchQuery.value)
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
      await loadContatos()
    }

    const openNew = () => {
      form.value = { id: null, nome: '', email: '', telefone: '' }
      dialogVisible.value = true
    }

    const edit = (row) => {
      const id = row.id ?? row.Id ?? row.codg ?? row.Codg
      form.value = { id, nome: row.nome || row.Nome || '', email: row.email || row.Email || '', telefone: row.telefone || row.Telefone || '' }
      dialogVisible.value = true
    }

    const remove = async (row) => {
      if (confirm(`Excluir contato \"${row.nome}\"?`)) {
        const id = row.id ?? row.Id ?? row.codg ?? row.Codg
        await contatoStore.deleteContato(id)
      }
    }

    const save = async () => {
      const payload = { Nome: form.value.nome, Email: form.value.email, Telefone: form.value.telefone }
      if (form.value.id) {
        await contatoStore.updateContato(form.value.id, payload)
      } else {
        await contatoStore.addContato(payload)
      }
      dialogVisible.value = false
    }

    const formatTelefone = (telefone) => {
      if (!telefone) return ''
      const cleaned = String(telefone).replace(/\D/g, '')
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        authStore.initAuth()
      }
      if (!authStore.isAuthenticated && !localStorage.getItem('authToken')) {
        router.push('/login')
        return
      }
      await loadContatos()
    })

    return { contatoStore, authStore, dialogVisible, form, loading, formTitle, searchQuery, loadContatos, openNew, edit, remove, save, formatTelefone, applySearch, clearSearch, reload }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }

/* Toolbar gradiente compatível com Sidebar */
.brand-toolbar :deep(.p-toolbar) {
  background: linear-gradient(135deg, #225c5a 0%, #73a9a7 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

/* Título com ícone em preto e maior espaçamento */
.toolbar-title {
  color: #000;
}
.toolbar-title i {
  color: #000;
}

/* Área de pesquisa com texto e ícone pretos */
.toolbar-search {
  color: #000;
}
.toolbar-search i {
  color: #000;
}

/* Cartão elevado e DataTable refinado */
.elevated-card :deep(.p-card) {
  border-radius: 12px;
  border: 1px solid rgba(2, 6, 23, 0.06);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}
.brand-datatable :deep(.p-datatable-thead > tr > th) {
  background: #F8FAFC;
  color: #475569;
}
.brand-datatable :deep(.p-datatable-tbody > tr:hover) {
  background: rgba(34, 92, 90, 0.06);
}
.brand-datatable :deep(.p-paginator) {
  border-top: 1px solid rgba(2, 6, 23, 0.06);
}

/* Diálogo com header temático */
.dialog-brand :deep(.p-dialog-header) {
  border-bottom: 1px solid rgba(2, 6, 23, 0.06);
  padding: 0.75rem 1rem;
}
.dialog-brand .dialog-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}
</style>