<template>
  <div class="dashboard-view">
    <div class="grid dashboard-grid no-page-scroll">
      <div class="col-12 lg:col-9">
        <div class="panel calendar-panel no-border">
          <div class="panel-content no-padding">
            <div class="calendar-infobar">
              <div class="stat">
                <i class="pi pi-calendar"></i>
                <span class="label">Hoje</span>
                <span class="sep">—</span>
                <strong class="value">{{ todayLabel }}</strong>
              </div>
              <Divider layout="vertical" />
              <div class="stat">
                <i class="pi pi-bell"></i>
                <span class="label">Agendamentos de hoje</span>
                <Tag :value="eventsTodayLabel" severity="info" class="ml-2" />
              </div>
              <Divider layout="vertical" />
              <div class="stat">
                <i class="pi pi-clock"></i>
                <span class="label">Próximos 7 dias</span>
                <Tag :value="eventsNext7Label" severity="success" class="ml-2" />
              </div>
              <div class="spacer"></div>
              <div class="period">
                <SelectButton 
                  v-model="period"
                  :options="periodOptions"
                  optionLabel="label"
                  dataKey="value"
                />
              </div>
            </div>

            <div class="calendar-wrapper">
              <Calendar 
                v-model="selectedDate" 
                inline 
                :showWeek="true"
              >
                <template #date="slotProps">
                  <div 
                    class="custom-day"
                    :class="{ 
                      'has-event': hasEventInPeriod(toJsDate(slotProps.date)), 
                      'is-hover': hoveredEventDate && sameDay(hoveredEventDate, toJsDate(slotProps.date))
                    }"
                    @mouseenter="onDayHover(toJsDate(slotProps.date))"
                    @mouseleave="onDayHover(null)"
                    @click="onDayClick(toJsDate(slotProps.date))"
                  >
                    {{ slotProps.date.day }}
                    <span 
                      v-if="eventsCountWithinPeriod(toJsDate(slotProps.date)) > 0" 
                      class="day-counter"
                      v-tooltip.top="getDayTooltip(toJsDate(slotProps.date))"
                    >
                      {{ displayCountWithinPeriod(toJsDate(slotProps.date)) }}
                    </span>
                  </div>
                </template>
              </Calendar>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-3">
        <div class="panel list-panel no-border">
          <div class="panel-content appointments scrollable">
            <div v-if="upcomingAppointments.length">
              <ul class="list">
                <li 
                  v-for="(appt, idx) in upcomingAppointments" 
                  :key="idx" 
                  class="list-item"
                  @mouseenter="hoveredEventDate = appt.date"
                  @mouseleave="hoveredEventDate = null"
                  @click="focusDate(appt.date)"
                  :class="{ highlight: hoveredEventDate && sameDay(hoveredEventDate, appt.date) }"
                >
                  <div class="row">
                    <div class="left">
                      <Avatar icon="pi pi-user" class="mr-3" shape="circle" />
                    </div>
                    <div class="center">
                      <div class="title">{{ appt.title }}</div>
                      <div class="meta">
                        <i class="pi pi-calendar mr-1"></i>
                        <span class="meta-text">{{ formatDate(appt.date) }}</span>
                        <span class="sep">•</span>
                        <i class="pi pi-map-marker mr-1"></i>
                        <span class="meta-text">{{ appt.location || 'Remoto' }}</span>
                      </div>
                    </div>
                    <div class="right">
                      <Tag :value="appt.type || 'Reunião'" :severity="tagSeverity(appt.type)" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else class="text-color-secondary text-center py-4">
              <i class="pi pi-inbox text-3xl mb-2"></i>
              <p>Nenhum agendamento futuro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'DashboardView',
  setup() {
    const selectedDate = ref(new Date())
    const hoveredEventDate = ref(null)

    const appointments = ref([
      { title: 'Reunião com Maria', date: addDays(new Date(), 1), type: 'Reunião', location: 'Escritório' },
      { title: 'Chamada com João', date: addDays(new Date(), 2), type: 'Chamada', location: 'Remoto' },
      { title: 'Visita ao cliente ACME', date: addDays(new Date(), 4), type: 'Visita', location: 'Cliente' },
      { title: 'Revisão de proposta', date: addDays(new Date(), 7), type: 'Revisão', location: 'Remoto' },
      { title: 'Demo do produto', date: addDays(new Date(), 10), type: 'Demo', location: 'Cliente' },
      { title: 'Onboarding novo cliente', date: addDays(new Date(), 15), type: 'Onboarding', location: 'Remoto' }
    ])

    const period = ref({ label: '7 dias', value: 7 })
    const periodOptions = ref([
      { label: 'Hoje', value: 0 },
      { label: '7 dias', value: 7 },
      { label: '30 dias', value: 30 }
    ])

    const upcomingAppointments = computed(() => {
      const now = new Date()
      const end = period.value.value === 0 ? now : addDays(now, period.value.value)
      return [...appointments.value]
        .filter(a => a.date >= now && a.date <= end)
        .sort((a, b) => a.date - b.date)
        .slice(0, 12)
    })

    const eventsToday = computed(() => appointments.value.filter(a => sameDay(a.date, new Date())).length)
    const eventsNext7 = computed(() => appointments.value.filter(a => {
      const now = new Date()
      const in7 = addDays(now, 7)
      return a.date >= now && a.date <= in7
    }).length)

    const todayLabel = computed(() => {
      const d = new Date()
      return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    })

    const eventsTodayLabel = computed(() => String(eventsToday.value || 0))
    const eventsNext7Label = computed(() => String(eventsNext7.value || 0))

    function addDays(date, days) {
      const d = new Date(date)
      d.setDate(d.getDate() + days)
      return d
    }

    function formatDate(date) {
      return new Date(date).toLocaleString('pt-BR', {
        weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    }

    function sameDay(a, b) {
      return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    }

    function hasEvent(date) {
      return appointments.value.some(a => sameDay(a.date, date))
    }

    function hasEventInPeriod(date) {
      if (!date) return false
      return isInPeriod(date) && hasEvent(date)
    }

    function toJsDate(meta) {
      // PrimeVue Calendar date slot envia DateMeta { day, month, year, ... }
      if (meta instanceof Date) return meta
      if (!meta) return null
      return new Date(meta.year, meta.month, meta.day)
    }

    function startOfDay(date) {
      const d = new Date(date)
      d.setHours(0, 0, 0, 0)
      return d
    }

    function endOfDay(date) {
      const d = new Date(date)
      d.setHours(23, 59, 59, 999)
      return d
    }

    function isInPeriod(date) {
      if (!date) return false
      const now = new Date()
      const start = startOfDay(now)
      const end = period.value && Number.isFinite(period.value.value) && period.value.value > 0 
        ? endOfDay(addDays(now, period.value.value)) 
        : endOfDay(now)
      return date >= start && date <= end
    }

    function getDayTooltip(date) {
      const items = appointments.value
        .filter(a => isInPeriod(date) && sameDay(a.date, date))
        .slice(0, 5)
        .map(a => `${formatTime(a.date)} — ${a.title}`)
      const more = eventsCountWithinPeriod(date) - items.length
      return items.join('\n') + (more > 0 ? `\n+${more} mais...` : '')
    }

    function formatTime(date) {
      return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }

    function eventsCount(date) {
      if (!date) return 0
      return appointments.value.filter(a => sameDay(a.date, date)).length
    }

    function displayCount(date) {
      const count = eventsCount(date)
      if (count <= 0) return ''
      return count > 9 ? '9+' : String(count)
    }

    function eventsCountWithinPeriod(date) {
      if (!date) return 0
      return appointments.value.filter(a => isInPeriod(date) && sameDay(a.date, date)).length
    }

    function displayCountWithinPeriod(date) {
      const count = eventsCountWithinPeriod(date)
      return count > 9 ? '9+' : String(count)
    }

    function onDayClick(date) {
      const first = appointments.value.find(a => sameDay(a.date, date))
      if (first) {
        hoveredEventDate.value = first.date
      }
    }

    function onDayHover(date) {
      if (!date) { hoveredEventDate.value = null; return }
      const first = appointments.value.find(a => sameDay(a.date, date))
      if (first) hoveredEventDate.value = first.date
    }

    function focusDate(date) {
      selectedDate.value = new Date(date)
      onDayHover(date)
    }

    function tagSeverity(type) {
      switch ((type || '').toLowerCase()) {
        case 'reunião': return 'info'
        case 'chamada': return 'warning'
        case 'visita': return 'success'
        case 'revisão': return 'secondary'
        case 'demo': return 'help'
        case 'onboarding': return 'primary'
        default: return 'info'
      }
    }

    return { selectedDate, upcomingAppointments, formatDate, hasEvent, sameDay, onDayClick, onDayHover, hoveredEventDate, toJsDate, focusDate, eventsToday, eventsNext7, tagSeverity, todayLabel, period, periodOptions, isInPeriod, eventsCount, displayCount, hasEventInPeriod, eventsCountWithinPeriod, displayCountWithinPeriod, getDayTooltip, eventsTodayLabel, eventsNext7Label }
  }
}
</script>

<style scoped>
.calendar-infobar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-200);
}

