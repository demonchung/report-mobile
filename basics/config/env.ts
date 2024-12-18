import options from "@h3/report-mobile/dist/options";

let env: any;

if (options.baseUrl) {
  env = options.baseUrl;
} else if (process.env.NODE_ENV === "development") {
  const local =
    window.localStorage.getItem("H3_DEV_GROUP") ||
    window.localStorage.getItem("H3_DEV_GROUP_MOBILE");
  env = `https://${local}.h3yun.com/rx-report/integrate`;
} else {
  env = window.location.origin + "/rx-report/integrate";
}
export default env;
