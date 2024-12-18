<template>
  <ww-open-data :type="type" :openid="openid" />
</template>

<script>
export default {
  props: ["type", "openid"],
  mounted() {
    this.$nextTick(() => {
      window.top.WWOpenData.bind(this.$el);
      window.top.WWOpenData.on("error", err => this.$emit("openDataError", err));
    });
  }
};
</script>
