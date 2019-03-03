// create an empty variable "employees" in which the employees will be stored later on
let employees;

// event handler for performing the search
const searchHandler = function(e) {
    // trim any whitespace from the input value and assign it to the variable query
    const query = e.target.value.trim();
    // call the performSearch function and pass the query variable to it
    performSearch(query);
}

/*************************************************************************************************************************************/
/******************************************************* ON PAGE LOAD ****************************************************************/

// event listener to fetch data when the page is ready
window.addEventListener('DOMContentLoaded', function(){
    // use fetch to get users from the randomuser API
    fetch('https://randomuser.me/api/?results=12&nat=us')
        .then(function(response) {
            // check if the status is unequal to 200
            if (response.status !== 200) {
                // log a message with the response status
                console.log(`Request was not successful. Response status: ${response.status}`);
                return;
            }
            // parse the response
            response.json()
                .then(function(data) {
                    console.log(data);
                    // assign the array of random user objects to the employees variable
                    employees = data.results;
                    // call the displayEmployees function and pass in the array of employees
                    displayEmployees(employees);
                });
        })
    .catch(function(err) {
        console.log(`The following error occurred: ${err}`);
    });

    // assign markup for the searchbar to the variable search
    let search = `<form action="#" method="get">
                        <input type="search" id="search-input" class="search-input" placeholder="Search...">
                        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;
    // append the search markup to the element with the class "search-container"
    $(".search-container").append(search);
});

/*************************************************************************************************************************************/
/****************************************************** EVENT HANDLERS ***************************************************************/

// event handler to display the modal when an element with the class "card" is clicked
$(document).on("click", ".card", function() {
    // get the element within the clicked card with the class "card-name", get its value, and split it into an array
    const fullname = $(this).find(".card-name").text();
    // find the employee that matches the clicked cards first and lastname in the array of employees
    const employee = employees.find(employee => `${employee.name.first} ${employee.name.last}` === fullname);
    // check if employee is not undefined
    if (employee) {
        // call the displayModal function and pass the employee variable to it
        displayModal(employee);
    }
});

// event handler to close the modal when the element with the id "modal-close-btn" is clicked
$(document).on("click", "#modal-close-btn", function() {
    // remove the element with the class "modal-container"
    $(".modal-container").remove();
});

// event handler to search for employees when the input of the element with the id "search-input" changes
$(document).on("keyup propertychange input", "#search-input", searchHandler);

// event handler to search for employees when the element with the id "search-submit" is clicked
$(document).on("click", "#search-submit", searchHandler);

// event handler to navigate to another modal when the button with the id "modal-prev" is clicked
$(document).on("click", "#modal-prev", function(e) {
    // get the fullname of the currently displayed employee from the element with the class "modal-name" within the element with the class "modal-info-container"
    const fullname = $(".modal-info-container .modal-name").text();
    // call the findIndex method on the employees array to return the index of the element which's name.first and name.last properties match the fullname
    const currentIndex = employees.findIndex(employee => `${employee.name.first} ${employee.name.last}` === fullname);
    // create a variable prevIndex and assign the currentIndex minus 1 to it as it's the index of the employee that should be displayed next
    let prevIndex = currentIndex -1;
    // check if the index is lower than 0, if so set prevIndex to 11
    if (prevIndex < 0) { prevIndex = 11; }
    // call the displayModal function and pass in the employee in the employees array at the position of prevIndex
    displayModal(employees[prevIndex]);
});

// event handler to navigate to another modal when the button with the id "modal-next" is clicked
$(document).on("click", "#modal-next", function(e) {
    // get the fullname of the currently displayed employee from the element with the class "modal-name" within the element with the class "modal-info-container"
    const fullname = $(".modal-info-container .modal-name").text();
    // call the findIndex method on the employees array to return the index of the element which's name.first and name.last properties match the fullname
    const currentIndex = employees.findIndex(employee => `${employee.name.first} ${employee.name.last}` === fullname);
    // create a variable prevIndex and assign the currentIndex plus 1 to it as it's the index of the employee that should be displayed next
    let nextIndex = currentIndex +1;
    // check if the index is higher than 11, if so set nextIndex to 0
    if (nextIndex > 11) { nextIndex = 0; }
    // call the displayModal function and pass in the employee in the employees array at the position of nextIndex
    displayModal(employees[nextIndex]);
})

/*************************************************************************************************************************************/
/********************************************************* FUNCTIONS *****************************************************************/

// function to display employees
function displayEmployees(employees) {
    // remove all elements from the element with the id "gallery" to only show the employees of the passed in array
    $("#gallery").empty();
    // loop over the array of employees
    employees.forEach((employee, index) => {
        // assign a string literal for the html markup to a variable and use the data from the employee object to fill in the employee information
        const element = `<div class="card" id="${index}">
                            <div class="card-img-container">
                                <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                                <p class="card-text">${employee.email}</p>
                                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                            </div>
                        </div>`;
        // append the element to the element with the id "gallery"
        $("#gallery").append(element);
    });
}

// function to display the employee modal
function displayModal(employee) {
    // remove element with the class "modal-container" in case another modal was already displayed
    $(".modal-container").remove();
    // call the convertToCamelCase function and pass in the street value of the employee object
    const street = convertToCamelCase(employee.location.street);
    // call the convertToCamelCase function and pass in the city value of the employee object
    const city = convertToCamelCase(employee.location.city);
    // assign a string literal for the html markup to a variable and use the data from the employee object to fill in the employee information
    const element = `<div class="modal-container">
                        <div class="modal">
                            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                            <div class="modal-info-container">
                                <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
                                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                                <p class="modal-text">${employee.email}</p>
                                <p class="modal-text cap">${employee.location.city}</p>
                                <hr>
                                <p class="modal-text">${employee.cell}</p>
                                <p class="modal-text">${street}, ${city}, ${employee.location.postcode}</p>
                                <p class="modal-text">Birthday: ${formatBirthday(employee.dob.date)}</p>
                            </div>
                        </div>
                        // IMPORTANT: Below is only for exceeds tasks 
                        <div class="modal-btn-container">
                            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                            <button type="button" id="modal-next" class="modal-next btn">Next</button>
                        </div>
                    </div>`;
    // append the element to the body element with the id "gallery"
    $("body").append(element);
}

// function to format birthdate
function formatBirthday(dob) {
	// instantiate a new Date object based on the string that's been passed in, convert it to a formatted date string, and return it
    return new Date(dob).toLocaleDateString("en-US");
}

// function to convert strings to camelcase
function convertToCamelCase(string) {
    // split the string into an array of words
    const words = string.split(" ");
    // loop over the array of words
    for (i = 0; i < words.length; i++) {
        // split the word into an array of letters
        const letters = words[i].split("");
        // set the first letter in the array to the first letter that's been converted to uppercase
        letters[0] = letters[0].toUpperCase();
        // join the array of letters and assign it back to the words array
        words[i] = letters.join("");
    }
    // join the words array to a string and return it
    return words.join(" ");
}

// function to search for employees in the employee array
function performSearch(input) {
    // remove the element with the id "no-search-results" in case it exists
    $("#no-search-results").remove();
	// call the filter method on the employees array and return the object where the name.first and name.last include the input value
    const matches = employees.filter(employee => `${employee.name.first} ${employee.name.last}`.includes(input));
    // call the displayEmployees function and pass the matches array to it
    displayEmployees(matches);
    // if there are no results, display a message informing the user that no result was found
    if (!matches.length) {
        $("body").append(`<h3 id="no-search-results">No matches found for your search.<h3>`)
    }
}