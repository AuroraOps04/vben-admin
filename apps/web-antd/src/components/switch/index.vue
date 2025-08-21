<script setup lang="ts">
import { ConfigProvider, Switch, theme } from 'ant-design-vue';

defineOptions({
  name: 'Switch',
});

const { token } = theme.useToken();
</script>
<template>
  <ConfigProvider
    :theme="{
      components: {
        Switch: {
          colorPrimary: token.colorPrimary,
          colorHighlight: token.colorError,
        },
      },
    }"
  >
    <Switch v-bind="$attrs" />
  </ConfigProvider>
</template>
