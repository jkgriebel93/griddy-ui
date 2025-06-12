<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-deep-purple-10 text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Gridiron Stats Hub
        </q-toolbar-title>

        <q-input
          dark
          dense
          standout
          v-model="searchQuery"
          placeholder="Search Teams, Players, Conferences..."
          class="q-mr-md"
          input-class="text-right"
          style="width: 300px;"
          @keyup.enter="performGlobalSearch"
        >
          <template v-slot:append>
            <q-icon v-if="searchQuery === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchQuery = ''" />
          </template>
        </q-input>

        <q-btn flat round dense icon="person_pin" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          <div class="row items-center q-gutter-x-sm">
            <q-avatar size="md">
              <img src="https://via.placeholder.com/48/800080/FFFFFF?text=GF" alt="Gridiron Football">
            </q-avatar>
            <span class="text-h6">Menu</span>
          </div>
        </q-item-label>

        <q-item
          v-for="item in navItems"
          :key="item.title"
          clickable
          v-ripple
          :to="item.link"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          expand-separator
          icon="mdi-trophy-outline"
          label="Leagues / Conferences"
        >
          <q-list class="q-pl-md">
            <q-item
              v-for="league in popularLeagues"
              :key="league.id"
              clickable
              v-ripple
              :to="`/leagues/${league.id}`"
              exact
            >
              <q-item-section>
                <q-item-label>{{ league.name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/leagues" exact>
              <q-item-section>
                <q-item-label>View All</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white text-caption text-center q-pa-xs">
      &copy; {{ new Date().getFullYear() }} Gridiron Stats Hub. All rights reserved.
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const leftDrawerOpen = ref(false);
const searchQuery = ref('');

const navItems = ref([
  { title: 'Home', icon: 'home', link: '/' },
  { title: 'Games', icon: 'mdi-football-american', link: '/games' },
  { title: 'Teams', icon: 'group', link: '/teams' },
  { title: 'Players', icon: 'person', link: '/players' },
  { title: 'Compare', icon: 'compare_arrows', link: '/compare' },
  { title: 'About', icon: 'info', link: '/about' },
]);

const popularLeagues = ref([
  { id: 'nfl', name: 'NFL' },
  { id: 'ncaaf', name: 'NCAA Football' },
  { id: 'cfl', name: 'CFL' },
]);

const performGlobalSearch = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`);
    searchQuery.value = '';
  }
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style lang="scss">
/* You can define global styles or override Quasar variables here */
/* Ensure Quasar is correctly configured in quasar.conf.js for these colors */
.bg-deep-purple-10 {
  background: #4A148C !important; /* Primary color from quasar.conf.js */
}
</style>
