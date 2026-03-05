const { createApp, ref, defineComponent, computed, watch } = Vue;
const { createRouter, createWebHashHistory, useRoute } = VueRouter;

const units = [
    { code: 'ICT10001', name: 'Problem Solving with ICT', credits: 12.5, type: 'Core' },
    { code: 'COS10005', name: 'Web Development', credits: 12.5, type: 'Core' },
    { code: 'INF10003', name: 'Introduction to Business Information Systems', credits: 12.5, type: 'Core' },
    { code: 'INF10002', name: 'Database Analysis and Design', credits: 12.5, type: 'Core' },
    { code: 'COS10009', name: 'Introduction to Programming', credits: 12.5, type: 'Core' },
    { code: 'INF30029', name: 'Information Technology Project Management', credits: 12.5, type: 'Core' },
    { code: 'ICT30005', name: 'Professional Issues in Information Technology', credits: 12.5, type: 'Core' },
    { code: 'ICT30001', name: 'Information Technology Project', credits: 12.5, type: 'Core' },
];

// Home Component
const Home = defineComponent({
    setup() {
        const unitsList = ref(units);
        const unit = ref(null);
        const route = useRoute();

        const findUnit = (id) => {
            return unitsList.value.find(u => u.code === id);
        };

        watch(route, () => {
            unit.value = findUnit(route.params.id);
        }, { immediate: true });

        return { unit, unitsList, route };
    },
    template: `
        <div>
            <h1>Unit Information</h1>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Unit Code</th>
                        <th>Unit Name</th>
                        <th>Credit Points</th>
                        <th>Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="unit in unitsList" :key="unit.code">
                        <td>{{ unit.code }}</td>
                        <td>{{ unit.name }}</td>
                        <td>{{ unit.credits }}</td>
                        <td>{{ unit.type }}</td>
                        <td><router-link :to="'/unit/' + unit.code" >View Details</router-link></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="unit">
            <h1>{{ unit.name }}</h1>
            <p><strong>Unit Code:</strong> {{ unit.code }}</p>
            <p><strong>Description:</strong> {{ unit.name }}</p>
            <p><strong>Credit Points:</strong> {{ unit.credits }}</p>
            <p><strong>Type:</strong> {{ unit.type }}</p>
            <router-link to="/">Back to Home</router-link>
        </div>
    `
});

// Creating the VueRouter
const routes = [
    { path: '/', component: Home },
    { path: '/unit/:id', component: Home }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// create new app instance
const app = createApp({});
app.use(router);
app.mount('#app');
