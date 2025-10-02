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
        <i class="pi pi-user mr-2"></i>
        <div class="info">
          <div class="name">{{ authStore.user?.nome }}</div>
          <div class="email">{{ authStore.user?.email }}</div>
        </div>
      </div>
      <Button 
        icon="pi pi-sign-out" 
        label="Sair" 
        class="p-button-text p-button-danger mt-2"
        @click="logout"
      />
    </div>
  </aside>
  
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

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

    return { authStore, isActive, logout }
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
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.18);
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
}

@media (max-width: 992px) {
  .app-sidebar {
    display: none;
  }
}
</style>


