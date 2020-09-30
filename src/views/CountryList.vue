<template>
  <div>
    <scu-anchor-group
      v-for="country in currentCountries"
      :key="country.id"
      scu-theme="schwarz"
      style="text-align: center"
    >
      <scu-anchor
        class="country-entity"
        :key="country.id"
        v-bind:text="country.name.toUpperCase()"
        element="h1"
        v-on:click="goToCityList(country.iso)"
      ></scu-anchor>
    </scu-anchor-group>
  </div>
</template>

<script>
import CountryDataService from "../countryDataService";
import router from "../router";

export default {
  data() {
    return {
      currentCountries: []
    };
  },
  async created() {
    await this.loadCountries();
  },
  methods: {
    async loadCountries() {
      CountryDataService.getAll()
        .then(response => {
          this.currentCountries = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    goToCityList(iso) {
      router.push({ name: "city-list", params: { iso: iso } });
    }
  }
};
</script>

<style scoped></style>
