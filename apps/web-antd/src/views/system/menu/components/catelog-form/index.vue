<script setup lang="ts">
import { IconPicker } from '@vben/common-ui';

import {
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  RadioButton,
  RadioGroup,
  Row,
} from 'ant-design-vue';

import { BadgeStyle, BadgeType, MenuTreeSelect } from '#/components';

defineOptions({
  name: 'CatelogForm',
});

const Item = Form.Item;
const form = defineModel<API.Menu>('form', { required: true });
</script>
<template>
  <div>
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
        <Input v-model:value="form.meta.title" placeholder="请输入" />
      </Item>
      <Item
        label="路由地址"
        name="path"
        :rules="[
          { required: true, message: '请输入路由地址' },

          { min: 2, message: '路由地址至少2个字符' },
        ]"
      >
        <Input v-model:value="form.path" placeholder="请输入" />
      </Item>
      <Item label="图标" :name="['meta', 'icon']">
        <IconPicker prefix="ion" v-model="form.meta.icon" />
      </Item>
      <Item label="激活图标" :name="['meta', 'activeIcon']">
        <IconPicker prefix="ion" v-model="form.meta.activeIcon" />
      </Item>
      <Item label="状态" :name="['status']">
        <RadioGroup button-style="solid" v-model:value="form.status">
          <RadioButton :value="true">已启用</RadioButton>
          <RadioButton :value="false">已禁用</RadioButton>
        </RadioGroup>
      </Item>
      <Item label="徽标类型" :name="['meta', 'badgeType']">
        <BadgeType v-model:value="form.meta.badgeType" />
      </Item>
      <Item label="徽章内容" :name="['meta', 'badge']">
        <Input v-model:value="form.meta.badge" />
      </Item>
      <Item label="徽标样式" :name="['meta', 'badgeVariants']">
        <BadgeStyle v-model:value="form.meta.badgeVariants" />
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
    <Divider>其他设置</Divider>
    <div class="flex flex-col gap-4">
      <Row>
        <Col :offset="3" :span="6">
          <Checkbox v-model:checked="form.meta.affixTab">固定在标签</Checkbox>
        </Col>
        <Col :offset="8">
          <Checkbox v-model:checked="form.meta.hideInMenu">隐藏菜单</Checkbox>
        </Col>
      </Row>
      <Row>
        <Col :offset="3" :span="6">
          <Checkbox v-model:checked="form.meta.hideInBreadCrumb">
            在面包屑中隐藏
          </Checkbox>
        </Col>
        <Col :offset="8">
          <Checkbox v-model:checked="form.meta.hideInTab">
            在标签栏中隐藏
          </Checkbox>
        </Col>
      </Row>
    </div>
  </div>
</template>
