/**
 * 同/环比
 * inc = increase增长
 */
export enum Ratio {
  INCVALUE = 1, // 环比增长值
  INCRATE = 2, // 环比增长率
  LASTYEARINCVALUE = 3, // 上年同比增长值
  LASTYEARINCRATE = 4, // 上年同比增长率
  LASTMONTHINCVALUE = 5, // 上月同比增长值
  LASTMONTHINCRATE = 6, // 上月同比增长率
  LASTWEEKINCVALUE = 7, // 上周同比增长值
  LASTWEEKINCRATE = 8 // 上周同比增长率
}
export const analysisRatio = {
  // 年
  Y: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
  // 年-季
  YQ: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-月
  YM: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-周
  YW: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-月-日
  YMD: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastMincValue$", value: Ratio.LASTMONTHINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastMincRate$", value: Ratio.LASTMONTHINCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastWincValue$", value: Ratio.LASTWEEKINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastWincRate$", value: Ratio.LASTWEEKINCRATE }
  ],
  M: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
  MD: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastMincValue$", value: Ratio.LASTMONTHINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastMincRate$", value: Ratio.LASTMONTHINCRATE },
  ],
  D: [
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
};
export default {
  // 年
  Y: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
  // 年-季
  YQ: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-月
  YM: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-周
  YW: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
  ],
  // 年-月-日
  YMD: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastYincValue$", value: Ratio.LASTYEARINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastYincRate$", value: Ratio.LASTYEARINCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastMincValue$", value: Ratio.LASTMONTHINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastMincRate$", value: Ratio.LASTMONTHINCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastWincValue$", value: Ratio.LASTWEEKINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastWincRate$", value: Ratio.LASTWEEKINCRATE }
  ],
  M: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
  MD: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
    { label: "$r_language.saticOP.ratioLabel.lastMincValue$", value: Ratio.LASTMONTHINCVALUE },
    { label: "$r_language.saticOP.ratioLabel.lastMincRate$", value: Ratio.LASTMONTHINCRATE },
  ],
  D: [
    { label: "$r_language.saticOP.ratioLabel.undefined$", value: undefined },
    { label: "$r_language.saticOP.ratioLabel.incValue$", value: Ratio.INCVALUE },
    { label: "$r_language.saticOP.ratioLabel.incRate$", value: Ratio.INCRATE },
  ],
};
