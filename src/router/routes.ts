
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/IndexPage.vue'), meta: { title: 'Gridiron Stats Hub' } },

      // { path: 'games', name: 'Games', component: () => import('pages/GamesPage.vue'), meta: { title: 'All Games' } },
      // { path: 'games/:id', name: 'GameDetail', component: () => import('pages/GameDetailPage.vue'), props: true, meta: { title: 'Game Details' } },
      // { path: 'leagues', name: 'Leagues', component: () => import('pages/LeaguesPage.vue'), meta: { title: 'All Leagues/Conferences' } },
      { path: 'leagues/:id', name: 'LeagueDetail', component: () => import('pages/LeagueDetailPage.vue'), props: true, meta: { title: 'League/Conference Details' } },
      // { path: 'teams', name: 'Teams', component: () => import('pages/TeamsPage.vue'), meta: { title: 'All Teams' } },
      // { path: 'teams/:id', name: 'TeamDetail', component: () => import('pages/TeamDetailPage.vue'), props: true, meta: { title: 'Team Details' } },
      // { path: 'players', name: 'Players', component: () => import('pages/PlayersPage.vue'), meta: { title: 'All Players' } },
      // { path: 'players/:id', name: 'PlayerDetail', component: () => import('pages/PlayerDetailPage.vue'), props: true, meta: { title: 'Player Details' } },
      // { path: 'compare', name: 'Compare', component: () => import('pages/ComparePage.vue'), meta: { title: 'Compare Stats' } },
      // { path: 'search', name: 'SearchResults', component: () => import('pages/SearchResultsPage.vue'), meta: { title: 'Search Results' } }, // TODO: props: (route: RouteRecordInfo) => ({ query: route.query.q })
      // { path: 'about', name: 'About', component: () => import('pages/AboutPage.vue'), meta: { title: 'About Us' } },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
