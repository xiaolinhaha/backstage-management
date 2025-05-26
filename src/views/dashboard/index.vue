<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statCards" :key="index">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-title">{{ item.title }}</div>
          </div>
          <el-icon class="stat-icon" :class="item.color">
            <component :is="item.icon"></component>
          </el-icon>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>月度收入</span>
            </div>
          </template>
          <div class="chart-container" style="height: 350px;">
            <!-- Chart placeholder -->
            <div class="chart-placeholder">
              <el-empty description="图表数据加载中"></el-empty>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售数据</span>
            </div>
          </template>
          <div class="chart-container" style="height: 350px;">
            <!-- Chart placeholder -->
            <div class="chart-placeholder">
              <el-empty description="图表数据加载中"></el-empty>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>最近订单</span>
              <el-button class="button" type="text">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="id" label="订单号" width="180" />
            <el-table-column prop="customer" label="客户" width="180" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button class="button" type="text">查看更多</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :timestamp="activity.timestamp"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statCards = ref([
  { title: '总收入', value: '¥45,231.89', icon: 'Money', color: 'green' },
  { title: '订阅用户', value: '2,350', icon: 'User', color: 'blue' },
  { title: '销售额', value: '12,234', icon: 'ShoppingCart', color: 'orange' },
  { title: '活跃用户', value: '573', icon: 'Goods', color: 'purple' },
]);

const recentOrders = ref([
  { id: 'ORD-001', customer: '张三', amount: '¥1,999.00', status: '已完成' },
  { id: 'ORD-002', customer: '李四', amount: '¥839.00', status: '处理中' },
  { id: 'ORD-003', customer: '王五', amount: '¥299.00', status: '已完成' },
  { id: 'ORD-004', customer: '赵六', amount: '¥99.00', status: '已完成' },
]);

const recentActivities = ref([
  { content: '完成了订单 ORD-001', timestamp: '2023-05-20 12:30', type: 'success' },
  { content: '用户张三注册成功', timestamp: '2023-05-19 10:15', type: 'primary' },
  { content: '系统更新完成', timestamp: '2023-05-18 08:00', type: 'warning' },
  { content: '新增产品上线', timestamp: '2023-05-17 16:45', type: 'info' },
]);
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  height: 120px;
}

.stat-content {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.stat-icon {
  position: absolute;
  font-size: 64px;
  opacity: 0.2;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.green {
  color: #67C23A;
}

.blue {
  color: #409EFF;
}

.orange {
  color: #E6A23C;
}

.purple {
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.table-card {
  margin-bottom: 20px;
}
</style> 