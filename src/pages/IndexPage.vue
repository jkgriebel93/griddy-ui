<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-mb-md">Welcome to Gridiron Stats Hub!</h1>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Upcoming Games</div>
          </q-card-section>
          <q-card-section>
            <q-list separator>
              <q-item
                v-for="game in upcomingGames"
                :key="game.id"
                clickable
                v-ripple
                :to="`/games/${game.id}`"
              >
                <q-item-section>
                  <q-item-label>{{ game.awayTeam }} at {{ game.homeTeam }}</q-item-label>
                  <q-item-label caption>{{ game.date }} - {{ game.league }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-btn flat color="primary" to="/games" class="q-mt-md">View All Games</q-btn>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Top Leagues / Conferences</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div
                v-for="league in topLeagues"
                :key="league.id"
                class="col-6 col-sm-4 col-md-4"
              >
                <q-card clickable v-ripple :to="`/leagues/${league.id}`" class="text-center">
                  <q-img :src="league.logo" fit="contain" style="height: 80px;" class="q-my-sm" />
                  <q-card-section>
                    <div class="text-subtitle2">{{ league.name }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
            <q-btn flat color="primary" to="/leagues" class="q-mt-md">View All</q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Trending Players</div>
          </q-card-section>
          <q-card-section>
            <q-list separator>
              <q-item
                v-for="player in trendingPlayers"
                :key="player.id"
                clickable
                v-ripple
                :to="`/players/${player.id}`"
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="player.photo">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ player.name }} ({{ player.team }})</q-item-label>
                  <q-item-label caption>{{ player.position }} - Yards: {{ player.yards }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Latest News & Articles</div>
          </q-card-section>
          <q-card-section>
            <q-list separator>
              <q-item
                v-for="news in latestNews"
                :key="news.id"
                clickable
                v-ripple
                href="#" target="_blank"
              >
                <q-item-section>
                  <q-item-label>{{ news.title }}</q-item-label>
                  <q-item-label caption>{{ news.source }} - {{ news.date }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar'; // If you needed Quasar specific features here


const leagues = ref([]);
const loading = ref(true);
const error = ref(null);
const $q = useQuasar(); // Initialize Quasar utilities if needed

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.get(`core/league/`);
    leagues.value = response.data;
    console.log(leagues.value)
  } catch (err) {
    console.error(error);
    error.value = err.message || 'Failed to fetch league data';
  } finally {
    loading.value = false;
  }
};


const upcomingGames = ref([]);
const topLeagues = ref([]);
const trendingPlayers = ref([]);
const latestNews = ref([]);

onMounted(() => {
  fetchData();
  // Simulate API calls for American Football
  upcomingGames.value = [
    { id: 1, homeTeam: 'Chiefs', awayTeam: 'Ravens', date: 'Thu, Sep 5', league: 'NFL' },
    { id: 2, homeTeam: 'Michigan', awayTeam: 'Texas', date: 'Sat, Aug 31', league: 'NCAA' },
  ];
  topLeagues.value = [
    { id: 'nfl', name: 'NFL', logo: 'https://via.placeholder.com/60x60/3F51B5/FFFFFF?text=NFL' },
    { id: 'ncaaf', name: 'NCAA Football', logo: 'https://via.placeholder.com/60x60/FF5722/FFFFFF?text=NCAA' },
    { id: 'cfl', name: 'CFL', logo: 'https://via.placeholder.com/60x60/009688/FFFFFF?text=CFL' },
  ];
  trendingPlayers.value = [
    { id: 1, name: 'Patrick Mahomes', team: 'Chiefs', position: 'QB', yards: '5,250 passing', photo: 'https://via.placeholder.com/48x48?text=PM' },
    { id: 2, name: 'Christian McCaffrey', team: '49ers', position: 'RB', yards: '1,459 rushing', photo: 'https://via.placeholder.com/48x48?text=CM' },
  ];
  latestNews.value = [
    { id: 1, title: 'NFL Offseason Buzz: Key Signings', source: 'NFL.com', date: '1 hour ago' },
    { id: 2, title: 'Top College Recruits for 2026', source: 'ESPN College', date: 'Yesterday' },
  ];

  // In a real app, you'd fetch data here:
  // try {
  //   const response = await api.get('/games/upcoming'); // Assuming 'api' is an axios instance or similar
  //   upcomingGames.value = response.data;
  // } catch (error) {
  //   $q.notify({ type: 'negative', message: 'Failed to load games.' });
  // }
});
</script>

<style scoped>
/* Scoped styles for the home page */
</style>
