document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('section');

    // Event listener for menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = document.getElementById(item.dataset.target);
            sections.forEach(section => {
                section.style.display = (section === targetSection) ? 'block' : 'none';
            });
        });
    });

    // Function to display recent destinations and past itineraries
    function displayRecentDestinationsAndPastItineraries() {
        const recentDestinations = [
            { destination: 'Italy', date: '10th May 2024' },
            { destination: 'New York', date: '15th April 2024' },
            { destination: 'Tokyo', date: '20th March 2024' }
        ];
        displayList(recentDestinations, 'recent-destinations-list');
        displayList(recentDestinations, 'past-itineraries-list');
    }

    function displayList(destinations, elementId) {
        const listElement = document.getElementById(elementId);
        listElement.innerHTML = '';
        destinations.forEach(destination => {
            const listItem = document.createElement('li');
            listItem.textContent = `${destination.destination} - ${destination.date}`;
            listElement.appendChild(listItem);
        });
    }

    // Call the function to initially display recent destinations and past itineraries
    displayRecentDestinationsAndPastItineraries();

    // Scroll event listener for navbar
    window.addEventListener('scroll', function() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Search button in Home section
    const searchHomeBtn = document.getElementById('search-home-btn');
    searchHomeBtn.addEventListener('click', function() {
        const searchValue = document.getElementById('search-bar-home').value.trim().toLowerCase();
        displayFeaturedItinerary(searchValue, 'featured-itineraries');
    });

    function displayFeaturedItinerary(searchValue, elementId) {
        const itineraries = {
            'paris': `
                <div class="destination-card">
                    <h2>Paris - 3 Days Trip</h2>
                    <p><strong>Destination:</strong> Paris</p>
                    <p><strong>Dates:</strong> 3 days</p>
                    <p><strong>Activities:</strong> Museum, Eiffel Tower, Visiting Pre-Haussmannian architecture, Artist communities, Secret food tours, Palace of Versailles, Seine River with live music</p>
                    <p><strong>Total Budget:</strong> ₹50,000</p>
                    <p><strong>Additional Charges:</strong> Transportation</p>
                </div>
            `,
            'southkorea': `
                <div class="destination-card">
                    <h2>South Korea - 3 Days Trip</h2>
                    <p><strong>Destination:</strong> South Korea</p>
                    <p><strong>Dates:</strong> 3 days</p>
                    <p><strong>Activities:</strong> Gyeongbokgung Palace, Bukchon Hanok Village, N Seoul Tower, Korea’s number one attraction: the DMZ, Insadong, Gwangjang Market, National Museum of Korea, Han River</p>
                    <p><strong>Total Budget:</strong> ₹55,000</p>
                    <p><strong>Additional Charges:</strong> Transportation</p>
                </div>
            `,
            'london': `
                <div class="destination-card">
                    <h2>London - 3 Days Trip</h2>
                    <p><strong>Destination:</strong> London</p>
                    <p><strong>Dates:</strong> 3 days</p>
                    <p><strong>Activities:</strong> Notting Hill, Elizabeth Tower, Westminster Abbey, Royal Mews, Trafalgar Square, Leicester Square, Piccadilly Circus, Regent Street, Oxford Street, Palace Theatre, Mayfair Chippy</p>
                    <p><strong>Total Budget:</strong> ₹26,000</p>
                    <p><strong>Additional Charges:</strong> Transportation</p>
                </div>
            `
        };

        const featuredItineraries = document.getElementById(elementId);
        featuredItineraries.innerHTML = itineraries[searchValue] || alert(`No featured itinerary found for "${searchValue}"`);
    }

    // Create Itinerary button in Itinerary section
    const createItineraryBtn = document.getElementById('create-itinerary-btn');
    const createItineraryForm = document.getElementById('create-itinerary-form');
    createItineraryBtn.addEventListener('click', function() {
        createItineraryForm.style.display = 'block';
        document.getElementById('delete-itinerary-btn').style.display = 'none'; // Hide delete button initially
    });

    // Submit Itinerary button in Create Itinerary form
    const submitItineraryBtn = document.getElementById('submit-itinerary-btn');
    submitItineraryBtn.addEventListener('click', function() {
        const itinerary = fetchItineraryFormData();

        // Validate input values (add your validation logic here)

        displayNewItinerary(itinerary);
        updateBudgetTracker(itinerary);
        document.getElementById('create-itinerary-form').reset();
        createItineraryForm.style.display = 'none';
    });

    function fetchItineraryFormData() {
        return {
            name: document.getElementById('itinerary-name').value.trim(),
            destination: document.getElementById('itinerary-destination').value.trim(),
            dates: `${document.getElementById('itinerary-dates-from').value.trim()} - ${document.getElementById('itinerary-dates-to').value.trim()}`,
            activities: document.getElementById('itinerary-activities').value.trim().split('+').map(activity => activity.trim()),
            budget: document.getElementById('itinerary-budget').value.trim().split('+').map(amount => amount.trim())
        };
    }

    function displayNewItinerary(itinerary) {
        const currentDate = new Date();
        const itineraryDateFrom = new Date(itinerary.dates.split(' - ')[0]);
        const itineraryDateTo = new Date(itinerary.dates.split(' - ')[1]);

        if (currentDate < itineraryDateFrom) {
            addItineraryToList(itinerary, 'upcoming-itineraries-list', 'upcoming-itineraries-list-home');
        } else if (currentDate >= itineraryDateFrom && currentDate <= itineraryDateTo) {
            addItineraryToList(itinerary, 'ongoing-itineraries-list', 'upcoming-itineraries-list-home');
        } else {
            addItineraryToList(itinerary, 'past-itineraries-list');
        }
    }

    function addItineraryToList(itinerary, ...elementIds) {
        elementIds.forEach(elementId => {
            const listElement = document.getElementById(elementId);
            const listItem = document.createElement('li');
            listItem.textContent = `${itinerary.destination} - ${itinerary.dates}`;
            listElement.appendChild(listItem);
        });
    }

    // Function to update budget tracker
    function updateBudgetTracker(itinerary) {
        const expensesList = document.getElementById('expenses-list');
        const budgetSummary = document.getElementById('budget-summary');

        expensesList.innerHTML = '';
        budgetSummary.innerHTML = '';

        let totalExpenses = 0;
        itinerary.budget.forEach(amount => {
            const expenseItem = document.createElement('li');
            expenseItem.textContent = amount;
            expensesList.appendChild(expenseItem);
            totalExpenses += parseInt(amount);
        });

        const budgetSummaryItem = document.createElement('div');
        budgetSummaryItem.innerHTML = `<strong>Total Budget:</strong> ₹${totalExpenses}`;
        budgetSummary.appendChild(budgetSummaryItem);
    }

    // Delete Itinerary button in Create Itinerary form
    const deleteItineraryBtn = document.getElementById('delete-itinerary-btn');
    deleteItineraryBtn.addEventListener('click', function() {
        const itineraryToDelete = document.getElementById('itinerary-name').value.trim();
        alert(`Deleting itinerary: ${itineraryToDelete}`);
        // Implement delete functionality as per your requirement
    });

    // Search button in Destination section
    const searchDestinationBtn = document.getElementById('search-destination-btn');
    searchDestinationBtn.addEventListener('click', function() {
        const searchValue = document.getElementById('search-bar-destination').value.trim().toLowerCase();
        displayFeaturedItinerary(searchValue, 'destination-results');
    });

    // Profile section - Update contact information
    const updateContactBtn = document.getElementById('update-contact-btn');
    updateContactBtn.addEventListener('click', function() {
        const newName = document.getElementById('contact-name').value.trim();
        const newEmail = document.getElementById('contact-email').value.trim();
        const newPhone = document.getElementById('contact-phone').value.trim();

        // Validate input values (add your validation logic here)

        updateProfileInfo(newName, newEmail, newPhone);
    });

    function updateProfileInfo(name, email, phone) {
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-email').textContent = email;
        document.getElementById('profile-phone').textContent = phone;
        document.getElementById('nav-profile-name').textContent = name;
        document.getElementById('nav-profile-email').textContent = email;
    }

    // Delete Itinerary button in Itinerary section
    const deleteItineraryBtnItinerary = document.getElementById('delete-itinerary-btn-itinerary');
    deleteItineraryBtnItinerary.addEventListener('click', function() {
        const itineraryNameToDelete = document.getElementById('delete-itinerary-name').value.trim();
        removeItineraryFromAllLists(itineraryNameToDelete);
        alert(`Deleted itinerary: ${itineraryNameToDelete}`);
    });

    function removeItineraryFromAllLists(itineraryName) {
        ['upcoming-itineraries-list', 'ongoing-itineraries-list', 'past-itineraries-list', 'upcoming-itineraries-list-home'].forEach(listId => {
            removeItineraryFromList(itineraryName, listId);
        });
    }

    function removeItineraryFromList(itineraryName, listId) {
        const listElement = document.getElementById(listId);
        const items = listElement.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent.includes(itineraryName)) {
                items[i].remove();
                break;
            }
        }
    }
});
