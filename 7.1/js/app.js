const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const units = ref([]);
        const data_error = ref(false);

        const fetchUnits = async () => {
            try {
                const response = await fetch('unitss.json');
                const data = await response.json();
                units.value = data;
            } catch (error) {
                const data_error = ref(true)
            }
        };

        onMounted(() => {
            fetchUnits();
        });

        return { units, data_error };
    }
}).mount('#app');
