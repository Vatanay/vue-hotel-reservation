<template>
<header class="mb-auto">
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4">
        <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
            <img src="src/assets/logo.svg" height="32" class="me-2" /> <span class="fs-5 fw-light">Summer Vibes</span>
        </a>
        <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto dropdown">
            <a class="me-4 py-2 text-dark text-decoration-none" v-for="(menu, index) in menu_items" :key="index" :href="menu.url" v-html="menu.name"/>
            <a class="ms-4 py-2 text-dark text-decoration-none" href="#">
                <img :src="user.avatar" class="rounded-circle align-bottom" style="height:25px">
                {{user.name}} <i class="bi bi-chevron-down small"></i>
            </a>
        </nav>
    </div>
</header>
</template>

<script>
export default {
    data() {
        return {
            menu_items: [{
                name: "Hotels",
                url: "#",
            },{
                name: "Entertainment",
                url: "#",
            },{
                name: "Support",
                url: "#",
            },{
                name: "Pricing",
                url: "#",
            }],
            user: {
                name: "John Doe",
                avatar: "https://thispersondoesnotexist.com/image",
            }
        }
    },
};
</script>