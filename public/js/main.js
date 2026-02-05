document.addEventListener('DOMContentLoaded', () => {
    // ---- Autocomplete Logic ----
    // Comprehensive list of major Indian cities
    const indianCities = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", 
        "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", 
        "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", 
        "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", 
        "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Howrah", 
        "Ranchi", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada", "Jodhpur", "Madurai", 
        "Raipur", "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Bareilly", 
        "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", 
        "Salem", "Mira-Bhayandar", "Warangal", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", 
        "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", 
        "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded", 
        "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", 
        "Jhansi", "Ulhasnagar", "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", 
        "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon", "Udaipur", "Maheshtala"
    ];

    function setupAutocomplete(inputId, suggestionsId) {
        const input = document.getElementById(inputId);
        const suggestionsBox = document.getElementById(suggestionsId);

        if (!input || !suggestionsBox) return;

        input.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            suggestionsBox.innerHTML = '';

            if (query.length === 0) {
                suggestionsBox.classList.add('hidden');
                return;
            }

            const matches = indianCities.filter(city => city.toLowerCase().includes(query));

            if (matches.length > 0) {
                matches.forEach(city => {
                    const div = document.createElement('div');
                    div.classList.add('suggestion-item');
                    div.textContent = city;
                    div.addEventListener('click', () => {
                        input.value = city;
                        suggestionsBox.classList.add('hidden');
                    });
                    suggestionsBox.appendChild(div);
                });
            } else {
                // If city not found, show "Others" option
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.style.color = '#888';
                div.innerHTML = `<em>Use "${this.value}" (Others)</em>`;
                div.addEventListener('click', () => {
                    suggestionsBox.classList.add('hidden');
                });
                suggestionsBox.appendChild(div);
            }

            suggestionsBox.classList.remove('hidden');
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== input && !suggestionsBox.contains(e.target)) {
                suggestionsBox.classList.add('hidden');
            }
        });
    }

    // Drivers
    setupAutocomplete('hero_city', 'hero_city_suggestions');
    setupAutocomplete('modal_city', 'modal_city_suggestions');

    // Passengers
    setupAutocomplete('p_hero_city', 'p_hero_city_suggestions');
    setupAutocomplete('p_modal_city', 'p_modal_city_suggestions');


    // ---- Modal Logic ----
    const modal = document.getElementById('onboardingModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Show modal after 3 seconds
    setTimeout(() => {
        if (modal && modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
        }
    }, 3000); 

    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // ---- Form Handling ----
    const forms = [
        document.getElementById('heroForm'),           // Driver
        document.getElementById('modalForm'),          // Driver
        document.getElementById('passengerHeroForm'),  // Passenger
        document.getElementById('passengerModalForm')  // Passenger
    ];

    forms.forEach(form => {
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if this is a passenger form
            const isPassenger = form.id === 'passengerHeroForm' || form.id === 'passengerModalForm';

            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const loader = submitBtn.querySelector('.loader');

            const fullNameInput = form.querySelector('input[name="fullName"]');
            const mobileNumberInput = form.querySelector('input[name="mobileNumber"]');
            const licenseNumberInput = form.querySelector('input[name="licenseNumber"]'); // Maybe null for passenger
            const cityInput = form.querySelector('input[name="city"]'); 

            const fullName = fullNameInput ? fullNameInput.value.trim() : '';
            const mobileNumber = mobileNumberInput ? mobileNumberInput.value.trim() : '';
            const licenseNumber = licenseNumberInput ? licenseNumberInput.value.trim() : '';
            const city = cityInput ? cityInput.value.trim() : '';

            // Basic Validation
            // If Passenger, ignore licenseNumber
            let missingFields = !fullName || !mobileNumber || !city;
            if (!isPassenger) {
                 missingFields = missingFields || !licenseNumber;
            }

            if (missingFields) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Missing Information',
                    text: 'Please fill in all fields.',
                    confirmButtonColor: '#000000'
                });
                return;
            }

            if (mobileNumber.length !== 10) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Input',
                    text: 'Please enter a valid 10-digit mobile number.',
                    confirmButtonColor: '#000000'
                });
                return;
            }

            // Set Loading UI
            if (submitBtn) {
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = 'Submitting...';
                if (loader) loader.classList.remove('hidden');
            }

            // Prepare payload
            const formData = { fullName, mobileNumber, city };
            if(!isPassenger) {
                formData.licenseNumber = licenseNumber;
            }

            // Select Endpoint
            const apiEndpoint = isPassenger ? '/api/register-passenger' : '/api/register';

            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Success
                    form.reset();
                    
                    if (modal && !modal.classList.contains('hidden')) {
                        closeModal();
                    }

                    // SweetAlert2 Success
                    let successHtml = `<p>${data.message}</p>`;
                    
                    if (data.isEarlyBird && !isPassenger) { // Only for drivers
                         successHtml += '<div style="background: #e3f2fd; padding:10px; border-radius:8px; margin-top:10px; color:#276EF1;"><strong>Congratulations!</strong><br>You are eligible for Zero Commission.</div>';
                    }

                    Swal.fire({
                        icon: 'success',
                        title: isPassenger ? 'Interest Registered!' : 'Registration Successful!',
                        html: successHtml,
                        confirmButtonText: 'Great!',
                        confirmButtonColor: '#00C853'
                    });

                } else {
                    // Server Error
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: data.message || 'Something went wrong.',
                        confirmButtonColor: '#000000'
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Error',
                    text: 'Unable to connect to server. Please check your internet connection.',
                    confirmButtonColor: '#000000'
                });
            } finally {
                // Reset Loading UI
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (btnText) btnText.textContent = isPassenger ? 'Submit Interest' : 'Start Earning';
                    if (loader) loader.classList.add('hidden');
                }
            }
        });
    });
});
