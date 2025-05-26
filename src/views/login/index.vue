<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-title">
        <h2>后台管理系统</h2>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <p>默认用户名: admin</p>
        <p>默认密码: 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const loginFormRef = ref();

const loginForm = reactive({
  username: 'admin',
  password: '123456'
});

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      // 模拟登录请求
      setTimeout(() => {
        if (loginForm.username === 'admin' && loginForm.password === '123456') {
          // 实际应用中这里会保存token等登录信息
          localStorage.setItem('token', 'admin-token');
          
          // 提示登录成功
          alert('登录成功');
          
          router.push('/');
        } else {
          // 提示登录失败
          alert('用户名或密码错误');
        }
        loading.value = false;
      }, 800);
    } else {
      return false;
    }
  });
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  background-color: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form-container {
  width: 420px;
  padding: 35px 35px 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
}

.login-title h2 {
  font-size: 26px;
  color: #409eff;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.login-tips {
  font-size: 13px;
  color: #999;
  text-align: center;
}

.login-tips p {
  margin: 5px 0;
}
</style> 