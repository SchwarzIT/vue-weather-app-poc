import Vue from "vue";
import { VueConstructor } from "vue/types/umd";
import auth0, { Auth0DecodedHash, Auth0Error } from "auth0-js";
import { domain, clientId } from "../auth_config.json";
import { User } from "@/models/user";

const webAuth = new auth0.WebAuth({
  domain: domain,
  clientID: clientId,
  redirectUri: "http://localhost:8080/callback",
  responseType: "token id_token",
  scope: "openid profile email"
});

const auth = new Vue({
  computed: {
    authenticated: {
      get: function() {
        return (
          Date.now() <
          JSON.parse(window.localStorage.getItem("expires_at") as string)
        );
      }
    },
    token: {
      get: function() {
        return localStorage.getItem("id_token");
      },
      set: function(id_token: string) {
        localStorage.setItem("id_token", id_token);
      }
    },
    accessToken: {
      get: function() {
        return localStorage.getItem("access_token");
      },
      set: function(accessToken: string) {
        localStorage.setItem("access_token", accessToken);
      }
    },
    expiresAt: {
      get: function() {
        return JSON.parse(localStorage.getItem("expires_at") as string);
      },
      set: function(expiresIn: number) {
        const expiresAt = JSON.stringify(
          expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem("expires_at", expiresAt);
      }
    },
    user: {
      get: function() {
        return JSON.parse(localStorage.getItem("user") as string);
      },
      set: function(user: User) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
  },
  methods: {
    login() {
      webAuth.authorize();
    },
    logout() {
      return new Promise(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user");

        webAuth.logout({
          returnTo: window.location.origin,
          clientID: clientId
        });
      });
    },
    handleAuthentication() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash(
          (
            err: null | (Auth0Error & { state?: string }),
            authResult: Auth0DecodedHash | null
          ) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
              this.expiresAt = authResult.expiresIn;
              this.accessToken = authResult.accessToken;
              this.token = authResult.idToken;
              this.user = authResult.idTokenPayload;

              resolve(authResult);
            } else if (err) {
              this.logout();
              reject(err);
            }
          }
        );
      });
    }
  }
});

export const Auth0Plugin = {
  install(Vue: VueConstructor) {
    Vue.prototype.$auth = auth;
  }
};
