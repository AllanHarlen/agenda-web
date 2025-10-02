import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// ✅ CORREÇÃO: Importe os estilos DO SEU PRÓPRIO PROJETO
// Remova qualquer referência a unpkg.com ou CDN externo
import '@/styles/primevue-styles.css'  // Criaremos este arquivo

// ✅ Importe os componentes PrimeVue individualmente
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import ProgressSpinner from 'primevue/progressspinner'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import SelectButton from 'primevue/selectbutton'

const app = createApp(App)
const pinia = createPinia()

// Locale pt-BR para PrimeVue Calendar e componentes de data
const ptBRLocale = {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sem'
}

// Use plugins
app.use(pinia)
app.use(router)
app.use(PrimeVue, { ripple: true, inputStyle: 'filled', locale: ptBRLocale })
app.use(ToastService)

// Directives
app.directive('tooltip', Tooltip)

// ✅ Registro manual de componentes (evita auto-import)
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Card', Card)
app.component('Toolbar', Toolbar)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Badge', Badge)
app.component('Dropdown', Dropdown)
app.component('Password', Password)
app.component('Divider', Divider)
app.component('Checkbox', Checkbox)
app.component('Calendar', Calendar)
app.component('Tag', Tag)
app.component('Avatar', Avatar)
app.component('SelectButton', SelectButton)

app.mount('#app')