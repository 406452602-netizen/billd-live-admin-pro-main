import {
  auditStatusEnum,
  BlacklistTypeEnum,
  ClientAppEnum,
  ClientEnvEnum,
  DanmuMsgTypeEnum,
  GlobalMsgTypeEnum,
  GoodsTypeEnum,
  InviteAgent,
  LiveRoomTypeEnum,
  LoginRecordEnum,
  MsgContentTypeEnum,
  QuizMatchStatus,
  QuizMatchTypeEnum,
  QuizVoteType,
  VoteResult,
} from '@/interface';

export const GITHUB_REPO = 'https://github.com/galaxy-s10/billd-live-admin';

export const POSTMESSAGE_TYPE = ['qq_login', 'github_login', 'login_expired'];

export const GlobalMsgTypeEnumMap = {
  [GlobalMsgTypeEnum.system]: '系统消息',
  [GlobalMsgTypeEnum.user]: '用户消息',
  [GlobalMsgTypeEnum.activity]: '活动消息',
  [GlobalMsgTypeEnum.notification]: '通知消息',
};

export const LoginRecordEnumMap = {
  [LoginRecordEnum.loginId]: '账号密码登录',
  [LoginRecordEnum.loginUsername]: '用户名密码登录',
  [LoginRecordEnum.loginQq]: 'qq登录',
  [LoginRecordEnum.registerId]: '账号密码注册',
  [LoginRecordEnum.registerUsername]: '用户名密码注册',
  [LoginRecordEnum.registerQq]: 'qq注册',
};

export const liveRoomTypeEnumMap = {
  [LiveRoomTypeEnum.msr]: 'msr推流',
  [LiveRoomTypeEnum.obs]: 'obs推流',
  [LiveRoomTypeEnum.pk]: '打pk',
  [LiveRoomTypeEnum.srs]: 'srs推流',
  [LiveRoomTypeEnum.system]: '系统推流',
  [LiveRoomTypeEnum.tencentcloud_css]: '腾讯云css推流',
  [LiveRoomTypeEnum.tencentcloud_css_pk]: '腾讯云css打pk',
  [LiveRoomTypeEnum.wertc_live]: 'webrtc直播',
  [LiveRoomTypeEnum.wertc_meeting_one]: 'webrtc会议一',
  [LiveRoomTypeEnum.wertc_meeting_two]: 'webrtc会议二',
  [LiveRoomTypeEnum.forward_all]: '转推所有',
  [LiveRoomTypeEnum.forward_bilibili]: '转推b站',
  [LiveRoomTypeEnum.forward_douyin]: '转推抖音',
  [LiveRoomTypeEnum.forward_douyu]: '转推斗鱼',
  [LiveRoomTypeEnum.forward_huya]: '转推虎牙',
  [LiveRoomTypeEnum.forward_kuaishou]: '转推快手',
  [LiveRoomTypeEnum.forward_xiaohongshu]: '转推小红书',
};

// 全局的localStorage的key
export const LOCALSTORAGE_KEY = {
  env: 'env',
  token: 'token',
};

// 全局的cookie的key
export const COOKIE_KEY = {
  loginEnv: 'loginEnv',
};

export const MONIT_TYPE_MAP = {
  1: '服务器内存日志',
  2: '服务器内存达到阈值',
  3: '监控七牛云',
  4: '监控node进程',
  5: '重启pm2',
  6: '清除buff/cache',
  7: '备份数据库成功',
  8: '备份数据库失败',
};

