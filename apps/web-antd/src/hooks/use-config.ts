import type { MaybeRef, Ref } from 'vue';

import { onMounted, ref, unref } from 'vue';

import {
  createConfigApi,
  getConfigApi,
  updateConfigApi,
} from '#/api/system/config';

export const useConfig = (
  config_key_ref: MaybeRef<string>,
  config: Ref<string>,
) => {
  const config_key = unref(config_key_ref);
  const is_create = ref(false);

  const getData = async () => {
    try {
      const res = await getConfigApi(config_key);
      config.value = res.value;
      is_create.value = true;
    } catch {
      is_create.value = false;
    }
  };

  const updateConfig = async (val: string | undefined) => {
    const data = { key: config_key, value: val ?? '' };
    await (is_create.value ? updateConfigApi(data) : createConfigApi(data));
  };

  onMounted(getData);

  return {
    config,
    updateConfig,
  };
};
