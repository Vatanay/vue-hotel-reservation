<template>
  <div id="app" class="d-flex w-100 h-100 mx-auto flex-column">
    <Background />
    <Header />
    <main class="p-3 container">
      <Welcome @begin="start" :service="service" />
      <section class="py-2 text-center" id="finder" v-bind:class="this.$store.state.wizard_step > 0 ? 'opacity-100 d-block' : 'opacity-0 d-none'">
        <div class="row py-lg-5">
          <div class="col-10 mx-auto">
            <div class="accordion" v-if="service">
              <div class="accordion-item">
                <p class="accordion-header text-white text-start p-2 small" v-bind:class="this.$store.state.wizard_step > 1 ? 'bg-dark' : 'bg-primary bg-gradient'">
                  <template v-if="selectedHotelDetails.hotel_name && this.$store.state.wizard_step > 1"><i class="bi bi-check2"></i> You are planning to go to {{ selectedHotelDetails.hotel_name }}</template>
                  <template v-else><i class="bi bi-building"></i> Hotel</template>
                </p>
                <div id="wizard-hotel" class="accordion-collapse" v-bind:class="this.$store.state.wizard_step == 1 ? 'collapsed' : 'collapse'">
                  <div class="accordion-body row justify-content-center">
                    <div class="col-6 text-start">
                      <p class="small mb-2">Which hotel would you like to go to?</p>
                      <vSelect name="hotels" label="hotel_name" class="mb-2" :options="hotels" :reduce="(hotel) => hotel.id" v-model="selectedHotel" @input="selectHotel()" placeholder="Please choose."></vSelect>
                      <template v-if="selectedHotel > 0">
                        <span class="badge bg-success fw-light">{{ selectedHotelDetails.city }}</span>
                        <span class="badge bg-danger fw-light" v-if="selectedHotelDetails.child_status === false">Adult Only</span>
                        <template v-for="(possibility, index) in selectedHotelDetails.possibilities">
                          <span class="badge bg-secondary fw-light me-1" v-bind:key="index">{{ possibility }}</span>
                        </template>
                        <button class="btn btn-primary btn-lg mt-5 d-block mx-auto fw-light" v-if="selectedHotel" v-on:click="$store.state.wizard_step = 2">Next <i class="bi bi-chevron-right align-bottom"></i></button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-item" v-bind:class="this.$store.state.wizard_step > 1 ? 'd-block' : 'd-none'">
                <p class="accordion-header text-white text-start p-2 small" v-bind:class="this.$store.state.wizard_step > 2 ? 'bg-dark' : 'bg-primary bg-gradient'">
                  <template v-if="totalDate && orderlist.adult && this.$store.state.wizard_step > 2"><i class="bi bi-check2"></i> {{ Number(orderlist.adult) + Number(orderlist.child) }} person will stay for {{ totalDate }} nights.</template>
                  <template v-else><i class="bi bi-calendar-week"></i> Duration</template>
                </p>

                <div id="wizard-detail" class="accordion-collapse" v-bind:class="this.$store.state.wizard_step == 2 ? 'collapsed' : 'collapse'">
                  <div class="accordion-body row justify-content-center">
                    <div class="col-6 text-start">
                      <div class="form-group">
                        <label for="date"><small>Date</small></label>
                        <DateRangePicker ref="picker" class="d-block" id="date" v-model="dateRange" :date-format="dateFormat" @update="calculateDays()">
                          <template v-slot:input="picker" style="min-width: 350px">
                            {{ picker.startDate | startPlaceholder }}
                            {{ picker.startDate ? "-" : "" }}
                            {{ picker.endDate | endPlaceholder }}
                          </template>
                        </DateRangePicker>
                      </div>
                    </div>
                    <div class="text-center col-1">
                      <div class="form-group">
                        <label for="adult"><small>Adult</small></label>
                        <select class="form-control" id="adult" v-model="orderlist.adult" @change="storage('adult', orderlist.adult)">
                          <option v-for="(n, index) in selectedHotelDetails.max_adult_size" :key="index">
                            {{ index }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="text-center col-1" v-if="selectedHotelDetails.child_status">
                      <label for="child small"><small>Child</small></label>
                      <select class="form-control" id="child" v-model.number="orderlist.child" v-if="selectedHotelDetails.child_status" @change="storage('child', orderlist.child)">
                        <option v-for="(n, index) in selectedHotelDetails.max_adult_size" :key="index">
                          {{ index }}
                        </option>
                      </select>
                    </div>
                    <div class="col-12 mt-3 text-center">
                      <div class="text-muted small mb-5" v-if="!selectedHotelDetails.child_status">* This hotel welcomes adult guests only.</div>
                      <button class="btn fw-light text-muted" v-on:click="$store.state.wizard_step -= 1">Back</button>
                      <button class="btn btn-primary btn-lg" v-bind:class="totalDate && orderlist.adult > 0 ? '' : 'disabled'" v-on:click="$store.state.wizard_step += 1">Next</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-item" v-bind:class="this.$store.state.wizard_step > 2 ? 'd-block' : 'd-none'">
                <p class="accordion-header text-white text-start p-2 small" v-bind:class="this.$store.state.wizard_step > 3 ? 'bg-dark' : 'bg-primary bg-gradient'">
                  <template v-if="orderlist.room_type > 0 && orderlist.room_scenic > 0 && this.$store.state.wizard_step > 3"><i class="bi bi-check2"></i> Your room is ready: {{ searchArray(room_type, "id", orderlist.room_type).title }}</template>
                  <template v-else><i class="bi bi-door-open"></i> Room</template>
                </p>
                <div id="wizard-room" class="accordion-collapse" v-bind:class="this.$store.state.wizard_step == 3 ? 'collapsed' : 'collapse'">
                  <div class="accordion-body">
                    <div class="album py-4" v-if="this.$store.state.wizard_step == 3">
                      <div class="container text-start">
                        <h5>Room Type</h5>
                        <p class="small">Please select the type of room you want to stay in.</p>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 text-start">
                          <div class="col" v-for="room in room_type" :key="room.id" v-bind:class="orderlist.room_type !== room.id && orderlist.room_type !== 0 ? 'opacity-25' : ''" v-on:click="selectRoom(room.price, room.price * totalDate * (Number(orderlist.adult) + Number(orderlist.child)), room.id)">
                            <div class="card h-100 cursor-pointer">
                              <img class="bcard-img-top" width="100%" v-bind:src="room.photo" />
                              <div class="card-body">
                                <h5 class="card-title">{{ room.title }}</h5>
                                <p class="card-text small">
                                  {{ room.description }}
                                </p>
                              </div>
                              <div class="card-footer text-end">
                                <small class="text-muted">Price for {{ totalDate }} nights</small>
                                <h4 class="m-0">{{ room.price * totalDate * (Number(orderlist.adult) + Number(orderlist.child)) }} TL</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h5 class="mt-5" id="room_scenic">Room Scenic</h5>
                        <p class="small">How would you like the view of your room to be?</p>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                          <div
                            class="col"
                            v-for="scenic in room_scenic"
                            :key="scenic.id"
                            v-bind:class="orderlist.room_scenic !== scenic.id && orderlist.room_scenic !== 0 ? 'opacity-25' : ''"
                            v-on:click="
                              orderlist.room_scenic = scenic.id;
                              selectedPriceRate = scenic.price_rate;
                            "
                          >
                            <div class="card bg-dark text-white border-0 cursor-pointer">
                              <img v-bind:src="scenic.photo" class="card-img" />
                              <div class="card-img-overlay text-center d-flex align-items-center">
                                <p class="card-text">{{ scenic.title }}</p>
                                <h4 class="card-title" v-if="selectedRoomPrice > 0">
                                  {{
                                    scenic.price_rate > 1
                                      ? (selectedRoomPrice * totalDate * (Number(orderlist.adult) + Number(orderlist.child)) + (selectedRoomPrice * totalDate * (Number(orderlist.adult) + Number(orderlist.child)) * scenic.price_rate) / 100).toFixed(2)
                                      : selectedRoomPrice * totalDate * (Number(orderlist.adult) + Number(orderlist.child))
                                  }}
                                  TL
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="text-center mt-3">
                          <div class="text-muted small mb-3" v-if="selectedPriceRate > 1">
                            * The room view you have selected increases the price by
                            {{ selectedPriceRate }}%.
                          </div>
                          <button class="btn fw-light text-muted" v-on:click="$store.state.wizard_step -= 1">Back</button>
                          <button class="btn btn-primary btn-lg" v-bind:class="orderlist.room_type !== 0 && orderlist.room_scenic ? '' : 'disabled'" v-on:click="$store.state.wizard_step += 1">Next</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-item" v-bind:class="this.$store.state.wizard_step > 3 ? 'd-block' : 'd-none'">
                <p class="accordion-header text-white text-start p-2 small" v-bind:class="this.$store.state.wizard_step > 4 ? 'bg-dark' : 'bg-primary bg-gradient'">
                  <template v-if="this.$store.state.wizard_step > 4"><i class="bi bi-check2"></i> Payment completed successfully.</template>
                  <template v-else><i class="bi bi-cart2"></i> Payment</template>
                </p>
                <div id="wizard-room" class="accordion-collapse" v-bind:class="this.$store.state.wizard_step == 4 ? 'collapsed' : 'collapse'">
                  <div class="accordion-body">
                    <div class="album py-4" v-bind:class="this.$store.state.wizard_step == 4 ? '' : 'd-none'">
                      <div class="container text-start">
                        <div class="row">
                          <div class="col-12 col-sm-6 me-auto">
                            <h5>Room Type</h5>
                            <p class="small">Please select the type of room you want to stay in.</p>
                            <div class="card-wrapper mt-4"></div>
                            <form id="cc-form" class="row">
                              <div class="mb-3 col-12">
                                <label for="name" class="form-label small">Name on card</label>
                                <input type="text" name="name" id="name" class="form-control form-control-sm" @input="updateOrder('card_name', $event.target.value)" />
                              </div>
                              <div class="mb-3 col-12">
                                <label for="number" class="form-label small">Credit card number</label>
                                <input type="text" name="number" id="number" class="form-control form-control-sm" @input="updateOrder('card_number', $event.target.value)" />
                              </div>
                              <div class="mb-3 col-6">
                                <label for="expiry" class="form-label small">Expiration</label>
                                <input type="text" name="expiry" id="expiry" class="form-control form-control-sm" @input="expiration($event.target.value)" />
                              </div>
                              <div class="mb-3 col-6">
                                <label for="cvc" class="form-label small">CVV/CVV2</label>
                                <input type="text" name="cvc" id="cvc" class="form-control form-control-sm" @input="updateOrder('card_cvv', $event.target.value)" />
                              </div>
                            </form>
                          </div>
                          <div class="col-12 col-sm-5 bg-light row text-center pt-4 pb-4">
                            <h5 class="col-12 mb-3">{{ selectedHotelDetails.hotel_name }} ({{ selectedHotelDetails.city }})</h5>
                            <div class="col-6 mb-3 small"><b>Check-in Date</b><br />{{ orderlist.start_date }}</div>
                            <div class="col-6 mb-3 small"><b>Check-out Date</b><br />{{ orderlist.end_date }}</div>
                            <div class="col-6 mb-3 small"><b>Adult</b><br />{{ orderlist.adult }}</div>
                            <div class="col-6 mb-3 small"><b>Child</b><br />{{ orderlist.child }}</div>
                            <div class="col-6 mb-3 small" v-if="orderlist.room_type > 0"><b>Room Type</b><br />{{ searchArray(room_type, "id", orderlist.room_type).title }}</div>
                            <div class="col-6 mb-3 small" v-if="orderlist.room_scenic > 0"><b>Room View</b><br />{{ searchArray(room_scenic, "id", orderlist.room_scenic).title }}</div>
                            <div class="col-10 mx-auto">
                              <div class="input-group mb-3">
                                <input type="text" class="form-control form-control-sm" v-model="coupon.code" placeholder="Coupon Code" aria-describedby="coupon" :disabled="coupon.result" />
                                <button class="btn btn-secondary btn-sm" type="button" id="coupon" v-on:click="useCoupon()" :disabled="coupon.result">Redeem</button>
                                <div class="text-center w-100 small mt-2" v-if="coupon.message.length > 0" v-html="coupon.message" />
                              </div>
                              <table class="border-0 small mx-auto w-100">
                                <tr>
                                  <td class="text-start pb-2"><b>Room Price</b></td>
                                  <td class="text-end pb-2">{{ selectedRoomPrice }} TL</td>
                                </tr>
                                <tr>
                                  <td class="text-start pb-2"><b>Extra Ratio</b></td>
                                  <td class="text-end pb-2">{{ selectedPriceRate }}%</td>
                                </tr>
                                <tr>
                                  <td class="text-start pb-2"><b>Duration</b></td>
                                  <td class="text-end pb-2">{{ totalDate }} nights</td>
                                </tr>
                                <tr v-if="coupon.result">
                                  <td class="text-start">
                                    <b>Discount ({{ coupon.code }})</b>
                                  </td>
                                  <td class="text-end">-{{ (selectedRoomPrice * totalDate * (Number(orderlist.adult) + Number(orderlist.child)) * Number(coupon.answer.discount_ammount)) / 100 }} TL</td>
                                </tr>
                              </table>
                              <hr />
                              <table class="border-0 small mx-auto w-100">
                                <tr>
                                  <td class="text-start"><b>TOTAL</b></td>
                                  <td class="text-end">
                                    <h5 class="m-0">{{ price().toFixed(2) }} TL</h5>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <div class="col-12 mt-3 text-center">
                            <button class="btn fw-light text-muted" v-on:click="$store.state.wizard_step -= 1">Back</button>
                            <button class="btn btn-primary btn-lg" v-on:click="finish()">Pay {{ price().toFixed(2) }} TL</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-item" v-bind:class="this.$store.state.wizard_step > 4 ? 'd-block' : 'd-none'">
                <p class="accordion-header text-white text-start p-2 small" v-bind:class="this.$store.state.wizard_step > 5 ? 'bg-dark' : 'bg-primary bg-gradient'">
                  <template v-if="this.$store.state.wizard_step > 5"><i class="bi bi-check2"></i> Reservation completed.</template>
                  <template v-else><i class="bi bi-card-checklist"></i> Reservation</template>
                </p>
                <div id="wizard-room" class="accordion-collapse" v-bind:class="this.$store.state.wizard_step == 5 ? 'collapsed' : 'collapse'">
                  <div class="accordion-body">
                    <div class="album py-4" v-if="this.$store.state.wizard_step == 5">
                      <div class="container text-start">
                        <div class="row">
                          <div class="col-12 col-sm-6 me-auto">
                            <div class="feature">
                              <div class="feature-icon bg-primary bg-gradient"><i class="bi bi-patch-check" width="1em" height="1em"></i></div>
                              <h5>Reservation completed</h5>
                              <p class="small">Your reservation summary is listed below. You can use the links below to change your reservation or make a new reservation.</p>
                              <a v-on:click="clear()" class="cursor-pointer icon-link text-decoration-none"> New reservation <i class="bi bi-chevron-right small"></i> </a>
                            </div>
                          </div>
                          <div class="col-12 col-sm-5 bg-light row text-center pt-4 pb-4 rounded">
                            <h5 class="col-12 mb-3">{{ selectedHotelDetails.hotel_name }} ({{ selectedHotelDetails.city }})</h5>
                            <div class="col-6 mb-3 small"><b>Check-in Date</b><br />{{ orderlist.start_date }}</div>
                            <div class="col-6 mb-3 small"><b>Check-out Date</b><br />{{ orderlist.end_date }}</div>
                            <div class="col-6 mb-3 small"><b>Adult</b><br />{{ orderlist.adult }}</div>
                            <div class="col-6 mb-3 small"><b>Child</b><br />{{ orderlist.child }}</div>
                            <div class="col-6 mb-3 small" v-if="orderlist.room_type > 0"><b>Room Type</b><br />{{ searchArray(room_type, "id", orderlist.room_type).title }}</div>
                            <div class="col-6 mb-3 small" v-if="orderlist.room_scenic > 0"><b>Room View</b><br />{{ searchArray(room_scenic, "id", orderlist.room_scenic).title }}</div>
                            <div class="col-10 mx-auto">
                              <table class="border-0 small mx-auto w-100">
                                <tr>
                                  <td class="text-start pb-2"><b>Room Price</b></td>
                                  <td class="text-end pb-2">{{ selectedRoomPrice }} TL</td>
                                </tr>
                                <tr>
                                  <td class="text-start pb-2"><b>Extra Ratio</b></td>
                                  <td class="text-end pb-2">{{ selectedPriceRate }}%</td>
                                </tr>
                                <tr>
                                  <td class="text-start pb-2"><b>Duration</b></td>
                                  <td class="text-end pb-2">{{ totalDate }} nights</td>
                                </tr>
                                <tr v-if="coupon.result">
                                  <td class="text-start">
                                    <b>Discount ({{ coupon.code }})</b>
                                  </td>
                                  <td class="text-end">-{{ (selectedRoomPrice * totalDate * (Number(orderlist.adult) + Number(orderlist.child)) * Number(coupon.answer.discount_ammount)) / 100 }} TL</td>
                                </tr>
                              </table>
                              <hr />
                              <table class="border-0 small mx-auto w-100">
                                <tr>
                                  <td class="text-start"><b>TOTAL</b></td>
                                  <td class="text-end">
                                    <h5 class="m-0">{{ price().toFixed(2) }} TL</h5>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                          <div class="col-12 col-sm-5 ms-auto text-center mt-3">
                            <button class="btn btn-link btn-sm text-success" v-on:click="$store.state.wizard_step = 1">Update</button>
                            <button class="btn btn-link btn-sm text-decoration-none text-dark" v-on:click="cancel()">Cancel</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
// Components
import Background from "../components/background.vue";
import Header from "../components/header.vue";
import Welcome from "../components/welcome.vue";
import Footer from "../components/footer.vue";

// Materials
import axios from "axios";
import vSelect from "vue-select";
import DateRangePicker from "vue2-daterange-picker";
import moment from "moment";
import store from "../store";
import * as Card from "card";

export default {
  name: "app",

  components: {
    Background,
    Header,
    Welcome,
    Footer,
    DateRangePicker,
    vSelect,
  },

  data() {
    return {
      hotels: [],
      coupon: {
        result: false,
        code: "",
        answer: "",
        message: "",
      },
      room_type: [],
      room_scenic: [],
      hotel_details: [],
      selectedHotel: "",
      selectedHotelDetails: [],
      selectedPriceRate: 0,
      selectedRoomPrice: 0,
      totalDate: 0,
      dateRange: {
        startDate: "",
        endDate: "",
      },
      service: true,
    };
  },
  methods: {
    start() {
      this.$store.state.wizard_step = 1;
      document.getElementById("finder").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    storage(item, value) {
      localStorage.setItem(item, value);
    },
    clear() {
      localStorage.clear();
      store.commit("clear");
      this.selectedHotel = "";
      this.dateRange.startDate = null;
      this.dateRange.endDate = null;

      this.coupon = {
        result: false,
        code: "",
        answer: "",
        message: "",
      };
      this.$store.state.wizard_step = 0;
    },
    cancel() {
      if (confirm("Are you sure you want to cancel the reservation?")) {
        this.clear();
      }
    },
    updateOrder(key, value) {
      store.commit("update", [key, value]);
    },
    dateFormat(classes, date) {
      if (!classes.disabled) {
        classes.disabled = date.getTime() < new Date();
      }
      return classes;
    },
    async selectHotel() {
      // Get room types and scenics
      let hotel_filter = this.searchArray(this.hotel_details, "hotel_id", this.selectedHotel);
      this.room_type = hotel_filter.room_type;
      this.room_scenic = hotel_filter.room_scenic;

      this.updateOrder("child", 0);
      this.updateOrder("adult", 0);
      this.selectedHotelDetails = this.hotel_details.find((x) => x.hotel_id === Number(this.selectedHotel));
      this.selectedHotelDetails.hotel_name = this.hotels.find((x) => x.id === this.selectedHotel).hotel_name;
      this.storage("hotel", this.selectedHotel);
      this.updateOrder("hotel_id", "" + this.selectedHotel); // Converting hotel_id to string from integer
    },
    calculateDays() {
      const starting = moment(this.dateRange.startDate);
      const ending = moment(this.dateRange.endDate);
      this.updateOrder("start_date", starting.format("YYYY-MM-DD"));
      this.updateOrder("end_date", moment(ending).format("YYYY-MM-DD"));
      this.totalDate = moment(ending).diff(starting, "days");
      this.storage("days", JSON.stringify(this.dateRange));
    },
    selectRoom(room_price, total_price, room_type) {
      this.selectedRoomPrice = room_price;
      this.updateOrder("room_type", room_type);
      document.getElementById("room_scenic").scrollIntoView();
    },
    useCoupon() {
      axios
        .get("https://5f6d939160cf97001641b049.mockapi.io/tkn/coupons?code=" + this.coupon.code)
        .then((response) => {
          this.coupon.answer = response.data;
          if (Object.keys(this.coupon.answer).length === 0) {
            this.coupon.message = '<span class="text-danger">Coupon is invalid.</span>';
            this.coupon.result = false;
          } else {
            if (moment().diff(this.coupon.answer.expiration_at) > 0) {
              this.coupon.message = '<span class="text-warning">The coupon has expired.</span>';
            } else {
              this.coupon.message = '<span class="text-primary">Coupon applied successfully.</span>';
              this.coupon.answer = response.data[0];
              this.coupon.result = true;
              this.updateOrder("coupon_code", this.coupon.code);
            }
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    },
    expiration(value) {
      if (value.includes("/")) {
        let expiry = value.split("/");
        this.updateOrder("card_date_month", expiry[0].trim());
        this.updateOrder("card_date_year", expiry[1].trim());
      }
    },
    searchArray(searchArray, searchKey, searchValue) {
      return searchArray.find((x) => x[searchKey] == searchValue);
    },
    price() {
      let total_price = this.selectedRoomPrice * this.totalDate * (Number(this.orderlist.adult) + Number(this.orderlist.child));
      if (this.coupon.result) total_price = total_price - (total_price * Number(this.coupon.answer.discount_ammount)) / 100;
      if (this.selectedPriceRate > 1) total_price = total_price + (total_price * this.selectedPriceRate) / 100;

      return total_price;
    },
    finish() {
      this.$store.state.wizard_step += 1;
      this.updateOrder("price", this.price());
      this.updateOrder("card_number", this.orderlist.card_number.replace(/\s/g, ""));

      axios
        .post("https://5f6d939160cf97001641b049.mockapi.io/tkn/hotel-bookings", this.orderlist)
        .then((response) => {
          console.info(response);
        })
        .catch((error) => {
          console.error(error.response);
        });
    },
  },
  computed: {
    orderlist: () => store.state.order,
    getHotelDetails() {
      return hotel_details.find((x) => x.id === id);
    },
  },
  async created() {
    axios
      .get("https://5f6d939160cf97001641b049.mockapi.io/tkn/hotels")
      .then((response) => {
        this.hotels = response.data;

        axios
          .get("https://5f6d939160cf97001641b049.mockapi.io/tkn/hotel-details")
          .then((response) => {
            this.hotel_details = response.data;

            if (localStorage.getItem("hotel") !== null) {
              this.selectedHotel = localStorage.getItem("hotel");
              this.selectHotel();
            }
            if (localStorage.getItem("days") !== null) {
              this.dateRange = JSON.parse(localStorage.getItem("days"));
              this.calculateDays();
            }
            if (localStorage.getItem("adult") !== null) this.updateOrder("adult", Number(localStorage.getItem("adult")));
            if (localStorage.getItem("child") !== null) this.updateOrder("child", Number(localStorage.getItem("child")));
          })
          .catch((error) => {
            console.error(error.response);
            this.service = false;
          });
      })
      .catch((error) => {
        console.error(error.response);
        this.service = false;
      });
  },
  mounted: function () {
    new Card({
      form: "form#cc-form",
      container: ".card-wrapper",
      formSelectors: {
        numberInput: "input[name='number']",
        expiryInput: "input[name='expiry']",
        cvcInput: "input[name='cvc']",
        nameInput: "input[name='name']",
      },
      width: 270,
      formatting: true,
      placeholders: {
        number: "•••• •••• •••• ••••",
        name: "Fullname",
        expiry: "••/••",
        cvc: "•••",
      },
    });
  },
  filters: {
    startPlaceholder(val) {
      return val ? moment(val).format("DD/MM/Y") : "";
    },
    endPlaceholder(val) {
      return val ? moment(val).format("DD/MM/Y") : "Select date";
    },
  },
};
</script>

<style lang="scss">
.vs__clear {
  display: none;
}
</style>