export const DEFAULT_AUTH_INFO = {
  ALL_AUTH: {
    id: 1,
    auth_value: 'ALL_AUTH',
  },
  USER_MANAGE: {
    id: 2,
    auth_value: 'USER_MANAGE',
  },
  ROLE_MANAGE: {
    id: 3,
    auth_value: 'ROLE_MANAGE',
  },
  AUTH_MANAGE: {
    id: 4,
    auth_value: 'AUTH_MANAGE',
  },
  MESSAGE_MANAGE: {
    id: 5,
    auth_value: 'MESSAGE_MANAGE',
  },
  MESSAGE_SEND: {
    id: 6,
    auth_value: 'MESSAGE_SEND',
  },
  MESSAGE_DISABLE: {
    id: 7,
    auth_value: 'MESSAGE_DISABLE',
  },
  LOG_MANAGE: {
    id: 8,
    auth_value: 'LOG_MANAGE',
  },
  LIVE_MANAGE: {
    id: 9,
    auth_value: 'LIVE_MANAGE',
  },
  LIVE_PUSH: {
    id: 10,
    auth_value: 'LIVE_PUSH',
  },
  LIVE_PUSH_CDN: {
    id: 11,
    auth_value: 'LIVE_PUSH_CDN',
  },
  LIVE_PULL: {
    id: 12,
    auth_value: 'LIVE_PULL',
  },
  LIVE_PUSH_FORWARD_BILIBILI: {
    id: 13,
    auth_value: 'LIVE_PUSH_FORWARD_BILIBILI',
  },
  LIVE_PUSH_FORWARD_HUYA: {
    id: 14,
    auth_value: 'LIVE_PUSH_FORWARD_HUYA',
  },
  LIVE_PUSH_FORWARD_DOUYU: {
    id: 15,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYU',
  },
  LIVE_PUSH_FORWARD_DOUYIN: {
    id: 16,
    auth_value: 'LIVE_PUSH_FORWARD_DOUYIN',
  },
  LIVE_PUSH_FORWARD_KUAISHOU: {
    id: 17,
    auth_value: 'LIVE_PUSH_FORWARD_KUAISHOU',
  },
  LIVE_PUSH_FORWARD_XIAOHONGSHU: {
    id: 18,
    auth_value: 'LIVE_PUSH_FORWARD_XIAOHONGSHU',
  },

  USER_INVITE_MANAGE: {
    id: 19,
    auth_value: 'USER_INVITE_MANAGE',
  },
  MATCH_MANAGE: {
    id: 20,
    auth_value: 'MATCH_MANAGE',
  },
  MATCH_LIST: {
    id: 21,
    auth_value: 'MATCH_LIST',
  },
  MATCH_VOTES: {
    id: 22,
    auth_value: 'MATCH_VOTES',
  },
  MATCH_SEASONS_LIST: {
    id: 23,
    auth_value: 'MATCH_SEASONS_LIST',
  },
  MATCH_TYPES: {
    id: 24,
    auth_value: 'MATCH_TYPES',
  },
  MATCH_TEAMS: {
    id: 25,
    auth_value: 'MATCH_TEAMS',
  },

  AGENCY_BOOKKEEPING: {
    id: 26,
    auth_value: 'AGENCY_BOOKKEEPING',
  },
  PROFIT_BOOKKEEPING: {
    id: 27,
    auth_value: 'PROFIT_BOOKKEEPING',
  },
  GAME_CONSUMPTION_BOOKKEEPING: {
    id: 28,
    auth_value: 'GAME_CONSUMPTION_BOOKKEEPING',
  },
  MEMBER_BOOKKEEPING: {
    id: 29,
    auth_value: 'MEMBER_BOOKKEEPING',
  },

  WALLET_MANAGEMENT: {
    id: 30,
    auth_value: 'WALLET_MANAGEMENT',
  },
  BANK_CONFIG: {
    id: 31,
    auth_value: 'BANK_CONFIG',
  },
  BANK_CARD_MANAGEMENT: {
    id: 32,
    auth_value: 'BANK_CARD_MANAGEMENT',
  },
  RECHARGE_RECORD: {
    id: 33,
    auth_value: 'RECHARGE_RECORD',
  },
  WITHDRAWAL_RECORD: {
    id: 34,
    auth_value: 'WITHDRAWAL_RECORD',
  },

  AD_MANAGEMENT: {
    id: 35,
    auth_value: 'AD_MANAGEMENT',
  },

  GOODS_MANAGEMENT: {
    id: 36,
    auth_value: 'GOODS_MANAGEMENT',
  },
};

export const DEFAULT_ROLE_INFO = {
  ALL_ROLE: {
    id: 1,
    role_value: 'ALL_ROLE',
  },
  ADMIN: {
    id: 2,
    role_value: 'ADMIN',
  },
  SUPER_ADMIN: {
    id: 3,
    role_value: 'SUPER_ADMIN',
  },
  LIVE_ADMIN: {
    id: 4,
    role_value: 'LIVE_ADMIN',
  },
  USER: {
    id: 5,
    role_value: 'USER',
  },
  VIP_USER: {
    id: 6,
    role_value: 'VIP_USER',
  },
  SVIP_USER: {
    id: 7,
    role_value: 'SVIP_USER',
  },
  TOURIST_USER: {
    id: 8,
    role_value: 'TOURIST_USER',
  },
};

export const ROUTE_ROLES = { SUPER_ADMIN: 'SUPER_ADMIN', ADMIN: 'ADMIN' };

