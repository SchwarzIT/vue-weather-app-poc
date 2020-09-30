<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<style lang="scss">
@import "/design/index.scss";
</style>
<script>
import Header from "@/components/Header";

export default {
  components: { Header }
};
</script>
