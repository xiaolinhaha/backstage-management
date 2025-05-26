<template>
  <div class="users-container">
    <div class="filter-container">
      <el-form :inline="true" :model="filterForm" class="form-inline">
        <el-form-item label="用户名">
          <el-input v-model="filterForm.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="激活" value="active"></el-option>
            <el-option label="禁用" value="disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-container">
      <el-button type="primary" @click="handleAdd">添加用户</el-button>
      <el-button type="danger" :disabled="!selectedUsers.length" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="email" label="邮箱" width="220" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
            {{ scope.row.status === 'active' ? '激活' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="230">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button 
            size="small" 
            type="success" 
            @click="handleChangeStatus(scope.row)"
          >
            {{ scope.row.status === 'active' ? '禁用' : '激活' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:currentPage="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="编辑" value="editor"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">激活</el-radio>
            <el-radio label="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus/es';

// 用户接口定义
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createTime: string;
  status: string;
}

// 筛选表单
const filterForm = reactive({
  username: '',
  status: ''
});

// 表格加载状态
const tableLoading = ref(false);

// 选中的用户
const selectedUsers = ref<User[]>([]);

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
});

// 用户列表数据
const userList = ref<User[]>([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: '管理员',
    createTime: '2023-01-10 10:00:00',
    status: 'active'
  },
  {
    id: 2,
    username: 'editor',
    email: 'editor@example.com',
    role: '编辑',
    createTime: '2023-01-15 11:30:00',
    status: 'active'
  },
  {
    id: 3,
    username: 'user1',
    email: 'user1@example.com',
    role: '用户',
    createTime: '2023-02-05 09:15:00',
    status: 'active'
  },
  {
    id: 4,
    username: 'user2',
    email: 'user2@example.com',
    role: '用户',
    createTime: '2023-02-10 14:20:00',
    status: 'disabled'
  }
]);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const userFormRef = ref();
const userForm = reactive({
  id: null as number | null,
  username: '',
  email: '',
  password: '',
  role: '',
  status: 'active'
});

// 表单验证规则
const userRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
};

// 搜索
const handleSearch = () => {
  // 实际应用中这里会调用API进行搜索
  console.log('搜索条件：', filterForm);
  pagination.currentPage = 1;
  fetchUserList();
};

// 重置搜索表单
const resetForm = () => {
  filterForm.username = '';
  filterForm.status = '';
  fetchUserList();
};

// 获取用户列表
const fetchUserList = () => {
  // 模拟API请求
  tableLoading.value = true;
  setTimeout(() => {
    // 实际应用中这里会从后端获取数据
    tableLoading.value = false;
  }, 500);
};

// 处理表格选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection;
};

// 添加用户
const handleAdd = () => {
  dialogType.value = 'add';
  userForm.id = null;
  userForm.username = '';
  userForm.email = '';
  userForm.password = '';
  userForm.role = '';
  userForm.status = 'active';
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit';
  userForm.id = row.id;
  userForm.username = row.username;
  userForm.email = row.email;
  userForm.password = '';
  userForm.role = row.role === '管理员' ? 'admin' : (row.role === '编辑' ? 'editor' : 'user');
  userForm.status = row.status;
  dialogVisible.value = true;
};

// 更改用户状态
const handleChangeStatus = (row: User) => {
  const newStatus = row.status === 'active' ? 'disabled' : 'active';
  const statusText = newStatus === 'active' ? '激活' : '禁用';
  
  ElMessageBox.confirm(`确定要${statusText}用户 ${row.username} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API更改状态
    row.status = newStatus;
    ElMessage({
      type: 'success',
      message: `用户已${statusText}`
    });
  }).catch(() => {
    // 取消操作
  });
};

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API删除用户
    userList.value = userList.value.filter(item => item.id !== row.id);
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
  }).catch(() => {
    // 取消操作
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  
  const usernames = selectedUsers.value.map(item => item.username).join('、');
  ElMessageBox.confirm(`确定要删除以下用户吗: ${usernames}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API批量删除用户
    const ids = selectedUsers.value.map(item => item.id);
    userList.value = userList.value.filter(item => !ids.includes(item.id));
    ElMessage({
      type: 'success',
      message: '删除成功'
    });
  }).catch(() => {
    // 取消操作
  });
};

// 提交表单
const submitForm = () => {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 添加用户
        const newUser: User = {
          id: userList.value.length + 1,
          username: userForm.username,
          email: userForm.email,
          role: userForm.role === 'admin' ? '管理员' : (userForm.role === 'editor' ? '编辑' : '用户'),
          createTime: new Date().toLocaleString(),
          status: userForm.status
        };
        userList.value.unshift(newUser);
        // @ts-ignore: ElementPlus 自动导入
        ElMessage.success('添加成功');
      } else {
        // 编辑用户
        const index = userList.value.findIndex(item => item.id === userForm.id);
        if (index !== -1) {
          userList.value[index].username = userForm.username;
          userList.value[index].email = userForm.email;
          userList.value[index].role = userForm.role === 'admin' ? '管理员' : (userForm.role === 'editor' ? '编辑' : '用户');
          userList.value[index].status = userForm.status;
          // @ts-ignore: ElementPlus 自动导入
          ElMessage.success('更新成功');
        }
      }
      dialogVisible.value = false;
    } else {
      return false;
    }
  });
};

// 分页相关
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  fetchUserList();
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  fetchUserList();
};

// 初始化
fetchUserList();
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.action-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 