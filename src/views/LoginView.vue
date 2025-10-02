<template>
  <div class="login-container">
    <div class="left-side">
      <div class="left-content">
        <div class="logo" />
        <h1 class="left-title">
          Bem-vindo ao<br/>
          Agenda Pessoal
        </h1>
        <h2 class="left-subtitle">
          Organize compromissos, reuniões e tarefas com praticidade.<br/>
          Visualização diária, semanal e mensal para máxima clareza.<br/>
          Notificações inteligentes para não perder nenhum horário.
        </h2>
        <h2 class="left-subtitle">Seu tempo, sob controle.</h2>
      </div>
    </div>
    <div class="right-side">
      <div class="form-container">
        <h1 class="form-title">LOGIN</h1>
        <LoginForm />
      </div>
    </div>
    <NotificationToast />
  </div>

</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue'
import NotificationToast from '../components/shared/NotificationToast.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm,
    NotificationToast
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  background-color: #73a9a7;
}

.left-side {
  flex: 1;
  background-image: url('/background-login.png');
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
}

.left-content {
  display: flex;
  flex-direction: column;
}

.logo {
  width: 350px;
  height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 45px;
  background: url('logo-background.png') no-repeat center;
  background-size: contain;
}

.left-title {
  font-family: 'Poppins', sans-serif;
  font-size: 64px;
  color: #ffffff;
  margin-left: 95px;
  text-align: left;
}

.left-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  color: #ffffff;
  margin-left: 95px;
}

.right-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
}

.form-container {
  max-width: 460px;
  width: 100%;
  height: 400px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-title {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 2rem;
  color: #73a9a7;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .left-side {
    height: 50vh;
  }

  .right-side {
    height: 100vh;
    box-shadow: none;
  }
}
</style>