const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // Features data
        const features = ref([
            {
                icon: 'fas fa-calendar-check',
                title: 'Wide Event Selection',
                description: 'Access hundreds of events across various categories and interests.'
            },
            {
                icon: 'fas fa-user-friends',
                title: 'Networking Opportunities',
                description: 'Connect with professionals and like-minded individuals.'
            },
            {
                icon: 'fas fa-clock',
                title: 'Time-Efficient',
                description: 'Quick search and registration process saves you valuable time.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Secure Registration',
                description: 'Your personal information is protected with industry-standard security.'
            },
            {
                icon: 'fas fa-mobile-alt',
                title: 'Mobile Friendly',
                description: 'Access and register for events from any device, anywhere.'
            },
            {
                icon: 'fas fa-headset',
                title: '24/7 Support',
                description: 'Our support team is always ready to assist you.'
            }
        ]);

        // Events data (in real scenario, load from events.txt)
        const events = ref([
            { id: 'E001', name: 'Tech Conference 2023', category: 'Technology', duration: 8 },
            { id: 'E002', name: 'Startup Funding Workshop', category: 'Business', duration: 4 },
            { id: 'E003', name: 'Digital Marketing Summit', category: 'Marketing', duration: 6 },
            { id: 'E004', name: 'Financial Planning Seminar', category: 'Finance', duration: 3 },
            { id: 'E005', name: 'AI & Machine Learning Expo', category: 'Technology', duration: 7 },
            { id: 'E006', name: 'Entrepreneurship Bootcamp', category: 'Business', duration: 12 },
            { id: 'E007', name: 'Social Media Marketing', category: 'Marketing', duration: 5 },
            { id: 'E008', name: 'Investment Strategies', category: 'Finance', duration: 4 },
            { id: 'E009', name: 'Web Development Workshop', category: 'Technology', duration: 6 },
            { id: 'E010', name: 'Business Networking Mixer', category: 'Business', duration: 3 }
        ]);

        // Categories
        const categories = ref(['All', 'Technology', 'Business', 'Marketing', 'Finance']);

        // Filters
        const filters = ref({
            id: '',
            name: '',
            duration: '',
            category: 'All'
        });

        // Form data
        const form = ref({
            username: '',
            password: '',
            confirmPassword: '',
            category: 'Business', // Default as per requirement
            eventName: ''
        });

        const passwordMatch = ref(true);
        const passwordMessage = ref('');
        const submitted = ref(false);

        // Filtered events based on filters
        const filteredEvents = computed(() => {
            return events.value.filter(event => {
                // Filter by ID
                if (filters.value.id && !event.id.toLowerCase().includes(filters.value.id.toLowerCase())) {
                    return false;
                }
                
                // Filter by Name
                if (filters.value.name && !event.name.toLowerCase().includes(filters.value.name.toLowerCase())) {
                    return false;
                }
                
                // Filter by Duration
                if (filters.value.duration && event.duration != filters.value.duration) {
                    return false;
                }
                
                // Filter by Category
                if (filters.value.category !== 'All' && event.category !== filters.value.category) {
                    return false;
                }
                
                return true;
            });
        });

        // Events filtered by selected category for dropdown
        const filteredEventsByCategory = computed(() => {
            if (form.value.category === 'All') return events.value;
            return events.value.filter(event => event.category === form.value.category);
        });

        // Check password match
        const checkPasswordMatch = () => {
            if (form.value.password && form.value.confirmPassword) {
                passwordMatch.value = form.value.password === form.value.confirmPassword;
                passwordMessage.value = passwordMatch.value 
                    ? '✓ Passwords match' 
                    : '✗ Passwords do not match';
            } else {
                passwordMessage.value = '';
            }
        };

        // Form validation
        const isFormValid = computed(() => {
            return form.value.username && 
                   form.value.password && 
                   form.value.confirmPassword && 
                   form.value.eventName && 
                   passwordMatch.value;
        });

        // Get badge class for category
        const getCategoryBadge = (category) => {
            const classes = {
                'Technology': 'bg-info',
                'Business': 'bg-success',
                'Marketing': 'bg-warning',
                'Finance': 'bg-danger'
            };
            return classes[category] || 'bg-secondary';
        };

        // Registration function
        const register = () => {
            if (isFormValid.value) {
                submitted.value = true;
                // In real app, you would send data to server here
                console.log('Registration data:', form.value);
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    submitted.value = false;
                    form.value = {
                        username: '',
                        password: '',
                        confirmPassword: '',
                        category: 'Business',
                        eventName: ''
                    };
                    passwordMessage.value = '';
                }, 5000);
            }
        };

        // Watch category change to reset event selection
        Vue.watch(() => form.value.category, () => {
            form.value.eventName = '';
        });

        return {
            features,
            events,
            categories,
            filters,
            form,
            passwordMatch,
            passwordMessage,
            submitted,
            filteredEvents,
            filteredEventsByCategory,
            checkPasswordMatch,
            isFormValid,
            getCategoryBadge,
            register
        };
    }
}).mount('#app');