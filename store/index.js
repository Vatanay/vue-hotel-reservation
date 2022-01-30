import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    wizard_step: 0,
    order: {
      hotel_id: 0,
      start_date: "",
      end_date: "",
      adult: 0,
      child: 0,
      room_type: 0,
      room_scenic: 0,
      price: 0,
      coupon_code: "",
      card_name: "",
      card_number: "",
      card_date_month: "",
      card_date_year: "",
      card_cvv: "",
    },
  },
  mutations: {
    update(state, props) {
      state.order[props[0]] = props[1];
    },
    clear(state) {
      state.order = {
        hotel_id: 0,
        start_date: "",
        end_date: "",
        adult: 0,
        child: 0,
        room_type: 0,
        room_scenic: 0,
        price: 0,
        coupon_code: "",
        card_name: "",
        card_number: "",
        card_date_month: "",
        card_date_year: "",
        card_cvv: "",
      };
    },
  },
});
