import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Importações diretas para evitar problemas de lazy loading inicial
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ContatoListView from '../views/ContatoListView.vue'
import DashboardView from '../views/DashboardView.vue'
import AgendamentoListView from '../views/AgendamentoListView.vue'
import AgendamentoCalendarView from '../views/AgendamentoCalendarView.vue'

// Gestão
import PatrimonioListView from '../views/PatrimonioListView.vue'
import PatrimonioFormView from '../views/PatrimonioFormView.vue'
import AfiliadoListView from '../views/AfiliadoListView.vue'
import AfiliadoFormView from '../views/AfiliadoFormView.vue'
import EquipamentoListView from '../views/EquipamentoListView.vue'
import EquipamentoFormView from '../views/EquipamentoFormView.vue'

// Área do Associado
import FinanceiroView from '../views/FinanceiroView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard - Agenda' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false, hideNavbar: true }
  },
  {
    path: '/contatos',
    name: 'contatos',
    component: ContatoListView,
    meta: { requiresAuth: true, title: 'Contatos - Agenda' }
  },
  {
    path: '/agendamentos',
    name: 'agendamentos',
    component: AgendamentoListView,
    meta: { requiresAuth: true, title: 'Agendamentos - Agenda' }
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: AgendamentoCalendarView,
    meta: { requiresAuth: true, title: 'Calendário - Agenda' }
  },
  // Patrimônios
  {
    path: '/patrimonios',
    name: 'patrimonios',
    component: PatrimonioListView,
    meta: { requiresAuth: true, title: 'Patrimônios - Agenda' }
  },
  {
    path: '/patrimonios/novo',
    name: 'patrimonio-novo',
    component: PatrimonioFormView,
    meta: { requiresAuth: true, title: 'Novo Patrimônio - Agenda' }
  },
  {
    path: '/patrimonios/editar/:id',
    name: 'patrimonio-editar',
    component: PatrimonioFormView,
    meta: { requiresAuth: true, title: 'Editar Patrimônio - Agenda' }
  },
  // Afiliados
  {
    path: '/afiliados',
    name: 'afiliados',
    component: AfiliadoListView,
    meta: { requiresAuth: true, title: 'Afiliados - Agenda' }
  },
  {
    path: '/afiliados/novo',
    name: 'afiliado-novo',
    component: AfiliadoFormView,
    meta: { requiresAuth: true, title: 'Novo Afiliado - Agenda' }
  },
  {
    path: '/afiliados/editar/:id',
    name: 'afiliado-editar',
    component: AfiliadoFormView,
    meta: { requiresAuth: true, title: 'Editar Afiliado - Agenda' }
  },
  // Equipamentos
  {
    path: '/equipamentos',
    name: 'equipamentos',
    component: EquipamentoListView,
    meta: { requiresAuth: true, title: 'Equipamentos - Agenda' }
  },
  {
    path: '/equipamentos/novo',
    name: 'equipamento-novo',
    component: EquipamentoFormView,
    meta: { requiresAuth: true, title: 'Novo Equipamento - Agenda' }
  },
  {
    path: '/equipamentos/editar/:id',
    name: 'equipamento-editar',
    component: EquipamentoFormView,
    meta: { requiresAuth: true, title: 'Editar Equipamento - Agenda' }
  },
  // Área Pública
  {
    path: '/associe-se',
    name: 'associe-se',
    component: AfiliadoFormView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'Associe-se - Agenda' }
  },
  // Área do Associado
  {
    path: '/financeiro',
    name: 'financeiro',
    component: FinanceiroView,
    meta: { requiresAuth: true, title: 'Área Financeira - Agenda' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Guard global de autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authStore = useAuthStore()
  // Considera sessão persistida no localStorage
  const isAuthenticated = authStore.isAuthenticated || !!localStorage.getItem('authToken')

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'contatos' })
  } else {
    next()
  }
})

// Atualizar título da página
router.afterEach((to) => {
  const title = to.meta.title || 'Agenda Blue Technology'
  document.title = title
})

export default router