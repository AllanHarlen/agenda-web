import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Importações diretas para evitar problemas de lazy loading inicial
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ContatoListView from '../views/ContatoListView.vue'
import DashboardView from '../views/DashboardView.vue'
import AgendamentoListView from '../views/AgendamentoListView.vue'
import AgendamentoCalendarView from '../views/AgendamentoCalendarView.vue'
import PublicHomeView from '../views/PublicHomeView.vue'
import PreCadastroView from '../views/PreCadastroView.vue'
import PreCadastroConfirmacaoView from '../views/PreCadastroConfirmacaoView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: PublicHomeView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'ASPJ-PE - Início' }
  },
  {
    path: '/pre-cadastro',
    name: 'pre-cadastro',
    component: PreCadastroView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'Pré-Cadastro - ASPJ-PE' }
  },
  {
    path: '/pre-cadastro/confirmacao',
    name: 'pre-cadastro-confirmacao',
    component: PreCadastroConfirmacaoView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'Confirmação - ASPJ-PE' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard - ASPJ-PE' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'Login - ASPJ-PE' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false, hideNavbar: true, title: 'Registro - ASPJ-PE' }
  },
  {
    path: '/contatos',
    name: 'contatos',
    component: ContatoListView,
    meta: { requiresAuth: true, title: 'Contatos - ASPJ-PE' }
  },
  {
    path: '/agendamentos',
    name: 'agendamentos',
    component: AgendamentoListView,
    meta: { requiresAuth: true, title: 'Agendamentos - ASPJ-PE' }
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: AgendamentoCalendarView,
    meta: { requiresAuth: true, title: 'Calendário - ASPJ-PE' }
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
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

// Atualizar título da página
router.afterEach((to) => {
  const title = to.meta.title || 'ASPJ-PE - Associação dos Servidores do Poder Judiciário de Pernambuco'
  document.title = title
})

export default router