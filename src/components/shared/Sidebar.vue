<template>
  <aside class="app-sidebar">
    <div class="sidebar-header">
      <i class="pi pi-calendar mr-2"></i>
      <span class="brand">Agenda</span>
    </div>

    <nav class="sidebar-menu">
      <router-link 
        class="menu-item" 
        :class="{ active: isActive('/dashboard') }" 
        to="/dashboard"
      >
        <i class="pi pi-chart-line"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link 
        class="menu-item" 
        :class="{ active: isActive('/contatos') }" 
        to="/contatos"
      >
        <i class="pi pi-users"></i>
        <span>Contatos</span>
      </router-link>
    </nav>

    <div class="sidebar-footer" v-if="authStore.isAuthenticated">
      <div class="user-box">
        <Avatar :label="userInitials" icon="pi pi-user" shape="circle" class="user-avatar" />
        <div class="info">
          <div class="name" :title="authStore.user?.nome">{{ authStore.user?.nome }}</div>
          <div class="email" :title="authStore.user?.email">{{ authStore.user?.email }}</div>
          <Tag v-if="authStore.user?.perfil" :value="authStore.user.perfil" severity="secondary" class="user-role" />
        </div>
      </div>
      <Button 
        icon="pi pi-sign-out" 
        label="Sair" 
        severity="danger"
        class="w-full logout-btn"
        @click="logout"
      />
      <div class="mini-footer">
        <span class="version">Agenda v1.0</span>
        <a href="#" class="help-link">
          <i class="pi pi-question-circle mr-1"></i>
          Ajuda
        </a>
      </div>
    </div>
  </aside>
  
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'AppSidebar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const isActive = (path) => router.currentRoute.value.path.startsWith(path)
    const logout = async () => {
      authStore.logout()
      router.push('/login')
    }

    const userInitials = computed(() => {
      const name = (authStore.user?.nome || '').trim()
      if (!name) return ''
      const parts = name.split(/\s+/).filter(Boolean)
      const letters = (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
      return letters.toUpperCase()
    })

    return { authStore, isActive, logout, userInitials }
  }
}
</script>

<style scoped>
.app-sidebar {
  width: 260px;
  background: linear-gradient(180deg, #225c5a 0%, #73a9a7 100%);
  color: #fff;
  border-radius: 12px 0 0 12px;
  padding: 1rem;
  height: calc(100vh - 40px);
  position: sticky;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.brand {
  letter-spacing: 0.5px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
  text-decoration: none;
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  position: relative;
  transition: background-color 0.2s ease, transform 0.12s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.18);
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: #fff;
  border-radius: 3px;
}

.menu-item:active {
  transform: translateY(1px);
}

.sidebar-footer {
  margin-top: auto;
  background: rgba(0,0,0,0.1);
  padding: 0.75rem;
  border-radius: 8px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-box .info {
  display: flex;
  flex-direction: column;
}

.user-box .name {
  font-weight: 600;
}

.user-box .email {
  font-size: 0.85rem;
  opacity: 0.9;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-avatar :deep(.p-avatar-text),
.user-avatar :deep(.p-avatar-icon) {
  font-weight: 700;
}

.user-role {
  margin-top: 0.25rem;
  max-width: max-content;
}

.logout-btn {
  margin-top: 0.75rem;
}

.mini-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  opacity: 0.95;
}

.mini-footer .version {
  color: rgba(255,255,255,0.9);
}

.mini-footer .help-link {
  color: #fff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.mini-footer .help-link:hover {
  text-decoration: underline;
}

@media (max-width: 992px) {
  .app-sidebar {
    display: none;
  }
}
</style>


