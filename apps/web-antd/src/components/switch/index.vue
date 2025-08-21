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
          colorTextQuaternary: token.colorError,
          colorTextTertiary: token.colorErrorHover,
        },
      },
    }"
  >
    <Switch v-bind="$attrs" />
  </ConfigProvider>
</template>
