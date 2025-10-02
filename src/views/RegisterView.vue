<template>
  <div class="login-container">
    <div class="left-side">
      <div class="left-content">
        <div class="logo" />
        <h1 class="left-title">
          Crie sua conta<br/>
          e comece a organizar
        </h1>
        <h2 class="left-subtitle">
          Sincronize seus eventos, defina lembretes e personalize suas preferências.
        </h2>
        <h2 class="left-subtitle">Agende sem complicações.</h2>
      </div>
    </div>
    <div class="right-side">
      <div class="form-container">
        <h1 class="form-title">REGISTRO</h1>
        <RegisterForm />
      </div>
    </div>
    <NotificationToast />
  </div>
</template>

<script>
import RegisterForm from '../components/auth/RegisterForm.vue'
import NotificationToast from '../components/shared/NotificationToast.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm,
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
  font-size: 48px;
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
  max-width: 600px;
  width: 100%;
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