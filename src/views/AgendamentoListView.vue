<template>
  <div class="agendamento-list-view">
    <Toolbar class="toolbar">
      <template #start>
        <span class="text-2xl font-bold text-white">🗓️ Agendamentos</span>
      </template>
      <template #end>
        <Button icon="pi pi-plus" label="Novo" class="p-button-success" @click="openNew" />
        <Button icon="pi pi-refresh" class="p-button-text ml-2" :loading="loading" @click="loadAgendamentos" />
      </template>
    </Toolbar>

    <Card class="main-card mt-2">
      <template #content>
        <DataTable
          :value="agendamentoStore.agendamentos"
          :paginator="true"
          :lazy="true"
          :totalRecords="agendamentoStore.totalItems"
          :first="(agendamentoStore.pageNumber - 1) * agendamentoStore.pageSize"
          :rows="agendamentoStore.pageSize"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          :loading="loading"
          @page="agendamentoStore.changePage"
        >
          <Column field="codg" header="#"></Column>
          <Column field="contato.nome" header="Contato">
            <template #body="{ data }">{{ data.contato?.nome || '-' }}</template>
          </Column>
          <Column field="dscr" header="Descrição"></Column>
          <Column field="dataHora" header="Data/Hora">
            <template #body="{ data }">{{ formatDateTime(data.dataHora) }}</template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" class="p-button-text p-button-success" @click="edit(data)" />
                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="remove(data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ width: '520px' }">
      <template #header>{{ formTitle }}</template>
      <div class="p-fluid">
        <div class="field">
          <label>Contato ID</label>
          <InputNumber v-model="form.contatoId" :min="1" showButtons />
        </div>
        <div class="field">
          <label>Data/Hora</label>
          <Calendar v-model="form.dataHora" showTime hourFormat="24" :showIcon="true" />
        </div>
        <div class="field">
          <label>Descrição</label>
          <InputText v-model="form.dscr" />
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
import { useAgendamentoStore } from '@/stores/agendamentoStore'

export default {
  name: 'AgendamentoListView',
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const dialogVisible = ref(false)
    const form = ref({ id: null, contatoId: null, dataHora: null, dscr: '' })
    const loading = computed(() => agendamentoStore.loading)
    const formTitle = computed(() => (form.value.id ? 'Editar Agendamento' : 'Novo Agendamento'))

    const loadAgendamentos = async () => {
      await agendamentoStore.loadAgendamentos()
    }

    const openNew = () => {
      form.value = { id: null, contatoId: null, dataHora: null, dscr: '' }
      dialogVisible.value = true
    }

    const edit = (row) => {
      form.value = { id: row.codg, contatoId: row.contatoId, dataHora: new Date(row.dataHora), dscr: row.dscr }
      dialogVisible.value = true
    }

    const remove = async (row) => {
      if (confirm('Excluir agendamento?')) {
        await agendamentoStore.deleteAgendamento(row.codg)
      }
    }

    const save = async () => {
      const payload = { contatoId: form.value.contatoId, dataHora: form.value.dataHora, dscr: form.value.dscr }
      if (form.value.id) {
        await agendamentoStore.updateAgendamento(form.value.id, payload)
      } else {
        await agendamentoStore.addAgendamento(payload)
      }
      dialogVisible.value = false
    }

    const formatDateTime = (v) => {
      if (!v) return '-'
      const d = new Date(v)
      return d.toLocaleString('pt-BR')
    }

    onMounted(loadAgendamentos)

    return { agendamentoStore, dialogVisible, form, loading, formTitle, loadAgendamentos, openNew, edit, remove, save, formatDateTime }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }
</style>


