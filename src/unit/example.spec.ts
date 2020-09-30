import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home Simple Unit Test", () => {
  it("shows inputs", () => {
    const title = "Angular Weather App";
    const wrapper = shallowMount(Home, {
      propsData: { title }
    });
    expect(wrapper.text()).to.include(title);
  });
});
