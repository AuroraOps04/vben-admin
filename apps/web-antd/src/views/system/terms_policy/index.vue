<script setup lang="ts">
import { ref } from 'vue';

import { Button, message, Tabs } from 'ant-design-vue';

import { RichEditor } from '#/components';
import { useConfig } from '#/hooks/use-config';

defineOptions({
  name: 'TermsOfUserAndPrivacyPolicy',
});

const Tab = Tabs.TabPane;

const activeKey = ref('1');
const termsOfUser = ref('');
const { updateConfig: updateTermsOfUser } = useConfig(
  'sys_terms_of_user',
  termsOfUser,
);

const privatePrivacy = ref('');

const { updateConfig: updatePrivatePrivacy } = useConfig(
  'sys_private_privacy',
  privatePrivacy,
);

const handleSaveTermsOfUser = async () => {
  await updateTermsOfUser(termsOfUser.value);
  message.success('用户服务协议保存成功');
};

const handleSavePrivatePrivacy = async () => {
  await updatePrivatePrivacy(privatePrivacy.value);
  message.success('隐私政策保存成功');
};
</script>

<template>
  <div class="h-full p-4">
    <Tabs v-model:active-key="activeKey" class="h-full">
      <Tab key="1" style="height: 100%" tab="用户服务协议" class="h-full">
        <RichEditor v-model="termsOfUser" class="mb-10 h-[600px]" />
        <Button class="my-4" type="primary" @click="handleSaveTermsOfUser">
          保存
        </Button>
      </Tab>
      <Tab key="2" tab="隐私政策">
        <RichEditor v-model="privatePrivacy" class="mb-10 h-[600px]" />
        <Button type="primary" class="my-4" @click="handleSavePrivatePrivacy">
          保存
        </Button>
      </Tab>
    </Tabs>
  </div>
</template>

<style scoped></style>
