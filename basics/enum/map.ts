export const mapTheme = [
  { label: "永恒", value: "pro" },  //产品让取消灰色
  { label: "星空", value: "deep" },
  { label: "拂晓", value: "blue" },
  { label: "青柠", value: "green" },
  { label: "薄暮", value: "purple" },
  { label: "魔幻", value: "magic" },
  { label: "火焰", value: "red" },
  { label: "荧光", value: "fluorescence" }
];

export const mapColor = {
  purple: ["#388BE9", "#AC4DBD"],
  blue: ["#A7FFBC", "#315CFB"],
  green: ["#04BE91", "#CAE60D"],
  pro: ["#DBE3EF", "#536484"],
  deep: ["#2172D8", "#05D4A3"],
  red: ["#FFDC00", "#F75013"],
  magic: ["#3E6DF5", "#FF4659"],
  fluorescence: ["#00FF88", "#0BFEFF"]
};

export const mapColorOptions = {
  purple: {
    mainColor: ["#388BE9", "#AC4DBD"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#FFF",
    hoverColor: "#FFA940",
    hoverBorderColor: "#FFF",
    hoverBorderWidth: 2,
    outColor: ["#ECF0F6"]
  },
  blue: {
    mainColor: ["#A7FFBC", "#315CFB"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#FFF",
    hoverColor: "#FFA940",
    hoverBorderColor: "#FFF",
    hoverBorderWidth: 2,
    outColor: ["#ECF0F6"]
  },
  green: {
    mainColor: ["#04BE91", "#CAE60D"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#EDE6A8",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#EDE6A8",
    outColor: ["#ECF0F6"]
  },
  pro: {
    mainColor: ["#DBE3EF", "#536484"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#fff",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#fff",
    outColor: ["#ECF0F6"]
  },
  deep: {
    mainColor: ["#2172D8", "#05D4A3"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#19C9EF",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#fff",
    outColor: ["#ECF0F6"]
  },
  red: {
    mainColor: ["#FFDC00", "#F75013"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#19C9EF",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#fff",
    outColor: ["#ECF0F6"]
  },
  magic: {
    mainColor: ["#3E6DF5", "#FF4659"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#19C9EF",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#fff",
    outColor: ["#ECF0F6"]
  },
  fluorescence: {
    mainColor: ["#00FF88", "#0BFEFF"],
    textColor: "#000",
    borderWidth: 1,
    borderColor: "#19C9EF",
    hoverColor: "#FFA940",
    hoverBorderWidth: 2,
    hoverBorderColor: "#fff",
    outColor: ["#ECF0F6"]
  }
};

export const mapArea = [
  { label: "全国", value: "all" },
  { label: "省级", value: "province" },
  { label: "市级", value: "city" }
];

export const mapDrill = [
  { label: "$r_language.modules.MapDrill.driLabal_province$", value: "province" },
  { label: "$r_language.modules.MapDrill.driLabal_city$", value: "city" },
  { label: "$r_language.modules.MapDrill.driLabal_disabled$", value: "disabled" }
];

export const getColorByTheme = theme => {
  if (typeof theme !== "string") {
    throw Error("uncorrect theme type");
  //  return false;
  }
  return mapColor[theme] ? mapColor[theme] : [];
};