.calendar-infobar .stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.calendar-infobar .stat i {
  color: var(--primary-600);
}

.calendar-infobar .label {
  font-weight: 600;
  color: var(--text-primary);
}

.calendar-infobar .value {
  text-transform: capitalize;
}

.calendar-infobar .sep {
  color: var(--text-muted);
}

.calendar-infobar .spacer { flex: 1; }

.calendar-infobar .period :deep(.p-selectbutton .p-button) {
  padding: 0.5rem 0.75rem;
}
.calendar-wrapper {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-wrapper :deep(.p-datepicker) {
  width: 100%;
}

.custom-day {
  position: relative;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.1rem;
}

.custom-day.has-event { box-shadow: none; }

.custom-day.has-event::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 3px;
  border-radius: 2px;
  background: var(--primary-600);
}

.custom-day.is-hover {
  box-shadow: 0 0 0 2px var(--primary-700) inset;
}

.custom-day.in-range:not(.has-event) { }

.custom-day.is-hover.has-event::after {
  background: var(--primary-700);
  width: 18px;
}

.day-counter {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--primary-600);
  color: #fff;
  font-size: 0.7rem;
  line-height: 16px;
  text-align: center;
}

.appointments .list {
  list-style: none;
  padding-left: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.appointments .list-item {
  display: flex;
  flex-direction: column;
  background: var(--surface-50);
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.appointments .list-item:hover,
.appointments .list-item.highlight {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  border-color: var(--primary-200, #A5E3EF);
  background: var(--surface-0);
}

.appointments .when {
  font-weight: 600;
  color: var(--text-primary);
}

.appointments .what {
  color: var(--text-secondary);
}

.appointments .row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.25rem 0.75rem;
}

.appointments .title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
}

.appointments .meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
}

.appointments .meta-text {
  margin-right: 0.25rem;
}

.panel {
  background: var(--surface-0);
  border: none;
  border-radius: 0;
  box-shadow: none;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.panel.calendar-panel {
  border-left: none;
}

.panel .panel-content {
  flex: 1;
  padding: 0.75rem 1rem;
}

.no-border { border: none; box-shadow: none; }
.no-padding { padding: 0; }

.scrollable {
  overflow: auto;
  max-height: calc(100vh - 140px);
}

.dashboard-grid {
  margin-left: 0;
}
</style>


