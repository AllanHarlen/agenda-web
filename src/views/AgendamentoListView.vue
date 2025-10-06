<template>
  <div class="agendamento-list-view">
    <Toolbar class="toolbar brand-toolbar">
      <template #start>
        <div class="title-with-icon">
          <i class="pi pi-calendar"></i>
          <span>Agendamentos</span>
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <span class="hidden sm:inline mr-2">Pesquisar:</span>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              placeholder="Buscar por descrição..."
              @keyup.enter="applySearch"
              :disabled="loading"
              style="width: 220px"
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
          responsiveLayout="scroll"
          dataKey="codg"
        >
          <Column field="codg" header="#" style="width: 80px"></Column>
          <Column field="contato.nome" header="Contato">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-user text-color-secondary"></i>
                <span>{{ data.contato?.nome || '-' }}</span>
              </div>
            </template>
          </Column>
          <Column field="dscr" header="Descrição"></Column>
          <Column field="dataHora" header="Data/Hora" style="width: 210px">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-clock text-color-secondary"></i>
                <span>{{ formatDateTime(data.dataHora) }}</span>
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
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="dialogVisible" :modal="true" :style="{ width: '560px' }" class="dialog-brand">
      <template #header>
        <div class="dialog-title">
          <i class="pi pi-calendar-plus"></i>
          <span>{{ formTitle }}</span>
        </div>
      </template>
      <div class="p-fluid">
        <div class="field">
          <label>Contato</label>
          <AutoComplete
            v-model="selectedContato"
            :suggestions="contatoSuggestions"
            optionLabel="nome"
            placeholder="Digite para buscar..."
            forceSelection
            dropdown
            :showClear="true"
            @complete="onContatoSearch"
            @item-select="onContatoSelect"
            @clear="onContatoClear"
          >
            <template #option="{ option }">
              <div class="flex flex-column">
                <span class="font-semibold">{{ option.nome }}</span>
                <small class="text-color-secondary">{{ option.email }} • {{ option.telefone }}</small>
              </div>
            </template>
          </AutoComplete>
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
import { useContatoStore } from '@/stores/contatoStore'
import { contatoService } from '@/services/contatoService'

export default {
  name: 'AgendamentoListView',
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const contatoStore = useContatoStore()
    const dialogVisible = ref(false)
    const form = ref({ id: null, contatoId: null, dataHora: null, dscr: '' })
    const loading = computed(() => agendamentoStore.loading)
    const formTitle = computed(() => (form.value.id ? 'Editar Agendamento' : 'Novo Agendamento'))
    const selectedContato = ref(null)
    const contatoSuggestions = ref([])
    const searchQuery = ref(agendamentoStore.searchterm || '')

    const loadAgendamentos = async () => {
      await agendamentoStore.loadAgendamentos()
    }

    const applySearch = async () => {
      await agendamentoStore.setSearchTerm(searchQuery.value)
    }

    const clearSearch = async () => {
      if (!searchQuery.value) return
      searchQuery.value = ''
      await agendamentoStore.setSearchTerm('')
    }

    const reload = async () => {
      await agendamentoStore.loadAgendamentos()
    }

    const loadContatosBase = async () => {
      // carrega um lote inicial para autocomplete
      if (!contatoStore.contatos?.length) {
        try { await contatoStore.loadContatos() } catch {}
      }
    }

    const openNew = () => {
      form.value = { id: null, contatoId: null, dataHora: null, dscr: '' }
      selectedContato.value = null
      dialogVisible.value = true
    }

    const edit = async (row) => {
      form.value = { id: row.codg, contatoId: row.contatoId, dataHora: new Date(row.dataHora), dscr: row.dscr }
      await loadContatosBase()
      // tenta encontrar o contato atual
      const found = contatoStore.contatos.find(c => c.codg === form.value.contatoId || c.id === form.value.contatoId)
      if (found) {
        selectedContato.value = found
      } else if (form.value.contatoId) {
        try {
          const data = await contatoService.getById(form.value.contatoId)
          selectedContato.value = data || null
        } catch {
          selectedContato.value = null
        }
      } else {
        selectedContato.value = null
      }
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

    const onContatoSearch = async (event) => {
      const term = event?.query || ''
      try {
        await contatoStore.searchContatos(term)
      } catch {}
      contatoSuggestions.value = contatoStore.contatos || []
    }

    const onContatoSelect = (e) => {
      const contato = e?.value || null
      selectedContato.value = contato
      form.value.contatoId = (contato?.codg ?? contato?.id) ?? null
    }

    const onContatoClear = () => {
      selectedContato.value = null
      form.value.contatoId = null
    }

    onMounted(async () => {
      await Promise.all([loadAgendamentos(), loadContatosBase()])
    })

    return { agendamentoStore, contatoStore, dialogVisible, form, loading, formTitle, selectedContato, contatoSuggestions, searchQuery, loadAgendamentos, openNew, edit, remove, save, formatDateTime, onContatoSearch, onContatoSelect, onContatoClear, applySearch, clearSearch, reload }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }
</style>


