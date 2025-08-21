<script setup lang="ts">
import type { FormInstance, TableColumnsType } from 'ant-design-vue';

import { h, onMounted, reactive, ref } from 'vue';

import { VbenTree } from '@vben/common-ui';

import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  RadioButton,
  RadioGroup,
  Table,
} from 'ant-design-vue';

import {
  createRoleApi,
  listRoleApi,
  partialUpdateRoleApi,
  removeRoleApi,
  treeMenuApi,
  updateRoleApi,
} from '#/api';
import { Switch } from '#/components';

defineOptions({ name: 'RolePage' });

const FormItem = Form.Item;

const roles = ref<API.Role[]>([]);
const total = ref(0);
const loading = ref(false);
const formLoading = ref(false);
const params = reactive<API.RoleParams>({});
const open = ref(false);
const formRef = ref<FormInstance>();
const menus = ref<API.TreeMenu[]>([]);
const model = reactive<Omit<API.Role, 'id'> & { id?: number }>({
  name: '',
  label: '',
  status: true,
  createTime: '',
  menus: [],
});

const rules = {
  name: [{ required: true, message: '请输入角色名称' }],
  label: [{ required: true, message: '请输入角色标签' }],
};

const handleAdd = () => {
  Object.assign(model, {
    name: '',
    label: '',
    status: true,
    createTime: '',
    menus: [],
  });
  formRef.value?.resetFields();
  open.value = true;
};

const handleEdit = (record: API.Role) => {
  Object.assign(model, record);
  formRef.value?.resetFields();
  open.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value || formLoading.value) return;
  await formRef.value.validateFields();
  try {
    formLoading.value = true;
    if (model.id) {
      await updateRoleApi(model as API.Role);
      message.success('添加成功');
    } else {
      await createRoleApi(model as API.Role);
      message.success('修改成功');
    }
    getTableData();
    open.value = false;
  } finally {
    formLoading.value = false;
  }
};

const handleRemove = async (record: API.Role) => {
  try {
    await removeRoleApi(record.id);
    message.success('删除成功');
    getTableData();
  } catch {}
};

const handleToggleStatus = async (record: API.Role) => {
  try {
    await partialUpdateRoleApi({
      id: record.id,
      status: !record.status,
    });
    record.status = !record.status;
    message.success('修改成功');
  } catch {}
};

const getTableData = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    const res = await listRoleApi(params);
    total.value = res.count;
    roles.value = res.results;
  } finally {
    loading.value = false;
  }
};

const getMenus = async () => {
  const res = await treeMenuApi();
  menus.value = res;
};

const columns: TableColumnsType<API.Role> = [
  {
    title: '角色名',
    dataIndex: 'name',
  },
  {
    title: '角色标签',
    dataIndex: 'label',
  },
  {
    title: '状态',
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.status,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        onChange: () => handleToggleStatus(record),
      });
    },
  },
  {
    title: '操作',
    fixed: 'right',
    customRender: ({ record }) => {
      return h('div', {}, [
        h(
          Button,
          { type: 'link', onClick: () => handleEdit(record) },
          () => '编辑',
        ),
        h(
          Popconfirm,
          {
            title: `确定删除角色 “${record.label}” 吗？`,
            onConfirm: () => handleRemove(record),
          },
          () => h(Button, { type: 'link', danger: true }, () => '删除'),
        ),
      ]);
    },
  },
];

onMounted(() => {
  getTableData();
  getMenus();
});
</script>
<template>
  <div class="p-4">
    <Button class="mb-2" type="primary" @click="handleAdd">新增角色</Button>
    <Table
      :data-source="roles"
      row-key="id"
      bordered
      :columns="columns"
      :pagination="{
        total,
        pageSize: params.size,
        current: params.page,
      }"
    />
    <Modal
      centered
      v-model:open="open"
      width="600px"
      draggable
      :title="model.id ? '修改角色' : '新增角色'"
      @ok="handleSubmit"
    >
      <Form
        label-align="right"
        :label-col="{ span: 4 }"
        :rules="rules"
        ref="formRef"
        :model="model"
      >
        <FormItem label="角色名称" name="name">
          <Input v-model:value="model.name" />
        </FormItem>
        <FormItem label="角色标签" name="label">
          <Input v-model:value="model.label" />
        </FormItem>

        <FormItem label="状态" name="status">
          <RadioGroup button-style="solid" v-model:value="model.status">
            <RadioButton :value="true">已启用</RadioButton>
            <RadioButton :value="false">已禁用</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="授权" name="menus">
          <VbenTree
            v-model="model.menus"
            :tree-data="menus"
            :default-expanded-level="2"
            label-field="meta.title"
            value-field="id"
            icon-field="meta.icon"
            multiple
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style scoped></style>
