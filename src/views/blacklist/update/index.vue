<template>
  <div v-if="!route.query.id">请选择黑名单id</div>
  <CreateCpt
    v-else
    :edit="true"
  ></CreateCpt>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import CreateCpt from '../create/index.vue';

const route = useRoute();

onMounted(() => {
  if (!route.query.id) return;
});
</script>

<style lang="scss" scoped></style>
