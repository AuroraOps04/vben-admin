<script setup lang="ts">
import { Select } from 'ant-design-vue';

const options = [
  {
    label: '点',
    value: 'dot',
  },
  {
    label: '文字',
    value: 'text',
  },
];
</script>
<template>
  <Select placeholder="请选择徽标类型" :options="options" />
</template>
<style scoped></style>
