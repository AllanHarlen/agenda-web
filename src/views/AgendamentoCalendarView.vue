<template>
  <div class="agendamento-calendar-view">
    <Toolbar class="toolbar">
      <template #start>
        <span class="text-2xl font-bold text-white">📅 Calendário</span>
      </template>
      <template #end>
        <span class="mr-2">Dias:</span>
        <InputNumber v-model="days" :min="1" :max="60" showButtons />
        <Button icon="pi pi-refresh" class="p-button-text ml-2" :loading="loading" @click="loadCalendar" />
      </template>
    </Toolbar>

    <Card class="main-card mt-2">
      <template #content>
        <div v-if="loading" class="text-center py-4">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Carregando calendário...</p>
        </div>
        <div v-else>
          <p class="mb-2">Período: {{ calendar.startDate }} → {{ calendar.endDate }}</p>
          <DataTable :value="calendar.events" :paginator="true" :rows="10">
            <Column field="date" header="Data"></Column>
            <Column field="time" header="Hora"></Column>
            <Column field="contatoNome" header="Contato"></Column>
            <Column field="title" header="Título"></Column>
            <Column field="description" header="Descrição"></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAgendamentoStore } from '@/stores/agendamentoStore'

export default {
  name: 'AgendamentoCalendarView',
  setup() {
    const agendamentoStore = useAgendamentoStore()
    const days = ref(7)
    const loading = computed(() => agendamentoStore.loading)
    const calendar = computed(() => agendamentoStore.calendar)

    const loadCalendar = async () => {
      await agendamentoStore.loadCalendar({ days: days.value })
    }

    onMounted(loadCalendar)

    return { agendamentoStore, days, loading, calendar, loadCalendar }
  }
}
</script>

<style scoped>
.main-card { margin-top: 1rem; }
</style>


