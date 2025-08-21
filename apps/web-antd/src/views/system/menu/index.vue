<script setup lang="ts">
import type { FormInstance, TableColumnsType } from 'ant-design-vue';

import { h, reactive, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { MenuBadge } from '@vben-core/menu-ui';

import {
  Button,
  Drawer,
  Form,
  message,
  Popconfirm,
  RadioButton,
  RadioGroup,
  Table,
  Tag,
} from 'ant-design-vue';
// import _ from 'lodash';

import {
  createMenuApi,
  deleteMenuApi,
  partialUpdateMenuApi,
  treeMenuApi,
  updateMenuApi,
} from '#/api';
import { Switch } from '#/components';

import {
  ButtonForm,
  CatelogForm,
  IframeForm,
  LinkForm,
  PageForm,
} from './components';

const Item = Form.Item;
const formRef = ref<FormInstance>();

const form = reactive<API.Menu>({
  type: 'catelog',
  status: true,
  meta: { title: '' },
  component: '',
  name: '',
  path: '',
});

const open = ref(false);
const formLoading = ref(false);
const loading = ref(false);
const datasource = ref<API.TreeMenu[]>([]);

const menuTypeMaps: Record<API.Menu['type'], string> = {
  button: 'error',
  catelog: 'processing',
  iframe: 'warning',
  link: 'success',
  page: 'default',
};

const handleAdd = () => {
  Object.assign(form, {
    type: 'page',
    status: true,
    meta: { title: '' },
    component: '',
    name: '',
    path: '',
    redirect: '',
    id: undefined,
    parent: undefined,
  });
  open.value = true;
};

const handleAddSub = (id?: number) => {
  Object.assign(form, {
    type: 'catelog',
    status: true,
    meta: { title: '' },
    component: '',
    name: '',
    id: undefined,
    path: '',
    redirect: '',
    parent: id,
  });
  open.value = true;
};

const handleEdit = (record: API.Menu) => {
  Object.assign(form, record);
  open.value = true;
};

const handleRemove = async (record: API.TreeMenu) => {
  if (record.children && record.children.length > 0) {
    message.warning('有子菜单项，无法删除。');
    return;
  }
  await deleteMenuApi(record.id as number);
  message.success('删除成功');
  fetchTableData();
};

const handleToggleStatus = async (record: API.Menu) => {
  await partialUpdateMenuApi({
    id: record.id,
    status: !record.status,
  });
  record.status = !record.status;
  message.success('修改成功');
};

const columns: TableColumnsType<API.TreeMenu> = [
  {
    title: '标题',
    fixed: 'left',
    dataIndex: ['meta', 'title'],
    customRender: ({ record }) => {
      return h(
        'div',
        {
          // NOTICE: 这里不能使用相对定位会导致菜单无法展开
          class: 'min-w-40 ',
        },
        [
          h(
            'div',
            {
              class: 'flex items-center gap-1',
            },
            [
              record.meta?.icon &&
                h(IconifyIcon, { icon: record.meta.icon, class: 'size-6' }),
              record.meta?.title || record.name,
            ],
          ),

          h(MenuBadge, {
            class: 'right-0 top-1/2 -translate-y-1/2',
            badge: record.meta.badge,
            badgeType: record.meta.badgeType,
            badgeVariants: record.meta.badgeVariants,
          }),
        ],
      );
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: ({ record }) => {
      return (
        record.typeDisplay &&
        h(
          Tag,
          {
            color: menuTypeMaps[record.type],
          },
          () => record.typeDisplay,
        )
      );
    },
  },
  {
    title: '路由地址',
    dataIndex: 'path',
  },
  {
    title: '页面组件',
    dataIndex: 'component',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) =>
      h(Switch, {
        checked: record.status,
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
        onClick: () => handleToggleStatus(record),
      }),
  },
  {
    title: '操作',
    fixed: 'right',
    customRender: ({ record }) =>
      h(
        'div',
        {
          class: 'min-w-20 flex gap-1',
        },
        [
          h(
            Button,
            {
              type: 'link',
              key: 'add',
              onClick: () => handleAddSub(record.id),
            },
            () => '新增下级',
          ),
          h(
            Button,
            {
              type: 'link',
              key: 'edit',
              onClick: () => handleEdit(record),
            },
            () => '修改',
          ),
          h(
            Popconfirm,
            {
              onConfirm: () => handleRemove(record),
              title: `确定删除${record.typeDisplay} "${record.meta?.title || record.name}" 吗？`,
            },
            () =>
              h(
                Button,
                {
                  type: 'link',
                  danger: true,
                  key: 'delete',
                },
                () => '删除',
              ),
          ),
        ],
      ),
  },
];

const fetchTableData = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    datasource.value = await treeMenuApi();
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  if (!formRef.value || formLoading.value) return;
  try {
    await formRef.value.validate();
    formLoading.value = true;
    if (form.id) {
      await updateMenuApi(form);
      message.success('更新菜单成功');
      fetchTableData();
      open.value = false;
    } else {
      await createMenuApi(form);
      message.success('创建菜单成功');
      fetchTableData();
      open.value = false;
    }
  } finally {
    formLoading.value = false;
  }
};

fetchTableData();
</script>
<template>
  <div class="p-4">
    <Button @click="handleAdd" type="primary" class="mb-2">新增菜单</Button>
    <Table
      row-key="id"
      :data-source="datasource"
      :columns="columns"
      :pagination="false"
      @row-expandable="
        (record) => record.children && record.children.length > 0
      "
    />
    <Drawer
      :title="form.id ? '编辑菜单' : '新增菜单'"
      size="large"
      width="800px"
      v-model:open="open"
    >
      <Form
        :model="form"
        ref="formRef"
        label-align="right"
        :label-col="{ span: 6 }"
      >
        <Item label="类型" :label-col="{ span: 3 }">
          <RadioGroup
            button-style="solid"
            v-model:value="form.type"
            name="type"
          >
            <RadioButton value="catelog">目录</RadioButton>
            <RadioButton value="page">菜单</RadioButton>
            <RadioButton value="button">按钮</RadioButton>
            <RadioButton value="iframe">内嵌</RadioButton>
            <RadioButton value="link">外链</RadioButton>
          </RadioGroup>
        </Item>
        <Transition name="slide-left" mode="out-in">
          <template v-if="form.type === 'catelog'">
            <CatelogForm v-model:form="form" />
          </template>
          <template v-else-if="form.type === 'page'">
            <PageForm v-model:form="form" />
          </template>
          <template v-else-if="form.type === 'button'">
            <ButtonForm v-model:form="form" />
          </template>
          <template v-else-if="form.type === 'iframe'">
            <IframeForm v-model:form="form" />
          </template>
          <template v-else-if="form.type === 'link'">
            <LinkForm v-model:form="form" />
          </template>
        </Transition>
      </Form>
      <template #footer>
        <div class="flex items-center justify-end gap-4">
          <Button @click="open = false">取消</Button>
          <Button :loading="formLoading" type="primary" @click="onSubmit">
            确认
          </Button>
        </div>
      </template>
    </Drawer>
  </div>
</template>
