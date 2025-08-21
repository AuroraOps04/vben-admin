<script setup lang="ts">
import {
  Form,
  Input,
  InputNumber,
  RadioButton,
  RadioGroup,
} from 'ant-design-vue';

import { MenuTreeSelect } from '#/components';

defineOptions({
  name: 'ButtonForm',
});

const Item = Form.Item;
const form = defineModel<API.Menu>('form', { required: true });
</script>
<template>
  <div class="grid grid-cols-2 gap-x-4">
    <Item
      label="菜单名称"
      name="name"
      :rules="[
        { required: true, message: '请输入菜单名称' },
        { min: 2, message: '菜单名称至少2个字符' },
      ]"
    >
      <Input placeholder="请输入" v-model:value="form.name" />
    </Item>
    <Item label="上级菜单" name="parent">
      <MenuTreeSelect :id="form.id" v-model:value="form.parent" />
    </Item>
    <Item
      label="标题"
      :rules="[{ required: true, message: '请输入标题' }]"
      :name="['meta', 'title']"
    >
      <Input placeholder="请输入" v-model:value="form.meta.title" />
    </Item>
    <!-- <Item label="权限标识" name="path"> -->
    <!--   <Input v-model:value="form.meta.author" /> -->
    <!-- </Item> -->
    <Item label="状态" :name="['status']">
      <RadioGroup button-style="solid" v-model:value="form.status">
        <RadioButton :value="true">已启用</RadioButton>
        <RadioButton :value="false">已禁用</RadioButton>
      </RadioGroup>
    </Item>
    <Item label="排序" :name="['meta', 'order']">
      <InputNumber
        :min="0"
        :max="999"
        :step="1"
        :precision="0"
        v-model:value="form.meta.order"
      />
    </Item>
  </div>
</template>
