<template>
<div v-if="this.$store.state.wizard_step == 0" class="w-75 mx-auto">
    <h1>{{welcome.title}}</h1>
    <p class="lead">{{welcome.subtitle}}</p>
    <p class="lead">
        <button type="button" class="btn btn-lg btn-primary" @click="begin()" v-html="welcome.primary_action" />
    </p>
</div>
</template>

<script>
export default {
    data() {
        return {
            welcome: {
                title: "Need a break?",
                subtitle: "Summer Vibes opens doors to all hotels in the world for you and your family. It also compares all prices and highlights the best.",
                primary_action: "Start here"
            }
        }
    },
    methods: {
        begin() {
            this.$emit("begin");
        },
    },
};
</script>
