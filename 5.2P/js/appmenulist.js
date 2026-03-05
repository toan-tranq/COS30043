const { createApp, defineComponent, toRefs } = Vue;

const MyMenu = defineComponent({
    props: {
        menu: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const { menu } = toRefs(props);
        return {
            menu
        };
    },
    template: `
        <ul class="list-group">
            <li v-for="(item, index) in menu" :key="index" class="list-group-item">
                {{ item }}
            </li>
        </ul>
    `
});

const app = createApp({
    components: {
        'mymenu': MyMenu
    }
});

app.mount('#app');
