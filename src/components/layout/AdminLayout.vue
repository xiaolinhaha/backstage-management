<template>
  <div class="admin-layout">
    <el-container class="layout-container">
      <!-- 左侧边栏 -->
      <el-aside width="220px" class="sidebar">
        <div class="logo">
          <h2>{{ title }}</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/products">
            <el-icon><ShoppingCart /></el-icon>
            <span>产品管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container class="main-container">
        <!-- 顶部头部 -->
        <el-header class="header">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentRoute?.name">{{ getRouteTitle() }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                管理员 <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowDown, Odometer, User, ShoppingCart } from '@element-plus/icons-vue';

const title = ref('后台管理系统');
const route = useRoute();

// 获取当前活动的菜单项
const activeMenu = computed(() => {
  return route.path;
});

// 获取当前路由信息用于面包屑导航
const currentRoute = computed(() => {
  return route;
});

// 获取路由标题
const getRouteTitle = () => {
  const routeNames: Record<string, string> = {
    'Dashboard': '仪表盘',
    'Users': '用户管理',
    'Products': '产品管理'
  };
  return routeNames[route.name as string] || route.name;
};
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-container {
  height: 100%;
  width: 100%;
}

.sidebar {
  background-color: #001529;
  color: white;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
}

.sidebar-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.main-container {
  height: 100vh;
  width: calc(100vw - 220px);
  display: flex;
  flex-direction: column;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 60px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
</style> 