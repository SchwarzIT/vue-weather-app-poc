/// <reference types="Cypress" />

describe("Login and state after that", () => {
  it("should successfully log into our app and then access all restricted resources", () => {
    cy.visit("/");

    // get the element and verify that the Log in button is in it
    cy.get(".mode-nav-bar")
      .should(($button) => {
        expect($button).to.have.text("LOG IN ");
      });

    const loginOptions = {
      method: "POST",
      url: Cypress.env("auth_url"),
      body: {
        grant_type: "password",
        username: Cypress.env("auth_username"),
        password: Cypress.env("auth_password"),
        scope: "openid profile email",
        client_id: Cypress.env("auth_client_id"),
        client_secret: Cypress.env("auth_client_secret"),
      },
    };

    cy.request(loginOptions)
      .then((resp) => {
        return resp.body;
      })
      .then((body) => {
        const {access_token, expires_in, id_token} = body;
        const auth0State = {
          nonce: "",
          state: "some-random-state",
        };
        // tslint:disable-next-line:max-line-length
        const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        cy.visit(callbackUrl,
          {
            onBeforeLoad(win) {
              win.document.cookie = "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
            },
          }).then(() => {
          const expires_at = JSON.stringify(
            expires_in * 1000 + new Date().getTime()
          );
          const auth = {
            authenticated: true,
            token: localStorage.getItem("id_token"),
            accessToken: localStorage.getItem("access_token"),
            expiresAt: expires_at,
            user: localStorage.getItem("user"),
          }
          cy.wait(1000);
          expect(auth.authenticated).to.be.true;
          expect(auth.token).to.be.equal(id_token);
          expect(auth.accessToken).to.be.equal(access_token);
          expect(auth.expiresAt).to.be.equal(expires_at);
        });
      });

    cy.wait(1000);

    cy.window().then(
      (win) => {
        expect(win.localStorage.getItem("id_token")).to.be.not.null;
        expect(win.localStorage.getItem("access_token")).to.be.not.null;
        expect(win.localStorage.getItem("expires_at")).to.be.not.null;
        expect(win.localStorage.getItem("user")).to.be.not.null;
      },
    );

    // Home page after successful login

    cy.get(".home-link")
      .should("have.attr", "href", "/home")
      .and("have.attr", "label", "HOME");

    cy.get(".countries-link")
      .should("have.attr", "href", "/country-list")
      .and("have.attr", "label", "COUNTRIES");

    cy.get(".profile-link")
      .should("have.attr", "href", "/user-profile")
      .and("contain", "My Profile");

    cy.get(".log-out")
      .should(($button) => {
        expect($button).to.have.text("LOG OUT ");
      });

    const title = "Vue Weather App";

    // get the element and verify that the app name is in it
    cy.get(".home-nav-header > .hydrated")
      .should("contain", title);

    // get the element and verify that the help message is in it
    cy.get(".title").should(($h3) => {
      expect($h3).to.have.text("Welcome to Vue Weather App! ");
    });

    cy.get(".container > div > .mode-sidebar").should("have.attr", "href", "country-list")
      .and("contain", "Country List");

    // should access country-list and city-list

    let firstCountry: { name: string; iso: any; };
    let nextCountry: { name: string; };
    cy.request({
      method: "GET",
      url: `http://localhost:8082/api/countries`,
    }).then((response) => {
      firstCountry = response.body[0];
      nextCountry = response.body[1];
      return [response.body, firstCountry, nextCountry];
    }).as("getAllCountries");

    cy.get("@getAllCountries").then(() => {

      cy.get(".container > div > .mode-sidebar").click();


      cy.get(":nth-child(1) > .country-entity")
        .should("have.prop", "text", firstCountry.name.toUpperCase());

      cy.get(":nth-child(2) > .country-entity")
        .should("have.prop", "text", nextCountry.name.toUpperCase());

      let firstCity: { name: string; temperature: any; };
      let nextCity: { name: string; temperature: any; };
      cy.request({
        method: "GET",
        url: `http://localhost:8081/api/cities?country=${firstCountry.iso}`,
      }).then((responseCity) => {
        firstCity = responseCity.body[0];
        nextCity = responseCity.body[1];
        return [firstCity, nextCity];
      }).as("getAllCitiesByCountry");

      cy.get("@getAllCitiesByCountry").then(() => {

        cy.get(":nth-child(1) > .country-entity").click();
        cy.url().should("eq", `http://localhost:8080/city-list/${firstCountry.iso}`);

        cy.get(":nth-child(1) > .city-entity").should("have.prop", "text", `${firstCity.name.toUpperCase()} ${firstCity.temperature}`);

        cy.get(":nth-child(2) > .city-entity")
          .should(($h1) => {
            expect($h1).to.have.prop("text", `${nextCity.name.toUpperCase()} ${nextCity.temperature}`);
          });

        cy.url().should("eq", `http://localhost:8080/city-list/${firstCountry.iso}`);
      });

      cy.get("input")
        .type("Dusseldorf 11").should("have.value", "Dusseldorf 11")
        .then(() => {
          cy.get(".add-button").click()
            .then(() => {
              cy.wait(1000);
              cy.get(".city-entity").last()
                .should(($h1) => {
                  expect($h1).to.have.prop("text", "DUSSELDORF 11");
                });
            });

        });
    });

    // should go to user-profile
    cy.get(".top-bar").click();
    cy.get(".top-bar > .profile-link").click()
      .then(() => {
        cy.url().should("eq", `http://localhost:8080/user-profile`);
      });


    const user = {
      name: Cypress.env("auth_username"),
      email: Cypress.env("auth_username"),
    };

    const auth = {
      getProfile: () => {
        return user;
      },
    };

    const testUser = auth.getProfile();

    cy.get(".user-profile")
      .then(() => {
        expect(user).to.equal(testUser);
      });

    cy.get("[element=\"h2\"] > .headline > .headline-content")
      .should("contain", "Your User Details:");

    cy.get("img")
      .should("be.visible");

    cy.get("#name")
      .should("contain", `Name: ${testUser.name}`);

    cy.get("#email")
      .should("contain", `Email: ${testUser.email}`);

    cy.get(".top-bar").click();

    // should log out from our app
    cy.get(".top-bar > :nth-child(2)").click()
      .then(() => {
        cy.wait(500);
        cy.url().should("eq", "http://localhost:8080/home");
        cy.window().then(
          (win) => {
           expect(win.localStorage.getItem("access_token")).to.be.null;
            expect(win.localStorage.getItem("id_token")).to.be.null;
            expect(win.localStorage.getItem("expires_at")).to.be.null;
            expect(win.localStorage.getItem("user")).to.be.null;
            expect(win.localStorage.getItem("authenticated")).to.be.null;
          },
        );
      });
  });
})
;
