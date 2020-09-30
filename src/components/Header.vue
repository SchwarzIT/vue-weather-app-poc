<template>
  <div>
    <scu-top-bar :label="title" display-mode="fixed" scu-theme="schwarz">
      <div slot="top-bar-right">
        <div v-if="$auth.authenticated">
          <scu-icon icon="user-topbar" size="24"></scu-icon>
          <scu-fly-out
            type="top-bar"
            :label="`Hi, ${$auth.user.name}`"
            element="h3"
          >
            <scu-link class="profile-link" mode="sidebar" href="/user-profile"
              >My Profile
            </scu-link>
            <scu-link mode="sidebar" @click="logout">LOG OUT</scu-link>
          </scu-fly-out>
        </div>
        <div v-if="!$auth.authenticated">
          <scu-link mode="nav-bar" element="h3 text-white" @click="login"
            >LOG IN
          </scu-link>
        </div>
      </div>

      <scu-nav-bar slot="nav-bar" element="text-center">
        <div slot="sidebar-header">
          <scu-headline element="h3">{{ title }}</scu-headline>
        </div>

        <div slot="actions">
          <scu-nav-bar-action
            class="home-link"
            label="HOME"
            href="/home"
          ></scu-nav-bar-action>
          <scu-nav-bar-action
            v-if="$auth.authenticated"
            class="countries-link"
            label="COUNTRIES"
            active
            href="/country-list"
          >
          </scu-nav-bar-action>
        </div>
        <div slot="secondary">
          <div v-if="$auth.authenticated">
            <scu-link class="profile-link" mode="sidebar" href="user-profile"
              >My Profile
            </scu-link>
            <scu-link class="log-out" mode="sidebar" @click="logout"
              >LOG OUT
            </scu-link>
          </div>

          <scu-link
            v-if="$auth.authenticated"
            class="log-in"
            mode="nav-bar"
            @click="login"
            element="h3"
            >LOG IN
          </scu-link>
        </div>
      </scu-nav-bar>
    </scu-top-bar>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logout();
    }
  },
  data: function() {
    return {
      title: "Vue Weather App"
    };
  }
};
</script>

<style scoped></style>
