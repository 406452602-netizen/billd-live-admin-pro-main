import request from '@/utils/request';

// 比赛类型
export function fetchQuizMatchTypesList(data) {
  return request.instance({
    url: '/quiz/matchTypes/list',
    method: 'post',
    data,
  });
}

export function findQuizMatchTypeById(id) {
  return request.instance({
    url: `/quiz/matchTypes/${id}`,
    method: 'get',
  });
}

// 添加比赛类型
export function addQuizMatchType(data) {
  return request.instance({
    url: '/quiz/matchTypes/create',
    method: 'post',
    data,
  });
}

// 编辑比赛类型
export function editQuizMatchType(data) {
  return request.instance({
    url: `/quiz/matchTypes/update/${data.id}`,
    method: 'put',
    data,
  });
}

// 删除比赛类型
export function deleteQuizMatchType(id) {
  return request.instance({
    url: `/quiz/matchTypes/delete/${id}`,
    method: 'delete',
  });
}

// 比赛队伍
export function fetchQuizTeamsList(data) {
  return request.instance({
    url: '/quiz/team/list',
    method: 'post',
    data,
  });
}

export function findQuizTeamsById(id) {
  return request.instance({
    url: `/quiz/team/${id}`,
    method: 'get',
  });
}

export function addQuizTeams(data) {
  return request.instance({
    url: '/quiz/team/create',
    method: 'post',
    data,
  });
}

export function editQuizTeams(data) {
  return request.instance({
    url: `/quiz/team/update/${data.team_id}`,
    method: 'put',
    data,
  });
}

export function deleteQuizTeams(id) {
  return request.instance({
    url: `/quiz/team/delete/${id}`,
    method: 'delete',
  });
}

// 赛季
export function fetchQuizSeasonsList(data) {
  return request.instance({
    url: '/quiz/seasons/list',
    method: 'post',
    data,
  });
}

// 添加赛季
export function addQuizSeasons(data) {
  return request.instance({
    url: '/quiz/seasons/create',
    method: 'post',
    data,
  });
}

export function editQuizSeasons(data) {
  return request.instance({
    url: `/quiz/seasons/update/${data.season_id}`,
    method: 'put',
    data,
  });
}

export function fetchQuizSeasonsById(id) {
  return request.instance({
    url: `/quiz/seasons/${id}`,
    method: 'get',
  });
}

// 比赛
export function fetchQuizMatchesList(data) {
  return request.instance({
    url: '/quiz/matches/list',
    method: 'post',
    data,
  });
}

export function settlementQuizMatches(matchId) {
  return request.instance({
    url: `/quiz/matches/settlement/${matchId}`,
    method: 'post',
  });
}

export function addQuizMatches(data) {
  return request.instance({
    url: '/quiz/matches/create',
    method: 'post',
    data,
  });
}

export function editQuizMatches(data) {
  return request.instance({
    url: `/quiz/matches/update/${data.match_id}`,
    method: 'put',
    data,
  });
}

export function fetchQuizMatchesById(id) {
  return request.instance({
    url: `/quiz/matches/${id}`,
    method: 'get',
  });
}

export function getQuizMatchGoalsList(data) {
  return request.instance({
    url: '/quiz/matchGoals/list',
    method: 'post',
    data,
  });
}

export function addQuizMatchGoals(data) {
  return request.instance({
    url: '/quiz/matchGoals/create',
    method: 'post',
    data,
  });
}

export function updateQuizMatchGoals(data) {
  return request.instance({
    url: '/quiz/matchGoals/update',
    method: 'put',
    data,
  });
}

export function deleteQuizMatchGoals(id) {
  return request.instance({
    url: `/quiz/matchGoals/delete/${id}`,
    method: 'delete',
  });
}

export function getQuizVotesList(data) {
  return request.instance({
    url: '/quiz/votes/list',
    method: 'post',
    data,
  });
}

export function fetchQuizPayoutsStatistics(data) {
  return request.instance({
    url: '/quiz/payouts/statistics',
    method: 'post',
    data,
  });
}

export function votesStation(params) {
  return request.instance({
    url: `/quiz/votes/statistics`,
    method: 'get',
    params,
  });
}

export function fetchQuizPayoutsList(data) {
  return request.instance({
    url: '/quiz/payouts/list',
    method: 'post',
    data,
  });
}

export function fetchQuizPayoutsById(data) {
  return request.instance({
    url: `/quiz/payouts/${data}`,
    method: 'get',
  });
}

export function fetchQuizVotesById(id) {
  return request.instance({
    url: `/quiz/votes/${id}`,
    method: 'get',
  });
}

export function fetchQuizMatchVotes(data) {
  return request.instance({
    url: '/quiz/matchVotes/list',
    method: 'post',
    data,
  });
}

export function lockMatchVotes(data) {
  return request.instance({
    url: `/quiz/matchVotes/lock`,
    method: 'put',
    data,
  });
}

export function fetchQuizMatchVotesById(id) {
  return request.instance({
    url: `/quiz/matchVotes/${id}`,
    method: 'get',
  });
}

export function addQuizMatchVotes(data) {
  return request.instance({
    url: '/quiz/matchVotes/create',
    method: 'post',
    data,
  });
}

export function editQuizMatchVotes(data) {
  return request.instance({
    url: `/quiz/matchVotes/update/${data.id}`,
    method: 'put',
    data,
  });
}
