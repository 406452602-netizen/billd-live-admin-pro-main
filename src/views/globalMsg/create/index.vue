<template>
  <HForm
    ref="hFormRef"
    v-bind="formConfig"
    v-model="formConfigRes"
    :show-action="showAction"
    :confirm-loading="confirmLoading"
    @click:confirm="handleConfirm"
  ></HForm>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchGlobalMsgCreate, fetchGlobalMsgFind } from '@/api/globalMsg';
import HForm from '@/components/Base/Form';

import { formConfig } from './config/form.config';

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    showAction?: boolean;
  }>(),
  {
    modelValue: {},
    showAction: true,
  }
);

const route = useRoute();

const hFormRef = ref<InstanceType<typeof HForm>>();
const formConfigRes = ref({ ...props.modelValue });
const confirmLoading = ref(false);
const id = ref(-1);

defineExpose({
  validateForm,
  validateAndUpload,
});

onMounted(async () => {
  id.value = Number(route.query.id);
  await find();
  formConfigRes.value = formConfig;
});

async function find() {
  if (id.value) {
    const res = await fetchGlobalMsgFind(id.value);
    if (res.code !== 200) return;
    const row = res.data;

    formConfigRes.value = {
      ...row,
    };
  }
}

const handleConfirm = async (v) => {
  const res = await fetchGlobalMsgCreate(v);
  if (res.code === 200) {
    window.$message.success('新建成功！');
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
