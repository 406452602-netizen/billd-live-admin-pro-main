<template>
  <div class="new-upload-wrap">
    <n-upload
      v-model:file-list="fileList"
      multiple
      :max="max"
      directory-dnd
      :default-upload="false"
      :action="uploadUrl"
      :headers="headers"
      @change="handleUploadChange"
      @success="handleUploadSuccess"
      @error="handleUploadError"
    >
      <n-upload-dragger>
        <n-text style="font-size: 16px">
          {{ placeholder }}
        </n-text>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { isEqual } from 'lodash-es';
import { UploadFileInfo } from 'naive-ui';
import { ref, watch } from 'vue';

import { uploadFile } from '@/api/upload.ts';
import { MINIO_UPLOAD_URL } from '@/utils/uploadConfig';

const props = withDefaults(
  defineProps<{
    field?: string;
    placeholder?: string;
    max?: number;
    modelValue: UploadFileInfo[];
  }>(),
  {
    modelValue: () => [],
    field: '',
    placeholder: '点击或者拖动文件到该区域来上传',
    max: 10,
  }
);

const emits = defineEmits(['update:value']);
const modelValue = props.modelValue ? props.modelValue : [];
const fileList = ref<UploadFileInfo[]>([...modelValue]);
const oldList = [...modelValue];
const isInternalUpdate = ref(false);
const uploadUrl = MINIO_UPLOAD_URL;
const headers = {};

// 监听 props.modelValue 变化，处理表单重置
watch(
  () => props.modelValue,
  (val) => {
    const newValue = val === null ? [] : [...val];
    const strippedCurrent = stripFileObjects(fileList.value);
    const strippedNew = stripFileObjects(newValue);
    if (!isEqual(strippedCurrent, strippedNew)) {
      isInternalUpdate.value = true;
      fileList.value = newValue;
    }
  }
);

function stripFileObjects(files: UploadFileInfo[]) {
  return files.map((file) => {
    // 仅保留父组件需要的关键属性，排除临时上传状态属性
    const { id, name, url } = file;
    return { id, name, url };
  });
}

function handleUploadChange(data: { fileList: UploadFileInfo[] }) {
  if (isInternalUpdate.value) {
    isInternalUpdate.value = false;
    return;
  }
  const strippedCurrent = stripFileObjects(fileList.value);
  const strippedNew = stripFileObjects(data.fileList);
  if (!isEqual(strippedCurrent, strippedNew)) {
    fileList.value = data.fileList;
    emits('update:value', stripFileObjects(data.fileList));
  }
}

const handleUploadSuccess = (response: any, file: UploadFileInfo) => {
  if (response.code === 200) {
    const newFileList = fileList.value.map((item) =>
      item.id === file.id ? { ...item, url: response.data.url } : item
    );
    const strippedCurrent = stripFileObjects(fileList.value);
    const strippedNew = stripFileObjects(newFileList);
    if (!isEqual(strippedCurrent, strippedNew)) {
      isInternalUpdate.value = true;
      fileList.value = newFileList;
      emits('update:value', stripFileObjects(newFileList));
    }
  }
};

const handleUploadError = (errorInfo: any) => {
  console.error('上传失败:', errorInfo.error);
};

// 实现 startUpload 方法
async function startUpload() {
  const queue: any = [];
  const del: string[] = [];
  fileList.value.forEach((v) => {
    if (v.file) {
      queue.push(upload(v));
    } else {
      queue.push(Promise.resolve({ flag: true, resultUrl: v.url }));
    }
  });
  const result = await Promise.all(queue);
  oldList.forEach((val) => {
    let flag = false;
    for (let i = 0; i < result.length; i += 1) {
      if (result[i].resultUrl === val.url) {
        flag = true;
        return;
      }
    }
    if (!flag) {
      del.push(val.url!);
    }
  });

  return { field: props.field, result, del };
}

const upload = async (file) => {
  try {
    const res = await uploadFile({
      file: file.file!,
    });
    return {
      flag: true,
      resultUrl: res.data.imageUrl,
    };
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  startUpload,
});
</script>

<style lang="scss" scoped>
.new-upload-wrap {
  /* 可添加样式 */
}
</style>