// 路由sort，值越大越往上
export const ROUTE_SORT = {
  dashboard: 300,
  log: 200,
  monit: 200,
  blacklist: 200,
  visitor: 200,
  comment: 199,
  star: 199,
  schedule: 180,
  live: 180,
  user: 120,
  auth: 110,
  role: 110,
  order: 110,
  goods: 110,
  quiz: 110,
  wallet: 110,
  ad: 110,
  loginRecord: 110,
  globalMsg: 110,
  accountRecord: 110,
  thirdUser: 100,
  setting: 90,
  qiniu: 70,
  article: 60,
  music: 60,
  works: 60,
  link: 60,
  tag: 60,
  type: 60,
  github: 10,
};

export const blacklistTypeEnumMap = {
  [BlacklistTypeEnum.admin_disable]: '管理员禁用',
  [BlacklistTypeEnum.disable_msg]: '禁言',
  [BlacklistTypeEnum.frequent]: '请求频繁',
};

export const goodsTypeEnumMap = {
  [GoodsTypeEnum.recharge]: '充值',
  [GoodsTypeEnum.gift]: '礼物',
  [GoodsTypeEnum.sponsors]: '赞助',
  [GoodsTypeEnum.support]: '服务',
};

export const msgTypeMap = {
  [DanmuMsgTypeEnum.danmu]: '弹幕',
  [DanmuMsgTypeEnum.otherJoin]: '其他人加入房间',
  [DanmuMsgTypeEnum.redbag]: '红包',
  [DanmuMsgTypeEnum.reward]: '打赏',
  [DanmuMsgTypeEnum.system]: '系统消息',
  [DanmuMsgTypeEnum.userLeaved]: '用户离开房间',
};

export const msgContentTypeMap = {
  [MsgContentTypeEnum.img]: '图片',
  [MsgContentTypeEnum.txt]: '文本',
  [MsgContentTypeEnum.video]: '视频',
};

export const ClientEnvMap = {
  [ClientEnvEnum.android]: '安卓端',
  [ClientEnvEnum.ios]: '苹果端',
  [ClientEnvEnum.ipad]: 'ipad端',
  [ClientEnvEnum.macos]: 'mac端',
  [ClientEnvEnum.web]: '网页端',
  [ClientEnvEnum.web_mobile]: '移动网页端',
  [ClientEnvEnum.web_pc]: '电脑网页端',
  [ClientEnvEnum.windows]: 'win端',
};

export const ClientAppMap = {
  [ClientAppEnum.billd_live]: 'billd直播前台',
  [ClientAppEnum.billd_live_admin]: 'billd直播后台',
  [ClientAppEnum.billd_desk]: 'billd远程前台',
  [ClientAppEnum.billd_desk_admin]: 'billd远程后台',
};

export const QuizMatchTypeEnumMap = {
  [QuizMatchTypeEnum.GROUP_STAGE]: '小组赛',
  [QuizMatchTypeEnum.KNOCKOUT_STAGE]: '淘汰赛',
  [QuizMatchTypeEnum.FINAL]: '决赛',
};

export const QuizMatchStatusEnumMap = {
  [QuizMatchStatus.notStarted]: '未开始',
  [QuizMatchStatus.inProgress]: '进行中',
  [QuizMatchStatus.completed]: '已结束',
};

export const IM_NAMESPACE = {
  live: '/live',
  chat: '/chat',
};

export const QuizVoteTypeMap = {
  [QuizVoteType.winLoss]: '全场独赢',
  [QuizVoteType.letBall]: '全场让球',
  [QuizVoteType.gameNumber]: '全场总局分数',
  [QuizVoteType.overGameLetBall]: '大局让分',
  [QuizVoteType.bureauLetBall]: '单局让分',
  [QuizVoteType.oddPurchase]: '倍率购买',
};

export const InviteAgentMap = {
  [InviteAgent.member]: '会员',
  [InviteAgent.agent]: '代理商',
};

export const VoteResultMap = {
  [VoteResult.lose]: '输',
  [VoteResult.win]: '赢',
  [VoteResult.draw]: '平',
};

export const auditStatusEnumMap = {
  [auditStatusEnum.PENDING_SUBMIT]: '待支付',
  [auditStatusEnum.PENDING]: '待审核',
  [auditStatusEnum.APPROVED]: '已审核',
  [auditStatusEnum.REJECTED]: '已拒绝',
  [auditStatusEnum.CANCELED]: '已取消',
};
