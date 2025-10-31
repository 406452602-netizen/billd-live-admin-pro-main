<template>
  <div class="search-wrap">
    <HForm
      ref="hFormRef"
      v-bind="searchFormConfig"
      v-model="formData"
    ></HForm>
    <n-space justify="space-between">
      <div>
        <slot name="left"></slot>
      </div>
      <n-space justify="end">
        <n-button
          v-if="!hideAddBtn"
          type="warning"
          @click="handleAdd"
        >
          {{ t('common.add') }}
        </n-button>
        <n-button
          type="success"
          @click="handleSearch"
        >
          {{ t('common.search') }}
        </n-button>
        <n-button
          type="info"
          @click="handleReset"
        >
          {{ t('common.reset') }}
        </n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import HForm from '@/components/Base/Form';

const props = withDefaults(
  defineProps<{
    searchFormConfig?: any;
    initValue?: any;
    hideAddBtn?: boolean;
  }>(),
  {
    searchFormConfig: {},
    initValue: {},
    hideAddBtn: true,
  }
);
const emits = defineEmits(['clickReset', 'clickSearch', 'clickAdd']);

const formData = ref({ ...props.initValue });
const hFormRef = ref<InstanceType<typeof HForm>>();

const { t } = useI18n();
const handleReset = () => {
  hFormRef.value?.handleReset();
  emits('clickReset');
};

const handleAdd = () => {
  emits('clickAdd');
};

const handleSearch = async () => {
  try {
    const res = await hFormRef.value?.handleValidate();
    emits('clickSearch', res);
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.initValue,
  (newValue) => {
    formData.value = { ...newValue };
  },
  { deep: true } // 深度监听对象变化
);
</script>

<style lang="scss" scoped>
.search-wrap {
  margin-bottom: 10px;
}
</style>
