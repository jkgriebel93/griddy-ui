<template>
  <q-page class="q-pa-md" v-if="league">
    <h1 class="text-h4 q-mb-md">{{ league.name }}</h1>

    <!--q-img :src="league.logo" fit="contain" style="max-height: 150px; width: 100%;" class="q-mb-md" /-->

    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      class="q-mb-md text-primary"
      active-color="deep-purple-10"
      indicator-color="deep-purple-10"
    >
      <q-tab name="overview" label="Overview" />
      <q-tab name="standings" label="Standings" />
      <q-tab name="schedule" label="Schedule & Results" />
      <q-tab name="stats" label="Stats Leaders" />
      <q-tab name="teams" label="Teams" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="overview">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">League Information</div>
          </q-card-section>
          <q-card-section>
            <p><strong>Type:</strong> {{ league.type }}</p>
            <p><strong>Current Season:</strong> {{ league.currentSeason }}</p>
            <p><strong>Description:</strong> {{ league.description || 'No description available.' }}</p>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="standings">
        <q-card>
          <q-card-section>
            <div class="text-h4">Current Standings</div>
          </q-card-section>
          <q-card-section>
            <h3 class="text-subtitle1 q-mb-sm"> XFL Conference</h3>
            <q-table
              :rows="standingsXFLConf"
              :columns="standingsColumns"
              row-key="id"
              hide-bottom
              class="q-mb-md"
            >
              <template v-slot:body-cell-team="props">
                <q-td :props="props">
                  <router-link :to="`/teams/${props.row.id}`" class="text-blue-8">{{ props.row.name }}</router-link>
                </q-td>
              </template>
            </q-table>

            <h3 class="text-subtitle1 q-mb-sm">USFL Conference</h3>
            <q-table
              :rows="standingsUSFLConf"
              :columns="standingsColumns"
              row-key="id"
              hide-bottom
              class="q-mb-md"
            >
              <template v-slot:body-cell-team="props">
                <q-td :props="props">
                  <router-link :to="`/teams/${props.row.id}`" class="text-blue-8">{{ props.row.name }}</router-link>
                </q-td>
              </template>
            </q-table>

          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="schedule">
        <q-card>
          <q-card-section>
            <div class="text-h6">Schedule & Results</div>
          </q-card-section>
          <q-card-section>
            <q-select
              label="Filter by Week"
              :options="weeks"
              v-model="selectedWeek"
              outlined
              dense
              class="q-mb-md"
            />

            <q-list separator>
              <q-item
                v-for="game in filteredSchedule"
                :key="game.id"
                clickable
                v-ripple
                :to="`/games/${game.id}`"
              >
                <q-item-section>
                  <q-item-label>
                    {{ game.awayTeam }} {{ game.awayScore !== null ? game.awayScore : '' }}
                    at
                    {{ game.homeTeam }} {{ game.homeScore !== null ? game.homeScore : '' }}
                  </q-item-label>
                  <q-item-label caption>{{ game.date }} - {{ game.status }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="stats">
        <q-card>
          <q-card-section>
            <div class="text-h6">League Statistics Leaders</div>
          </q-card-section>
          <q-card-section>
            <h3 class="text-subtitle1 q-mb-sm">Passing Leaders</h3>
            <q-list separator class="q-mb-md">
              <q-item v-for="player in passingLeaders" :key="player.id" clickable v-ripple :to="`/players/${player.id}`">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="player.photo">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ player.name }} ({{ player.team }})</q-item-label>
                  <q-item-label caption>Yards: {{ player.yards }} | TDs: {{ player.touchdowns }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <h3 class="text-subtitle1 q-mb-sm">Rushing Leaders</h3>
            <q-list separator class="q-mb-md">
              <q-item v-for="player in rushingLeaders" :key="player.id" clickable v-ripple :to="`/players/${player.id}`">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="player.photo">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ player.name }} ({{ player.team }})</q-item-label>
                  <q-item-label caption>Yards: {{ player.yards }} | TDs: {{ player.touchdowns }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <h3 class="text-subtitle1 q-mb-sm">Receiving Leaders</h3>
            <q-list separator>
              <q-item v-for="player in receivingLeaders" :key="player.id" clickable v-ripple :to="`/players/${player.id}`">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="player.photo">
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ player.name }} ({{ player.team }})</q-item-label>
                  <q-item-label caption>Yards: {{ player.yards }} | TDs: {{ player.touchdowns }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="teams">
        <q-card>
          <q-card-section>
            <div class="text-h6">Participating Teams</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div
                v-for="team in teamsInLeague"
                :key="team.id"
                class="col-6 col-sm-4 col-md-3"
              >
                <q-card clickable v-ripple :to="`/teams/${team.id}`" class="text-center q-pa-sm">
                  <q-img :src="team.logo" fit="contain" style="height: 60px;" class="q-mx-auto q-mb-xs" />
                  <div class="text-subtitle2">{{ team.name }}</div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
  <q-page v-else class="q-pa-md text-center text-h6">
    <q-spinner-grid color="primary" size="3em" />
    <div class="q-mt-sm">Loading league/conference details...</div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { api } from 'boot/axios.js';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const route = useRoute();
const $q = useQuasar(); // Initialize Quasar utilities

const props = defineProps({
  id: String // Define props passed by Vue Router
});

const league = ref(null);

// TODO: This is duplicating the standings data in memory. Not idea, but just want
// to play with the UI elements
const standings = ref(null);

const tab = ref('overview');

const standingsXFLConf = ref([]);
const standingsUSFLConf = ref([]);
const schedule = ref([]);
const passingLeaders = ref([]);
const rushingLeaders = ref([]);
const receivingLeaders = ref([]);
const teamsInLeague = ref([]);

const weeks = ref(['All', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']);
const selectedWeek = ref('All');

const standingsColumns = [
  { name: 'team', required: true, label: 'Team', align: 'left', field: 'name', sortable: true },
  { name: 'wins', label: 'W', align: 'center', field: 'wins', sortable: true },
  { name: 'losses', label: 'L', align: 'center', field: 'losses', sortable: true },
  { name: 'ties', label: 'T', align: 'center', field: 'ties', sortable: true },
  { name: 'winPct', label: 'PCT', align: 'center', field: 'win_pct', sortable: true, format: val => val.toFixed(3) },
  { name: 'pointsFor', label: 'PF', align: 'center', field: 'points_for', sortable: true },
  { name: 'pointsAgainst', label: 'PA', align: 'center', field: 'points_against', sortable: true },
  // { name: 'pointDiff', label: 'Diff', align: 'center', field: 'pointDiff', sortable: true },
];

const filteredSchedule = computed(() => {
  if (selectedWeek.value === 'All') {
    return schedule.value;
  }
  return schedule.value.filter(game => game.week === selectedWeek.value);
});

const loadLeagueData = async (id) => {
  $q.loading.show({
    message: 'Loading league data...'
  });
  console.log(`Fetching data for league/conference ID: ${id}`);

  try {
    const response = await api.get(`core/league/${id}`);
    league.value = response.data;
    standings.value = league.value.standings;
  } catch (error) {
    console.error(error);
    error.value = err.message || 'Failed to fetch league data';
  } finally {
    $q.loading.value = false;
  }

/**
  league.value = {
    id: id,
    name: id.toUpperCase() === 'NFL' ? 'National Football League' : id.toUpperCase(),
    logo: `https://via.placeholder.com/150x150?text=${id.toUpperCase()}`,
    type: id === 'nfl' ? 'Professional League' : 'Collegiate League',
    currentSeason: '2024',
    description: `Detailed information about the ${id.toUpperCase()} season, including its structure, teams, and key statistics.`
  };
    **/
// TODO: Verify you have the right conference by name instead of indexing like this
  standingsXFLConf.value = standings.value.conferences[0].divisions[0].teams;
  standingsUSFLConf.value = standings.value.conferences[0].divisions[1].teams;


  schedule.value = [
    { id: 201, homeTeam: 'Chiefs', homeScore: 28, awayScore: 20, awayTeam: 'Ravens', date: '2024-09-05', status: 'Finished', week: 'Week 1' },
    { id: 202, homeTeam: 'Lions', homeScore: null, awayScore: null, awayTeam: 'Rams', date: '2024-09-08', status: 'Scheduled', week: 'Week 1' },
    { id: 203, homeTeam: 'Eagles', homeScore: null, awayScore: null, awayTeam: 'Falcons', date: '2024-09-16', status: 'Scheduled', week: 'Week 2' },
  ];
  passingLeaders.value = [
    { id: 301, name: 'Patrick Mahomes', team: 'Chiefs', yards: 5250, touchdowns: 45, photo: 'https://via.placeholder.com/48x48?text=PM' },
    { id: 302, name: 'Josh Allen', team: 'Bills', yards: 4800, touchdowns: 40, photo: 'https://via.placeholder.com/48x48?text=JA' },
  ];
  rushingLeaders.value = [
    { id: 303, name: 'Christian McCaffrey', team: '49ers', yards: 1459, touchdowns: 14, photo: 'https://via.placeholder.com/48x48?text=CM' },
    { id: 304, name: 'Derrick Henry', team: 'Titans', yards: 1200, touchdowns: 12, photo: 'https://via.placeholder.com/48x48?text=DH' },
  ];
  receivingLeaders.value = [
    { id: 305, name: 'Justin Jefferson', team: 'Vikings', yards: 1600, touchdowns: 10, photo: 'https://via.placeholder.com/48x48?text=JJ' },
    { id: 306, name: 'Tyreek Hill', team: 'Dolphins', yards: 1550, touchdowns: 12, photo: 'https://via.placeholder.com/48x48?text=TH' },
  ];
  teamsInLeague.value = [
    { id: 101, name: 'Kansas City Chiefs', logo: 'https://via.placeholder.com/60x60?text=KC' },
    { id: 102, name: 'Los Angeles Chargers', logo: 'https://via.placeholder.com/60x60?text=LAC' },
    { id: 103, name: 'Detroit Lions', logo: 'https://via.placeholder.com/60x60?text=DET' },
    { id: 104, name: 'Green Bay Packers', logo: 'https://via.placeholder.com/60x60?text=GB' },
  ];

  $q.loading.hide();
};

// Watch for changes in the 'id' prop (from route params)
watch(() => props.id, (newId) => {
  if (newId) {
    loadLeagueData(newId);
  }
}, { immediate: true }); // immediate: true runs the watcher on component mount
</script>

<style scoped>
/* Scoped styles for the league detail page */
</style>
