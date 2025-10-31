<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-message-provider :max="3">
      <n-modal-provider>
        <n-dialog-provider>
          <router-view></router-view>
          <SwitchEnv />
          <NaiveModal />
          <NaiveMessage />
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { zhCN, dateZhCN } from 'naive-ui';

import NaiveMessage from '@/components/NaiveMessage/index.vue';
import NaiveModal from '@/components/NaiveModal/index.vue';
import SwitchEnv from '@/components/SwitchEnv/index.vue';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ffd700',
    primaryColorHover: '#ffd700',
  },
};
</script>

<style lang="scss" scoped></style>
