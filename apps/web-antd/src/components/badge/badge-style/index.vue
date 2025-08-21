<script setup lang="ts">
import { Select } from 'ant-design-vue';

const options = ['default', 'destructive', 'primary', 'success', 'warning'].map(
  (item) => ({
    label: item,
    value: item,
  }),
);
</script>
<template>
  <Select :options="options" placeholder="请选择徽标样式" />
</template>
