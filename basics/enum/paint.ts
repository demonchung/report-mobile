/**
 * 颜色枚举
 */

export enum Color {
  PAINTCOATVALUE = "#F3F5F8",
  ELEMENTCOATVALUE = "#FFFFFF",
  TITLECOLOR = "#304265",
  FONTCOLOR = "#304265", // 字体颜色
  THEMEELEMENTCOATVALUE = "RGBA(0,0,0,.4)",
  THEMEFONTCOLOR = "#FFFFFF",
  DARKFONTCOLOR = "#707481",      //浅色风格图表字体颜色
  DARKTITLECOLOR = '#121933',                    // 浅色主题的标题字体颜色
  DARKLEGENDCOLOR = '#707481',                   // 浅色主题的图例字体颜色
  DARKCHARTFONTCOLOR = '#707481',                // 浅色主题的图表字体颜色
  DARKTOOLCOLOR = '#707481',                     // 浅色主题的工具栏颜色
  THEMETITLECOLOR = "#FFFFFF",                    // 深色主题的标题字体颜色
  THEMETOOLCOLOR = "#FFFFFF",                     // 深色主题的工具栏颜色
  THEMELEGENDCOLOR = "rgba(255, 255, 255, 0.85)", // 深色主题的图例颜色
  THEMECHARTFONTCOLOR="rgba(255, 255, 255, 0.45)",// 深色主题的图表字体颜色
  THEME5BACKCOLOR = 'linear-gradient(134deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.75) 51%, rgba(255, 255, 255, 0.75) 100%)',
  THEME5ELEMENTCOLOR = "#FFFFFF 90%"    //主题5组件背景颜色
}

/**
 * 主题类型
 */
export enum ThemeType {
  DEFAULT = "default",
  THEME1 = "theme1",
  THEME2 = "theme2",
  THEME3 = "theme3",
  THEME4 = "theme4",
  THEME5 = "theme5",
  THEME6 = "theme6",
  THEME7 = "theme7",
  THEME8 = "theme8",
  THEME9 = "theme9",
  THEME10 = "theme10",
  THEME11 = "theme11",
  THEME12 = "theme12",
}
/**
 * 主题类型
 */
export  const ThemeColorType = {
  default : "light",
  theme1 : "dark",
  theme2 : "dark",
  theme3 : "dark",
  theme4 : "dark",
  theme5 : "light",
  theme6 : "dark",
  theme7 : "dark",
  theme8 : "dark",
  theme9 : "dark",
  theme10 : "dark",
  theme11 : "dark",
  theme12 : "light",
}
/**
 * 图表风格颜色搭配 目前只有深色系和浅色系 
 * 以后扩展颜色在这写
 */
export  const chartTheme = {
  light: {
    splitLine: {
      lineStyle:'#DEDEDE'
    }
  },
  dark: {
    splitLine: {
      lineStyle:'rgba(255,255,255,.1)'
    }
  }
}

/**
 * 组件外套类型
 */
export enum CoatType {
  BGCOLOR = "bgColor",
  BGPICTURE = "bgPicture"
}

export const paints = {
  default: {
    url: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/default.png"),
    themeType: ThemeType.DEFAULT,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: Color.PAINTCOATVALUE,
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.ELEMENTCOATVALUE,
    titleColor: Color.TITLECOLOR,
    fontColor: Color.FONTCOLOR
  },
  theme1: {
    url: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme1.png"),
    themeType: ThemeType.THEME1,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme1-bg.png"),
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEMEELEMENTCOATVALUE,
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR
  },
  theme2: {
    url: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme2.png"),
    themeType: ThemeType.THEME2,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme2-bg.png"),
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEMEELEMENTCOATVALUE,
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR
  },
  theme3: {
    url: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme3.png"),
    themeType: ThemeType.THEME3,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme3-bg.png"),
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEMEELEMENTCOATVALUE,
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR
  },
  theme4: {
    url: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme4.png"),
    themeType: ThemeType.THEME4,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: require("@h3/report-mobile/basics/assets/dashboard-pro/theme/theme4-bg.png"),
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEMEELEMENTCOATVALUE,
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR
  }
};

