const { createApp, ref } = Vue;

createApp({
    components: {
        'app-mypost': {
            setup() {
                const statPosts = ref([]);
                const strStatus = ref('');

                const add = () => {
                    if (strStatus.value.trim()) {
                        statPosts.value.unshift(strStatus.value.trim());
                        strStatus.value = '';
                    }
                };

                const remove = (index) => {
                    statPosts.value.splice(index, 1);
                };

                return {
                    statPosts,
                    strStatus,
                    add,
                    remove
                };
            },
            template: `
                <div class="card">
                    <div class="card-body">
                        <div class="input-group mb-3">
                            <input 
                                v-model="strStatus" 
                                type="text" 
                                class="form-control" 
                                placeholder="Enter your status"
                            />
                            <button @click="add" class="btn btn-primary ms-2" type="button">Post</button>
                        </div>
                        <ul class="list-group">
                            <li 
                                v-for="(status, index) in statPosts" 
                                :key="index" 
                                class="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {{ status }}
                                <button @click="remove(index)" class="btn btn-danger btn-sm">Delete</button>
                            </li>
                        </ul>
                    </div>
                </div>
            `
        }
    }
}).mount('#app');
