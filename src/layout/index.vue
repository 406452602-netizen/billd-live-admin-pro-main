<template>
  <n-space class="layout-wrap">
    <n-layout
      position="absolute"
      has-sider
    >
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="appStore.collapsed"
        show-trigger
        @collapse="appStore.setCollapsed(true)"
        @expand="appStore.setCollapsed(false)"
      >
        <n-menu
          :value="currentPath"
          :collapsed="appStore.collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expanded-keys="expandedKeys"
          @update:value="handleUpdateValue"
          @update:expanded-keys="expandedKeys = $event"
        />
      </n-layout-sider>
      <n-layout>
        <div
          class="head-wrap"
          :style="{
            width: !appStore.collapsed
              ? 'calc(100vw - 240px)'
              : 'calc(100vw - 64px)',
          }"
        >
          <HeaderCpt></HeaderCpt>
          <openTabCpt></openTabCpt>
        </div>
        <div class="main-wrap">
          <router-view></router-view>
          <ChatComponent />
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts" setup>
import { NIcon } from 'naive-ui';
import { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { ref, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';

import ChatComponent from '@/components/ChatComponent/index.vue';
import { defaultRoutes } from '@/router/index';
import { useAppStore } from '@/store/app';

import HeaderCpt from './header/header.vue';
import openTabCpt from './openTab/openTab.vue';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const { t } = useI18n();

// 定义菜单项的meta类型
interface MenuMeta {
  title?: string;
  icon?: any;
  hidden?: boolean;
  sort?: number;
}

const handleRoutes = (routes: RouteRecordRaw[]): MenuMixedOption[] => {
  return routes.map((v) => {
    if (v.meta?.oneChildren && v.children && v.children.length > 0) {
      const child = v.children[0];
      const meta: MenuMeta = {
        title: child.meta?.title as string,
        icon: child.meta?.icon,
        hidden: child.meta?.hidden as boolean,
        sort: typeof v.meta?.sort === 'number' ? v.meta.sort : 0,
      };
      return {
        label: child.meta?.title || '',
        key: child.path || '',
        show: !(child.meta?.hidden || false),
        meta,
      };
    } else {
      const meta: MenuMeta = {
        title: v.meta?.title as string,
        icon: v.meta?.icon,
        hidden: v.meta?.hidden as boolean,
        sort: typeof v.meta?.sort === 'number' ? v.meta.sort : 0,
      };
      const menuItem: MenuMixedOption = {
        label: v.meta?.title || '',
        key: v.path || '',
        show: !(v.meta?.hidden || false),
        meta,
      };

      if (v.children && v.children.length > 0) {
        menuItem.children = handleRoutes(v.children);
      }

      return menuItem;
    }
  });
};

function sortRoute(a: MenuMixedOption, b: MenuMixedOption) {
  const aSort = (a.meta as MenuMeta)?.sort || 0;
  const bSort = (b.meta as MenuMeta)?.sort || 0;
  return bSort - aSort;
}

const menuOptions = ref<MenuMixedOption[]>([]);

// 初始化菜单选项
const initMenuOptions = () => {
  const allRoutes = [...(defaultRoutes || []), ...(appStore.routes || [])];
  menuOptions.value = handleRoutes(allRoutes).sort(sortRoute);
};

// 计算需要展开的父级菜单路径
const calculateExpandedKeys = (path: string): string[] => {
  if (!path) return [];
  const expandedKeys: string[] = [];
  const pathSegments = path.split('/').filter(Boolean);

  // 构建所有父级路径
  let currentPath = '';
  for (let i = 0; i < pathSegments.length - 1; i += 1) {
    currentPath += `/${pathSegments[i]}`;
    expandedKeys.push(currentPath);
  }

  return expandedKeys;
};

const currentPath = ref<string>(route.path || '');
const expandedKeys = ref<string[]>(calculateExpandedKeys(route.path || ''));

const handleUpdateValue = (key: string, item: any) => {
  currentPath.value = key;
  expandedKeys.value = calculateExpandedKeys(key);
  if (item && item.meta && item.meta.title && !appStore.tabList[key]) {
    appStore.setTabList({
      ...appStore.tabList,
      [key]: item.meta.title,
    });
  }
  router.push(key);
};

// 初始化菜单选项
initMenuOptions();

watch(
  () => route.path,
  (newPath) => {
    if (newPath) {
      appStore.setPath(newPath);
      currentPath.value = newPath;
      expandedKeys.value = calculateExpandedKeys(newPath);
    }
  }
);

// 监听routes变化，更新菜单选项
watch(
  () => appStore.routes,
  () => {
    initMenuOptions();
  },
  { deep: true }
);

// 设置初始路由和标签
if (route.path && route.meta && route.meta.title) {
  appStore.setPath(route.path);
  appStore.setTabList({ [route.path]: route.meta.title });
}

function renderMenuLabel(option: MenuMixedOption) {
  if (!option || !option.label) return '';
  return t(option.label as string);
}

function renderMenuIcon(option: MenuMixedOption) {
  if (!option || !option.meta) return null;
  const meta = option.meta as MenuMeta;
  if (!meta.icon) return null;
  return h(NIcon, null, { default: () => h(meta.icon) });
}
</script>

<style lang="scss" scoped>
.layout-wrap {
  height: 100vh;

  .head-wrap {
    position: fixed;
    z-index: 10;
    background-color: white;
  }

  .main-wrap {
    margin-top: 90px;
    padding: 10px 10px 50px 15px;
  }
}
</style>
