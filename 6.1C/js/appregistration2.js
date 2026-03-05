const { createApp, ref, reactive, computed } = Vue;

const RegistrationForm = {
    template: `
                <form @submit.prevent="validateForm" method="post" action="http://mercury.swin.edu.au/it000000/formtest.php">
                    <fieldset>
                        <legend>Registration Form</legend>
                        <div class="mb-3">
                            <label for="firstName" class="form-label">First Name</label>
                            <input type="text" name="firstName" class="form-control" id="firstName" v-model="formData.firstName">
                            <div v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input type="text" name="lastName" class="form-control" id="lastName" v-model="formData.lastName">
                            <div v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" name="username" class="form-control" id="username" v-model="formData.username">
                            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" name="password" class="form-control" id="password" v-model="formData.password">
                            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" name="confirmPassword" class="form-control" id="confirmPassword" v-model="formData.confirmPassword">
                            <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" id="email" v-model="formData.email">
                            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="streetAddress" class="form-label">Street Address</label>
                            <input type="text" name="streetAddress" class="form-control" id="streetAddress" v-model="formData.streetAddress">
                            <div v-if="errors.streetAddress" class="text-danger">{{ errors.streetAddress }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="suburb" class="form-label">Suburb</label>
                            <input type="text" name="suburb" class="form-control" id="suburb" v-model="formData.suburb">
                            <div v-if="errors.suburb" class="text-danger">{{ errors.suburb }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="postcode" class="form-label">Postcode</label>
                            <input type="text" name="postcode" class="form-control" id="postcode" v-model="formData.postcode">
                            <div v-if="errors.postcode" class="text-danger">{{ errors.postcode }}</div>
                        </div>
                        <div class="mb-3">
                            <label for="mobile" class="form-label">Mobile Number</label>
                            <input type="text" name="mobile" class="form-control" id="mobile" v-model="formData.mobile">
                            <div v-if="errors.mobile" class="text-danger">{{ errors.mobile }}</div>
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="termsCheck" v-model="showTerms">
                            <label class="form-check-label" for="termsCheck">Show Terms and Conditions</label>
                        </div>
                        <div v-if="showTerms" class="mb-3">
                            <p class="text-muted">Terms and conditions go here...</p>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </fieldset>
                </form>
            `,
    setup() {
        const formData = reactive({
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            streetAddress: '',
            suburb: '',
            postcode: '',
            mobile: ''
        });

        const errors = reactive({});
        const showTerms = ref(false);

        const validateForm = () => {
            Object.keys(errors).forEach(key => delete errors[key]);

            if (!formData.firstName || !/^[a-zA-Z]+$/.test(formData.firstName)) {
                errors.firstName = 'First name is required and must contain only letters.';
            }

            if (!formData.lastName || !/^[a-zA-Z]+$/.test(formData.lastName)) {
                errors.lastName = 'Last name is required and must contain only letters.';
            }

            if (!formData.username || formData.username.length < 3) {
                errors.username = 'Username is required and must be at least 3 characters long.';
            }

            if (!formData.password || !/[!@#$%^&*]/.test(formData.password) || formData.password.length < 8) {
                errors.password = 'Password is required, must be at least 8 characters long and contain at least one special character ($, %, ^, &, *).';
            }

            if (formData.confirmPassword !== formData.password) {
                errors.confirmPassword = 'Passwords do not match.';
            }

            if (!formData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
                errors.email = 'A valid email address is required.';
            }

            if (formData.streetAddress.length > 40) {
                errors.streetAddress = 'Street address must be 40 characters or less.';
            }

            if (formData.suburb.length > 20) {
                errors.suburb = 'Suburb must be 20 characters or less.';
            }

            if (!formData.postcode || !/^\d{4}$/.test(formData.postcode)) {
                errors.postcode = 'Postcode is required and must be exactly 4 digits.';
            }

            if (!formData.mobile || !/^04\d{8}$/.test(formData.mobile)) {
                errors.mobile = 'Mobile number is required and must be 10 digits starting with 04.';
            }

            if (Object.keys(errors).length === 0) {
                const formElement = document.querySelector('form');
                formElement.submit();
            }
        };

        return {
            formData,
            errors,
            showTerms,
            validateForm
        };
    }
};

const app = createApp({
    components: {
        'registration-form': RegistrationForm
    }
});

app.mount('#app');