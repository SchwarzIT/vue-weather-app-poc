<template>
  <div>
    <scu-anchor-group v-for="city in cities" :key="city.id" scu-theme="schwarz">
      <scu-anchor
        :key="city.id"
        v-bind:text="`${city.name.toUpperCase()} ${city.temperature}`"
        element="h1"
        class="city-entity"
      ></scu-anchor>
    </scu-anchor-group>
    <div class="new-city" scu-theme="schwarz">
      <scu-input id="city" placeholder="City and temperature"></scu-input>
      <scu-button
        class="add-button"
        text="Add"
        variant="default"
        color="primary"
        @click="addCity()"
      ></scu-button>
    </div>
  </div>
</template>

<script>
import CityDataService from "../cityDataService";

export default {
  name: "CityList",
  data() {
    return {
      currentCountry: this.$route.params.iso,
      cities: [],
      newCity: ""
    };
  },
  async created() {
    await this.loadCities();
  },
  methods: {
    async addCity() {
      await CityDataService.create(
        this.currentCountry,
        document.querySelector("#city").value
      )
        .then(response => {
          if (response.status === 201) {
            this.loadCities();
          }
        })
        .catch(e => {
          console.log(e.message);
        });
    },
    async loadCities() {
      CityDataService.getAllByCountry(this.currentCountry)
        .then(response => {
          this.cities = response.data;
        })
        .catch(e => {
          console.log(e.message);
        });
    }
  },
  mounted() {
    this.loadCities();
  }
};
</script>

<style scoped></style>
