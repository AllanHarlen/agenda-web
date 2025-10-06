<template>
  <div class="contato-list-view">
    <Toolbar class="toolbar">
      <template #start>
        <span class="text-2xl font-bold text-white">📒 Contatos</span>
      </template>
      <template #end>
        <Button icon="pi pi-plus" label="Novo" class="p-button-success" @click="openNew" />
        <Button icon="pi pi-refresh" class="p-button-text ml-2" :loading="loading" @click="loadContatos" />
      </template>
    </Toolbar>

    <Card class="main-card mt-2">
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
        >
          <Column field="nome" header="Nome">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.nome }}</span>
            </template>
          </Column>
          <Column field="email" header="Email">
            <template #body="{ data }">
              <a :href="`mailto:${data.email}`" class="text-primary hover:underline">{{ data.email || '-' }}</a>
            </template>
          </Column>
          <Column field="telefone" header="Telefone">
            <template #body="{ data }">
              <a :href="`tel:${data.telefone}`" class="text-primary hover:underline">{{ formatTelefone(data.telefone) || '-' }}</a>
            </template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <div class="flex gap-2">
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

    <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ width: '520px' }">
      <template #header>{{ formTitle }}</template>
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

    const openNew = () => {
      form.value = { id: null, nome: '', email: '', telefone: '' }
      dialogVisible.value = true
    }

    const edit = (row) => {
      form.value = { id: row.id || null, nome: row.nome || '', email: row.email || '', telefone: row.telefone || '' }
      dialogVisible.value = true
    }

    const remove = async (row) => {
      if (confirm(`Excluir contato "${row.nome}"?`)) {
        await contatoStore.deleteContato(row.id)
      }
    }

    const save = async () => {
      const payload = { nome: form.value.nome, email: form.value.email, telefone: form.value.telefone }
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

    return { contatoStore, authStore, dialogVisible, form, loading, formTitle, loadContatos, openNew, edit, remove, save, formatTelefone }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }
</style>