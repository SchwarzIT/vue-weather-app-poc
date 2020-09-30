import auth from "./auth";

declare module "vue/types/vue" {
  interface VueConstructor extends Vue {
    $auth: auth;
  }
}
