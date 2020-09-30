<template>
  <div class="callback">
    <img class="svg" src="../assets/callback.svg" alt="Loading..." />
  </div>
</template>

<script>
export default {
  name: "callback",
  mounted() {
    this.$auth.handleAuthentication().then(() => {
      this.$router.push({ name: "home" });
      window.location.reload();
    });
  }
};
</script>
