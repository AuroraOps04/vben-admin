<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { TreeSelect } from 'ant-design-vue';

import { treeMenuApi } from '#/api';

defineOptions({
  name: 'MenuTreeSelect',
});

const props = defineProps<{
  id?: number;
}>();

const loading = ref(false);
const data = ref<API.TreeMenu[]>([]);

const recursionFilter = (data: API.TreeMenu[], id?: number): API.TreeMenu[] => {
  if (!data || data.length <= 0) return [];
  return data
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: recursionFilter(item.children, id),
    }));
};

const fetchData = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    data.value = await treeMenuApi();
  } finally {
    loading.value = false;
  }
};

const filteredData = computed(() => recursionFilter(data.value, props.id));

onMounted(fetchData);
</script>
<template>
  <TreeSelect
    :field-names="{ label: 'name', value: 'id' }"
    :tree-data="filteredData"
  >
    <template #title="record">
      <div class="flex items-center gap-1">
        <IconifyIcon v-if="record?.meta?.icon" :icon="record?.meta?.icon" />
        {{ record.meta?.title || record?.name }}
      </div>
    </template>
  </TreeSelect>
</template>
