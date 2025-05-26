<template>
  <div class="products-container">
    <div class="filter-container">
      <el-form :inline="true" :model="filterForm" class="form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="filterForm.name" placeholder="请输入产品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="在售" value="on_sale"></el-option>
            <el-option label="下架" value="off_sale"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
            <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-container">
      <el-button type="primary" @click="handleAdd">添加产品</el-button>
      <el-button type="danger" :disabled="!selectedProducts.length" @click="handleBatchDelete">批量删除</el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      :data="productList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="产品图片" width="100">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.image"
            fit="cover"
            :preview-src-list="[scope.row.image]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称" width="200" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="price" label="价格" width="120">
        <template #default="scope">
          ¥{{ scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" width="100" />
      <el-table-column prop="sales" label="销量" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'on_sale' ? 'success' : 'info'">
            {{ scope.row.status === 'on_sale' ? '在售' : '下架' }}
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
            {{ scope.row.status === 'on_sale' ? '下架' : '上架' }}
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

    <!-- 产品表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加产品' : '编辑产品'"
      width="600px"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品分类" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择分类">
            <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品图片" prop="image">
          <el-upload
            class="product-image-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleImageSuccess"
          >
            <img v-if="productForm.image" :src="productForm.image" class="product-image" />
            <el-icon v-else class="product-image-uploader-icon"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="productForm.price" :precision="2" :min="0" :step="0.1" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="productForm.stock" :min="0" :step="1" style="width: 100%"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="on_sale">在售</el-radio>
            <el-radio label="off_sale">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="productForm.description" type="textarea" rows="4" placeholder="请输入产品描述"></el-input>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

// 分类数据
const categories = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '家居用品', value: 'home' },
  { label: '食品', value: 'food' },
  { label: '图书', value: 'books' }
];

// 筛选表单
const filterForm = reactive({
  name: '',
  status: '',
  category: ''
});

// 表格加载状态
const tableLoading = ref(false);

// 选中的产品
const selectedProducts = ref([]);

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100
});

// 产品列表数据
const productList = ref([
  {
    id: 1,
    name: '智能手机',
    category: '电子产品',
    image: 'https://via.placeholder.com/60',
    price: 1999.00,
    stock: 100,
    sales: 50,
    status: 'on_sale',
    description: '最新款智能手机，功能强大。'
  },
  {
    id: 2,
    name: '休闲T恤',
    category: '服装',
    image: 'https://via.placeholder.com/60',
    price: 89.00,
    stock: 200,
    sales: 80,
    status: 'on_sale',
    description: '舒适透气的休闲T恤。'
  },
  {
    id: 3,
    name: '智能音箱',
    category: '电子产品',
    image: 'https://via.placeholder.com/60',
    price: 299.00,
    stock: 50,
    sales: 30,
    status: 'on_sale',
    description: '智能语音控制音箱。'
  },
  {
    id: 4,
    name: '茶几',
    category: '家居用品',
    image: 'https://via.placeholder.com/60',
    price: 399.00,
    stock: 20,
    sales: 5,
    status: 'off_sale',
    description: '现代简约风格茶几。'
  }
]);

// 对话框相关
const dialogVisible = ref(false);
const dialogType = ref('add'); // 'add' 或 'edit'
const productFormRef = ref();
const productForm = reactive({
  id: '',
  name: '',
  category: '',
  image: '',
  price: 0,
  stock: 0,
  sales: 0,
  status: 'on_sale',
  description: ''
});

// 表单验证规则
const productRules = {
  name: [
    { required: true, message: '请输入产品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  image: [{ required: true, message: '请上传产品图片', trigger: 'change' }],
  price: [{ required: true, message: '请输入产品价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入产品库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择产品状态', trigger: 'change' }]
};

// 搜索
const handleSearch = () => {
  // 实际应用中这里会调用API进行搜索
  console.log('搜索条件：', filterForm);
  pagination.currentPage = 1;
  fetchProductList();
};

// 重置搜索表单
const resetForm = () => {
  filterForm.name = '';
  filterForm.status = '';
  filterForm.category = '';
  fetchProductList();
};

// 获取产品列表
const fetchProductList = () => {
  // 模拟API请求
  tableLoading.value = true;
  setTimeout(() => {
    // 实际应用中这里会从后端获取数据
    tableLoading.value = false;
  }, 500);
};

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedProducts.value = selection;
};

// 处理图片上传成功
const handleImageSuccess = (response) => {
  // 实际应用中这里会处理上传图片后的返回URL
  productForm.image = response.url || 'https://via.placeholder.com/60';
};

// 添加产品
const handleAdd = () => {
  dialogType.value = 'add';
  productForm.id = '';
  productForm.name = '';
  productForm.category = '';
  productForm.image = '';
  productForm.price = 0;
  productForm.stock = 0;
  productForm.sales = 0;
  productForm.status = 'on_sale';
  productForm.description = '';
  dialogVisible.value = true;
};

// 编辑产品
const handleEdit = (row) => {
  dialogType.value = 'edit';
  productForm.id = row.id;
  productForm.name = row.name;
  productForm.category = categories.find(c => c.label === row.category)?.value || '';
  productForm.image = row.image;
  productForm.price = row.price;
  productForm.stock = row.stock;
  productForm.sales = row.sales;
  productForm.status = row.status;
  productForm.description = row.description;
  dialogVisible.value = true;
};

// 更改产品状态
const handleChangeStatus = (row) => {
  const newStatus = row.status === 'on_sale' ? 'off_sale' : 'on_sale';
  const statusText = newStatus === 'on_sale' ? '上架' : '下架';
  
  ElMessageBox.confirm(`确定要${statusText}产品 ${row.name} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API更改状态
    row.status = newStatus;
    ElMessage({
      type: 'success',
      message: `产品已${statusText}`
    });
  }).catch(() => {
    // 取消操作
  });
};

// 删除产品
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除产品 ${row.name} 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API删除产品
    productList.value = productList.value.filter(item => item.id !== row.id);
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
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要删除的产品');
    return;
  }
  
  const productNames = selectedProducts.value.map(item => item.name).join('、');
  ElMessageBox.confirm(`确定要删除以下产品吗: ${productNames}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实际应用中这里会调用API批量删除产品
    const ids = selectedProducts.value.map(item => item.id);
    productList.value = productList.value.filter(item => !ids.includes(item.id));
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
  productFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 添加产品
        const newProduct = {
          id: productList.value.length + 1,
          name: productForm.name,
          category: categories.find(c => c.value === productForm.category)?.label || '',
          image: productForm.image,
          price: productForm.price,
          stock: productForm.stock,
          sales: 0,
          status: productForm.status,
          description: productForm.description
        };
        productList.value.unshift(newProduct);
        ElMessage.success('添加成功');
      } else {
        // 编辑产品
        const index = productList.value.findIndex(item => item.id === productForm.id);
        if (index !== -1) {
          productList.value[index].name = productForm.name;
          productList.value[index].category = categories.find(c => c.value === productForm.category)?.label || '';
          productList.value[index].image = productForm.image;
          productList.value[index].price = productForm.price;
          productList.value[index].stock = productForm.stock;
          productList.value[index].status = productForm.status;
          productList.value[index].description = productForm.description;
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
const handleSizeChange = (val) => {
  pagination.pageSize = val;
  fetchProductList();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  fetchProductList();
};

// 初始化
fetchProductList();
</script>

<style scoped>
.products-container {
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

.product-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image-uploader:hover {
  border-color: #409eff;
}

.product-image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
}

.product-image {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style> 