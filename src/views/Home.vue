<template>
  <div class="home">
    <div class="container text-center my-5">
      <div v-if="this.$auth.authenticated">
        <scu-headline class="title m-3" element="h1"
          >Welcome to {{ title }}!
        </scu-headline>
        <scu-link mode="sidebar" href="country-list" color="primary"
          >Country List
        </scu-link>
      </div>
      <div v-if="!this.$auth.authenticated">
        <scu-headline class="title m-3" element="h1"
          >Please, Log in by clicking on the button above to
          proceed!</scu-headline
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";

export default class Home extends Vue {
  @Prop() private title = "Vue Weather App";
}
</script>
<style scoped></style>
