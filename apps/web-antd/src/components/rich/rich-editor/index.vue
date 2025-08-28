<script setup lang="ts">
import { markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useAppConfig } from '@vben/hooks';
import { IconifyIcon } from '@vben/icons';

import { Divider } from 'ant-design-vue';
import Quill from 'quill';

import { uploadFileApi } from '#/api/system/file';

import { ImageUploader } from './modules';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

defineOptions({
  name: 'RichEditor',
});
const props = defineProps<{
  class?: string;
}>();

Quill.register(
  {
    'modules/imageUploader': ImageUploader,
  },
  true,
);
const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
let quill: null | Quill = null;
const model = defineModel<string>();
let internalModel = '';
const editorRef = ref<HTMLElement>();
const toolbarRef = ref<HTMLElement>();
const handleUndo = () => {
  quill?.history.undo();
};

const handleRedo = () => {
  quill?.history.redo();
};

watch([model, () => quill], () => {
  if (model.value && quill && internalModel !== model.value) {
    internalModel = model.value;
    quill.clipboard.dangerouslyPasteHTML(model.value);
  }
});

onMounted(() => {
  if (!editorRef.value || !toolbarRef.value) return;
  quill = markRaw(
    new Quill(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: toolbarRef.value,
        imageUploader: {
          upload: async (file: File) => {
            const { file: url } = await uploadFileApi(file);
            return `${apiURL}${url}`;
          },
        },
      },
    }),
  );
  if (model.value) {
    internalModel = model.value;
    quill.clipboard.dangerouslyPasteHTML(model.value);
  }
  quill.on('text-change', () => {
    internalModel = quill?.getSemanticHTML() ?? '';
    model.value = internalModel;
  });
});

onBeforeUnmount(() => {
  quill = null;
});

/**
 * 1. accet
 * 2. 检查文件后缀
 * 3. 检查文件大小
 * 4. 上传文件
 * 5. 压缩功能
 */
const handleUpload = () => {
  const range = quill?.getSelection();
  console.warn('range', range);
};
</script>

<template>
  <div :class="props.class">
    <div ref="toolbarRef" class="text-foreground">
      <button class="undo" title="撤销" @click="handleUndo">
        <IconifyIcon icon="lucide:undo-2" class="text-foreground w-[18px]" />
      </button>
      <button class="undo" title="重做" @click="handleRedo">
        <IconifyIcon icon="lucide:redo-2" class="w-[18px]" />
      </button>
      <Divider type="vertical" class="float-left h-6 align-middle" />
      <button class="ql-bold" title="加粗"></button>
      <button class="ql-italic" title="斜体"></button>
      <button class="ql-underline" title="下划线"></button>
      <button class="ql-strike" title="删除线"></button>
      <select class="ql-background" title="背景色"></select>
      <select class="ql-color" title="字体颜色"></select>

      <button class="ql-script" value="super" title="上标"></button>
      <button class="ql-script" value="sub" title="下标"></button>

      <button class="ql-blockquote" title="yinyong"></button>
      <button class="ql-code-block" title="yinyong"></button>
      <button class="ql-image" title="yinyong"></button>

      <!-- <button class="ql-formula" title="gongshi"></button> -->

      <select class="ql-size">
        <option value="small"></option>
        <option selected>默认</option>
        <option value="large">大</option>
        <option value="huge">超大</option>
      </select>
      <button @click="handleUpload">
        <IconifyIcon icon="ion:plus" class="w-[18px]" />
      </button>
    </div>
    <div ref="editorRef" class="text-base"></div>
  </div>
</template>

<style>
.ql-container,
.ql-toolbar {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
}

.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button:focus,
.ql-snow .ql-toolbar button:focus,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  color: hsl(var(--primary));
}

.ql-snow .ql-stroke {
  stroke: hsl(var(--foreground));
}

.ql-snow .ql-fill {
  fill: hsl(var(--foreground));
}

.block {
  width: 28px !important;
  height: 24px !important;
  padding: 3px 5px !important;
}

/* // :deep(.ql-editor) img { */

/* //   position: relative; */

/* //   z-index: 1; */

/* //   &::after { */

/* //     content: ' '; */

/* //     z-index: 20; */

/* //     position: absolute; */

/* //     right: 0; */

/* //     top: 0; */

/* //     width: 20px; */

/* //     height: 20px; */

/* //     background: white; */

/* //   } */

/* //   &:hover::before { */

/* //     display: block; */

/* //   } */

/* // } */
</style>
