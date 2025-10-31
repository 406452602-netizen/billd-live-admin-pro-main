<template>
  <HForm
    ref="hFormRef"
    v-bind="formConfigRes"
    v-model="formData"
    :show-action="showAction"
    :confirm-loading="confirmLoading"
    @click:confirm="handleConfirm"
  ></HForm>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  fetchBlacklistFind,
  fetchCreateBlacklist,
  fetchUpdateBlacklist,
} from '@/api/blacklist';
import HForm from '@/components/Base/Form';
import { IBlacklist } from '@/interface';

import { formConfig } from './config/form.config';

const route = useRoute();
const props = withDefaults(
  defineProps<{
    edit?: boolean;
    modelValue?: any;
    showAction?: boolean;
  }>(),
  {
    edit: false,
    modelValue: {},
    showAction: true,
  }
);

const hFormRef = ref<InstanceType<typeof HForm>>();
const formData = ref<IBlacklist>({ ...props.modelValue });
const confirmLoading = ref(false);
const formConfigRes = ref();
const id = ref();

defineExpose({
  validateForm,
  validateAndUpload,
});

onMounted(async () => {
  id.value = Number(route.query.id);
  formConfigRes.value = formConfig();
  await find();
});

async function find() {
  if (id.value) {
    const res = await fetchBlacklistFind(id.value);
    if (res.code !== 200) return;
    formData.value = {
      ...res.data,
      start_date: +new Date(res.data.start_date || 0),
      end_date: +new Date(res.data.end_date || 0),
    };
  }
}

async function handleCreate(v: IBlacklist) {
  try {
    confirmLoading.value = true;
    const { msg }: any = await fetchCreateBlacklist({
      ...v,
    });
    window.$message.success(msg);
  } catch (error) {
    console.log(error);
  }
  confirmLoading.value = false;
}
async function handleUpdate(v: IBlacklist) {
  try {
    confirmLoading.value = true;
    const { msg }: any = await fetchUpdateBlacklist({
      ...v,
    });
    window.$message.success(msg);
  } catch (error) {
    console.log(error);
  }
  confirmLoading.value = false;
}

const handleConfirm = async (v: IBlacklist) => {
  if (props.edit) {
    await handleUpdate(v);
  } else {
    await handleCreate(v);
  }
};

async function validateForm() {
  const res = await hFormRef.value?.handleValidate();
  return res;
}
async function validateAndUpload() {
  const res = await hFormRef.value?.validateAndUpload();
  return res;
}
</script>

<style lang="scss" scoped></style>
