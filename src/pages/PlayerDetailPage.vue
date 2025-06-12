<template>
  <q-page class="q-pa-md" v-if="player">
    <div class="row items-center q-col-gutter-md">
      <div class="col-12 col-md-4 text-center">
        <q-avatar size="150px" class="q-mb-md">
          <img :src="player.photo">
        </q-avatar>
        <div class="text-h4 q-mb-xs">{{ player.name }}</div>
        <div class="text-h6 text-primary">{{ player.team }}</div>
        <div class="text-subtitle1">{{ player.position }} | #{{ player.jerseyNumber }}</div>
      </div>
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h6">Player Information</div>
          </q-card-section>
          <q-card-section>
            <p><strong>Team:</strong> <router-link :to="`/teams/${player.teamId}`" class="text-blue-8">{{ player.team }}</router-link></p>
            <p><strong>College:</strong> {{ player.college }}</p>
            <p><strong>Date of Birth:</strong> {{ player.dateOfBirth }}</p>
            <p><strong>Height:</strong> {{ player.height }}</p>
            <p><strong>Weight:</strong> {{ player.weight }}</p>
            <p><strong>Drafted:</strong> {{ player.draftYear }} (Round {{ player.draftRound }}, Pick {{ player.draftPick }})</p>
            <p v-if="player.description"><strong>Bio:</strong> {{ player.description }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      class="q-mt-md text-primary"
      active-color="deep-purple-10"
      indicator-color="deep-purple-10"
    >
      <q-tab name="stats" label="Career Stats" />
      <q-tab name="game-log" label="Game Log" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="stats">
        <q-card>
          <q-card-section>
            <div class="text-h6">Career Statistics</div>
          </q-card-section>
          <q-card-section>
            <q-select
              label="Select Season"
              :options="seasons"
              v-model="selectedSeason"
              outlined
              dense
              class="q-mb-md"
            />

            <q-table
              :rows="filteredCareerStats"
              :columns="currentStatsColumns"
              row-key="season"
              hide-bottom
            >
              <template v-slot:body-cell-league="props">
                <q-td :props="props">
                  <router-link :to="`/leagues/${props.row.leagueId}`" class="text-blue-8">{{ props.row.league }}</router-link>
                </q-td>
              </template>
              <template v-slot:body-cell-team="props">
                <q-td :props="props">
                  <router-link :to="`/teams/${props.row.teamId}`" class="text-blue-8">{{ props.row.team }}</router-link>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="game-log">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Games</div>
          </q-card-section>
          <q-card-section>
            <q-list separator>
              <q-item
                v-for="game in gameLog"
                :key="game.id"
                clickable
                v-ripple
                :to="`/games/${game.id}`"
              >
                <q-item-section>
                  <q-item-label>{{ game.opponent }} ({{ game.homeAway }}) - Week {{ game.week }}</q-item-label>
                  <q-item-label caption>{{ game.date }} | Score: {{ game.score }} ({{ game.result }})</q-item-label>
                  <q-item-label caption>
                    <span v-if="player.position === 'QB'">
                      Comp: {{ game.passCompletions }}/{{ game.passAttempts }} ({{ game.passYards }} Yds), TDs: {{ game.passTDs }}, INTs: {{ game.interceptions }}
                    </span>
                    <span v-else-if="player.position === 'RB'">
                      Rush: {{ game.rushAttempts }} Att ({{ game.rushYards }} Yds), TDs: {{ game.rushTDs }}
                    </span>
                    <span v-else-if="player.position === 'WR' || player.position === 'TE'">
                      Rec: {{ game.receptions }} ({{ game.receivingYards }} Yds), TDs: {{ game.receivingTDs }}
                    </span>
                    <span v-else-if="player.position === 'DB' || player.position === 'LB'">
                      Tackles: {{ game.tackles }}, Sacks: {{ game.sacks }}, INTs: {{ game.interceptions }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
  <q-page v-else class="q-pa-md text-center text-h6">
    <q-spinner-grid color="primary" size="3em" />
    <div class="q-mt-sm">Loading player details...</div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';

const route = useRoute();
const $q = useQuasar();

const props = defineProps({
  id: String // Define props passed by Vue Router
});

const player = ref(null);
const tab = ref('stats');

const careerStats = ref([]);
const gameLog = ref([]);

const seasons = ref(['All', '2024', '2023', '2022']);
const selectedSeason = ref('All');

const commonStatsColumns = [
  { name: 'season', label: 'Season', align: 'left', field: 'season', sortable: true },
  { name: 'league', label: 'League', align: 'left', field: 'league' },
  { name: 'team', label: 'Team', align: 'left', field: 'team' },
  { name: 'gamesPlayed', label: 'GP', align: 'center', field: 'gamesPlayed', sortable: true },
];

const qbStatsColumns = [
  ...commonStatsColumns,
  { name: 'passCompletions', label: 'Comp', align: 'center', field: 'passCompletions' },
  { name: 'passAttempts', label: 'Att', align: 'center', field: 'passAttempts' },
  { name: 'passYards', label: 'Yds', align: 'center', field: 'passYards', sortable: true },
  { name: 'passTDs', label: 'TD', align: 'center', field: 'passTDs', sortable: true },
  { name: 'interceptions', label: 'INT', align: 'center', field: 'interceptions', sortable: true },
  { name: 'passerRating', label: 'Rate', align: 'center', field: 'passerRating', format: val => val.toFixed(1) },
];

const rbWrTeStatsColumns = [
  ...commonStatsColumns,
  { name: 'rushAttempts', label: 'Rush Att', align: 'center', field: 'rushAttempts' },
  { name: 'rushYards', label: 'Rush Yds', align: 'center', field: 'rushYards', sortable: true },
  { name: 'rushTDs', label: 'Rush TD', align: 'center', field: 'rushTDs', sortable: true },
  { name: 'receptions', label: 'Rec', align: 'center', field: 'receptions' },
  { name: 'receivingYards', label: 'Rec Yds', align: 'center', field: 'receivingYards', sortable: true },
  { name: 'receivingTDs', label: 'Rec TD', align: 'center', field: 'receivingTDs', sortable: true },
];

const defStatsColumns = [
  ...commonStatsColumns,
  { name: 'totalTackles', label: 'Tackles', align: 'center', field: 'totalTackles', sortable: true },
  { name: 'sacks', label: 'Sacks', align: 'center', field: 'sacks', sortable: true },
  { name: 'interceptions', label: 'INT', align: 'center', field: 'interceptions', sortable: true },
  { name: 'forcedFumbles', label: 'FF', align: 'center', field: 'forcedFumbles' },
  { name: 'fumbleRecoveries', label: 'FR', align: 'center', field: 'fumbleRecoveries' },
  { name: 'defensiveTDs', label: 'TD', align: 'center', field: 'defensiveTDs' },
];

const currentStatsColumns = computed(() => {
  if (!player.value) return commonStatsColumns;
  switch (player.value.position) {
    case 'QB': return qbStatsColumns;
    case 'RB':
    case 'WR':
    case 'TE': return rbWrTeStatsColumns;
    case 'DB':
    case 'LB':
    case 'DL': return defStatsColumns;
    default: return commonStatsColumns;
  }
});

const filteredCareerStats = computed(() => {
  if (selectedSeason.value === 'All') {
    return careerStats.value;
  }
  return careerStats.value.filter(stat => stat.season === selectedSeason.value);
});

const loadPlayerData = async (id) => {
  $q.loading.show({
    message: 'Loading player data...'
  });
  console.log(`Fetching data for player ID: ${id}`);
  // Simulate API calls for American Football player
  player.value = {
    id: id,
    name: `Player ${id}`,
    photo: `https://via.placeholder.com/150x150?text=Player+${id}`,
    team: 'Kansas City Chiefs',
    teamId: 101,
    position: 'QB', // Crucial for conditional rendering
    jerseyNumber: 15,
    college: 'Texas Tech',
    dateOfBirth: '1995-09-17',
    height: "6'3\"",
    weight: '227 lbs',
    draftYear: 2017,
    draftRound: 1,
    draftPick: 10,
    description: 'A generational talent known for his arm strength and improvisation.',
  };

  if (player.value.position === 'QB') {
    careerStats.value = [
      { season: '2024', league: 'NFL', leagueId: 'nfl', team: 'Chiefs', teamId: 101, gamesPlayed: 17, passCompletions: 400, passAttempts: 600, passYards: 5000, passTDs: 40, interceptions: 10, passerRating: 105.0 },
      { season: '2023', league: 'NFL', leagueId: 'nfl', team: 'Chiefs', teamId: 101, gamesPlayed: 17, passCompletions: 380, passAttempts: 580, passYards: 4800, passTDs: 38, interceptions: 8, passerRating: 102.5 },
    ];
  } else if (player.value.position === 'RB') {
    careerStats.value = [
      { season: '2024', league: 'NFL', leagueId: 'nfl', team: '49ers', teamId: 105, gamesPlayed: 17, rushAttempts: 250, rushYards: 1200, rushTDs: 10, receptions: 50, receivingYards: 400, receivingTDs: 2 },
    ];
  }

  gameLog.value = [
    { id: 401, opponent: 'Ravens', homeAway: 'Home', week: 1, date: '2024-09-05', score: '28-20', result: 'W', passCompletions: 25, passAttempts: 35, passYards: 300, passTDs: 3, interceptions: 1, tackles: 0, sacks: 0 },
    { id: 402, opponent: 'Chargers', homeAway: 'Away', week: 2, date: '2024-09-12', score: '35-24', result: 'W', passCompletions: 30, passAttempts: 40, passYards: 350, passTDs: 4, interceptions: 0, tackles: 0, sacks: 0 },
  ];

  $q.loading.hide();
};

watch(() => props.id, (newId) => {
  if (newId) {
    loadPlayerData(newId);
  }
}, { immediate: true });
</script>

<style scoped>
/* Scoped styles for the player detail page */
</style>
