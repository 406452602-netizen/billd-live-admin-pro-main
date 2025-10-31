<template>
  <NModal
    v-model:show="showModal"
    title="创建邀请码"
    style="width: 600px"
    preset="dialog"
  >
    <HForm
      ref="hFormRef"
      v-bind="formConfigRes"
      v-model="formData"
      :show-action="true"
      :confirm-loading="confirmLoading"
      @update:filed="changeData"
      @click:confirm="submitForm"
    ></HForm>
  </NModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emits = defineEmits(['refresh']);
import { createInviteAgent } from '@/api/inviteAgent.ts';
import HForm from '@/components/Base/Form';
import { InviteAgent } from '@/interface.ts';

import { formConfig, notInviteFormConfig } from '../config/form.config';

const formConfigRes = ref();
const showModal = ref(false);
const confirmLoading = ref(false);
const formData = ref();

const initFormData = () => {
  // 计算1个月后的时间
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  formData.value = {
    agent_account_for: 5,
    expiration_time: oneMonthLater.getTime(),
  };
  showModal.value = true;
};

defineExpose({
  initFormData,
});

async function submitForm(v) {
  const res = await createInviteAgent(v);
  if (res.code === 200) {
    window.$message.success('添加成功');
    showModal.value = false;
    emits('refresh');
  }
}

async function changeData(k, value) {
  if (k == 'invite_class') {
    if (value == InviteAgent.member) {
      formConfigRes.value = await notInviteFormConfig();
    } else {
      formConfigRes.value = await formConfig();
    }
  }
}

onMounted(async () => {
  formConfigRes.value = await formConfig();
});
</script>
<style scoped lang="scss"></style>