export const paintsPro = {
  default: {
    url: 'default2.png',
    themeType: ThemeType.DEFAULT,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: Color.PAINTCOATVALUE,
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.ELEMENTCOATVALUE,
    titleColor: Color.DARKTITLECOLOR,
    fontColor: Color.DARKFONTCOLOR,
    title: '极光白',
    colorsTheme: 'theme1',
    // legendColor: Color.DARKLEGENDCOLOR,
    // toolColor: Color.DARKTOOLCOLOR
  },
  theme5: {
    url: 'theme5.png',
    themeType: ThemeType.THEME5,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(181deg, #74B1FB 0%, #CFEBFF 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEME5BACKCOLOR,
    titleColor: Color.DARKTITLECOLOR,
    fontColor: Color.DARKFONTCOLOR,
    title: '樱粉流星',
    colorsTheme: 'theme10',
    // legendColor: Color.DARKLEGENDCOLOR,
    // toolColor: Color.DARKTOOLCOLOR
  },
  theme6: {
    url: 'theme6.png',
    themeType: ThemeType.THEME6,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: 'theme6-bg.png',
    elementCoatType: CoatType.BGPICTURE,
    elementCoatValue: 'theme6-cg.png',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '星际穿越',
    colorsTheme: 'theme1',

    // legendColor: Color.THEMELEGENDCOLOR,
    // toolColor: Color.THEMETOOLCOLOR

  },
  theme7: {
    url: 'theme7.png',
    themeType: ThemeType.THEME7,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(272deg, #18171C 0%, #38192A 29%, #1C303E 49%, #253335 68%, #1D0F1B 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(135deg, rgba(46,192,170,0.800) 0%, rgba(28,14,0,0.800) 25%, #200E00 78%, rgba(111,16,39,0.800) 100%)',
    titleColor: '#0BFEFF',
    fontColor: Color.THEMEFONTCOLOR,
    title: '幻彩霓虹',
    styles: {
      'border': '1px solid',
      'border-image':'linear-gradient(135deg, rgba(32, 254, 249, 1), rgba(31, 253, 248, 1), rgba(25, 13, 0, 1), rgba(30, 15, 0, 1), rgba(200, 20, 114, 1), rgba(189, 21, 105, 1)) 1 1'
    },
    colorsTheme: 'theme9',
    // legendColor: Color.THEMELEGENDCOLOR,
    // toolColor: Color.THEMETOOLCOLOR
  },
  theme8: {
    url: 'theme8.png',
    themeType: ThemeType.THEME8,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: '#282828',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: '#303030',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '静谧黑',
    colorsTheme: 'theme1',
  },
  theme9: {
    url: 'theme9.png',
    themeType: ThemeType.THEME9,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: 'theme9-bg.png',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(180deg, rgba(34,46,61,0.8) 0%, rgba(14,40,70,0.9) 0%, rgba(5,22,39,0.87) 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '浩瀚星海',
    styles:{
      'border': '1px solid #25384B'
    },
    colorsTheme: 'theme7',
  },
  theme10: {
    url: 'theme10.png',
    themeType: ThemeType.THEME10,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(180deg, #1C192F 0%, #343A47 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(133deg, #516178 0%, #3F4F67 16%, #28374B 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '极光森林',
    styles: {
      'box-shadow': '0px 2px 12px 0px #051E2A',
      'border': '1px solid',
      'border-image':'linear-gradient(135deg, rgba(204, 210, 218, 1), rgba(61, 79, 98, 1), rgba(56, 74, 96, 1), rgba(189, 196, 205, 1)) 1 1'
    },
    colorsTheme: 'theme6',
  },
  theme11: {
    url: 'theme11.png',
    themeType: ThemeType.THEME11,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(180deg, #121A22 0%, #3D4452 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(180deg, #222E3D 0%, #0F161D 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '梦幻星空',
    styles: {
      'border-radius': '0',
      'box-shadow': '0px 2px 12px 0px #051E2A, inset 0px 1px 0px 0px #17FFF0',
    },
    colorsTheme: 'theme8',
  }
};

export const paintsProDash = {
  default: {//极光白
    url: 'default2.png',
    themeType: ThemeType.DEFAULT,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: Color.PAINTCOATVALUE,
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.ELEMENTCOATVALUE,
    titleColor: Color.DARKTITLECOLOR,
    fontColor: Color.DARKFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_auroraWhite$',
    colorsTheme: 'theme24',
    // legendColor: Color.DARKLEGENDCOLOR,
    // toolColor: Color.DARKTOOLCOLOR
  },
  theme5: {//樱粉流星
    url: 'theme5.png',
    themeType: ThemeType.THEME5,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(180deg, #E2F1FF 0%, #EFF5FF 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: Color.THEME5ELEMENTCOLOR,
    titleColor: Color.DARKTITLECOLOR,
    fontColor: Color.DARKFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_cherryPink$',
    colorsTheme: 'theme26',
    // legendColor: Color.DARKLEGENDCOLOR,
    // toolColor: Color.DARKTOOLCOLOR
  },
  theme12: {//海盐苏打
    url: 'theme12.png',
    themeType: ThemeType.THEME12,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: '#F9F9F9',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: '#F3F3F3',
    titleColor: Color.DARKTITLECOLOR,
    fontColor: Color.DARKFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_twelve$',
    styles: {
      'border-radius': '0',
      'box-shadow': 'inset 0px 2px 0px 0px #1990FF',
    },
    colorsTheme: 'theme22',
  },
  theme8: {//静谧黑
    url: 'theme8.png',
    themeType: ThemeType.THEME8,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: '#282828',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: '#303030',
    titleColor: Color.THEMETITLECOLOR,
   fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_black$',
    colorsTheme: 'theme24',
  },
  theme11: { //极光森林
    url: 'theme11.png',
    themeType: ThemeType.THEME11,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(180deg, #121A22 0%, #3D4452 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(180deg, #222E3D 0%, #0F161D 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_dreamStar$',
    styles: {
      'border-radius': '0',
      'box-shadow': '0px 2px 12px 0px #051E2A, inset 0px 1px 0px 0px #17FFF0',
    },
    colorsTheme: 'theme25',
  },
  theme9: {//浩瀚星海
    url: 'theme9.png',
    themeType: ThemeType.THEME9,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: 'theme9-bg.png',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(180deg, rgba(34,46,61,0.8) 0%, rgba(14,40,70,0.9) 0%, rgba(5,22,39,0.87) 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_vastStarry$',
    styles:{
      'border': '1px solid #25384B'
    },
    colorsTheme: 'theme21',
  },
  theme10: {//赤霞橘光
    url: 'theme10.png',
    themeType: ThemeType.THEME10,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(180deg, #1C192F 0%, #343A47 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(133deg, #516178 0%, #3F4F67 16%, #28374B 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_auroraForest$',
    styles: {
      'box-shadow': '0px 2px 12px 0px #051E2A',
      'border': '1px solid',
      'border-image':'linear-gradient(135deg, rgba(204, 210, 218, 1), rgba(61, 79, 98, 1), rgba(56, 74, 96, 1), rgba(189, 196, 205, 1)) 1 1'
    },
    colorsTheme: 'theme21',
  },
  theme7: { //幻彩霓虹
    url: 'theme7.png',
    themeType: ThemeType.THEME7,
    paintCoatType: CoatType.BGCOLOR,
    paintCoatValue: 'linear-gradient(272deg, #18171C 0%, #38192A 29%, #1C303E 49%, #253335 68%, #1D0F1B 100%)',
    elementCoatType: CoatType.BGCOLOR,
    elementCoatValue: 'linear-gradient(135deg, rgba(46,192,170,0.800) 0%, rgba(28,14,0,0.800) 25%, #200E00 78%, rgba(111,16,39,0.800) 100%)',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_mirageNeon$',
    styles: {
      'border': '1px solid',
      'border-image':'linear-gradient(135deg, rgba(32, 254, 249, 1), rgba(31, 253, 248, 1), rgba(25, 13, 0, 1), rgba(30, 15, 0, 1), rgba(200, 20, 114, 1), rgba(189, 21, 105, 1)) 1 1'
    },
    colorsTheme: 'theme27',
    // legendColor: Color.THEMELEGENDCOLOR,
    // toolColor: Color.THEMETOOLCOLOR
  },
  theme6: { //星际穿越
    url: 'theme6.png',
    themeType: ThemeType.THEME6,
    paintCoatType: CoatType.BGPICTURE,
    paintCoatValue: 'theme6-bg.png',
    elementCoatType: CoatType.BGPICTURE,
    elementCoatValue: 'theme6-cg.png',
    titleColor: Color.THEMETITLECOLOR,
    fontColor: Color.THEMEFONTCOLOR,
    title: '$r_language.view.header.globalStyle.theme_interstellar$',
    colorsTheme: 'theme1',

    // legendColor: Color.THEMELEGENDCOLOR,
    // toolColor: Color.THEMETOOLCOLOR

  },
};

export default {
  paints
};
