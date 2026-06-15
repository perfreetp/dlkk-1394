export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/map/index',
    'pages/routes/index',
    'pages/mine/index',
    'pages/treasure-detail/index',
    'pages/route-edit/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF7D4A',
    navigationBarTitleText: '城市散步宝藏',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FFF8F0',
  },
  tabBar: {
    color: '#B2BEC3',
    selectedColor: '#FF7D4A',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页推荐',
      },
      {
        pagePath: 'pages/map/index',
        text: '地图探索',
      },
      {
        pagePath: 'pages/routes/index',
        text: '路线清单',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
})
