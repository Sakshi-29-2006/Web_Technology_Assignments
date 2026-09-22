let plants = [];

const plantForm = document.getElementById("plantForm");
const plantList = document.getElementById("plantList");
const noPlants = document.getElementById("noPlants");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");


/* ADD PLANT */

plantForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("plantName").value.trim();
    const type = document.getElementById("plantType").value;
    const lastWatered = document.getElementById("lastWatered").value;
    const wateringInterval =
        document.getElementById("wateringInterval").value;
    const location =
        document.getElementById("plantLocation").value.trim();

    /* Validate form */

    const isValid = validateForm(
        name,
        type,
        lastWatered,
        wateringInterval,
        location
    );

    if (!isValid) {
        return;
    }


    /* Create plant object */

    const plant = {
        id: Date.now(),
        name: name,
        type: type,
        lastWatered: lastWatered,
        wateringInterval: Number(wateringInterval),
        location: location
    };


    /* Add object to array */
    plants.push(plant);

    /* Display plants */
    displayPlants();

    /* Clear form */
    plantForm.reset();

    /* Show success message */
    alert("Plant added successfully!");

    /* Scroll to plants */
    document.getElementById("my-plants").scrollIntoView({
        behavior: "smooth"
    });

});


/* VALIDATE FORM */

function validateForm(
    name,
    type,
    lastWatered,
    wateringInterval,
    location
) {

    let isValid = true;

    document.getElementById("plantNameError").textContent = "";
    document.getElementById("plantTypeError").textContent = "";
    document.getElementById("dateError").textContent = "";
    document.getElementById("intervalError").textContent = "";
    document.getElementById("locationError").textContent = "";


    /* Validate plant name */

    if (name === "") {

        document.getElementById("plantNameError").textContent =
            "Plant name is required.";

        isValid = false;
    }

    else if (name.length < 3) {

        document.getElementById("plantNameError").textContent =
            "Plant name must contain at least 3 characters.";

        isValid = false;
    }

    else if (!/^[A-Za-z]/.test(name)) {

    document.getElementById("plantNameError").textContent =
        "Plant name must begin with a letter.";

    isValid = false;
    }


    /* Validate plant type */

    if (type === "") {
        document.getElementById("plantTypeError").textContent =
            "Please select a plant type.";
        isValid = false;
    }


    /* Validate date */

    if (lastWatered === "") {

        document.getElementById("dateError").textContent =
            "Please select the last watered date.";
        isValid = false;
    }

    /* Validate watering interval */

    if (wateringInterval === "") {
        document.getElementById("intervalError").textContent =
            "Watering interval is required.";
        isValid = false;
    }

    else if (Number(wateringInterval) <= 0) {
        document.getElementById("intervalError").textContent =
            "Watering interval must be greater than 0.";
        isValid = false;
    }


    /* Validate location */
    if (location === "") {
        document.getElementById("locationError").textContent =
            "Plant location is required.";
        isValid = false;
    }

    else if (!/^[A-Za-z]/.test(location)) {
        document.getElementById("locationError").textContent =
            "Plant location must begin with a letter.";
        isValid = false;
    }
    return isValid;
}


/* DISPLAY PLANTS */

function displayPlants() {

    plantList.innerHTML = "";

    /* Get search value */
    const searchText = searchInput.value.toLowerCase();

    /* Get selected filter */
    const selectedType = filterType.value;

    /* Filter plants */
    const filteredPlants = plants.filter(function (plant) {
        const matchesSearch =
            plant.name.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "All" ||
            plant.type === selectedType;
        return matchesSearch && matchesType;
    });

    if (filteredPlants.length === 0) {
        noPlants.style.display = "block";
        return;
    }

    noPlants.style.display = "none";

    filteredPlants.forEach(function (plant) {
        const card = createPlantCard(plant);
        plantList.innerHTML += card;
    });

}


/* CREATE PLANT CARD */

function createPlantCard(plant) {

    const nextWatering = calculateNextWatering(
        plant.lastWatered,
        plant.wateringInterval
    );

    const status = getWateringStatus(nextWatering);

    let statusClass = "";

    if (status === "Watering OK") {
        statusClass = "status-ok";
    }

    else if (status === "Water Today") {
        statusClass = "status-due";
    }

    else {
        statusClass = "status-overdue";
    }

    return `
        <div class="plant-card">
            <div class="plant-icon">
                <i class="fa-solid fa-seedling"></i>
            </div>

            <h3>${plant.name}</h3>
            <p class="plant-type">
                ${plant.type}
            </p>

            <p class="plant-info">
                <i class="fa-solid fa-location-dot"></i>
                ${plant.location}
            </p>

            <p class="plant-info">
                <i class="fa-solid fa-droplet"></i>
                Last watered:
                ${formatDate(plant.lastWatered)}
            </p>

            <p class="plant-info">
                <i class="fa-solid fa-calendar-days"></i>
                Next watering:
                ${formatDate(nextWatering)}
            </p>


            <span class="status ${statusClass}">
                ${status}
            </span>

            <div class="card-buttons">

                <button
                    class="water-button"
                    onclick="waterPlant(${plant.id})">

                    <i class="fa-solid fa-droplet"></i>
                    Watered

                </button>

                <button
                    class="edit-button"
                    onclick="editPlant(${plant.id})">

                    <i class="fa-solid fa-pen"></i>
                    Edit

                </button>

                <button
                    class="delete-button"
                    onclick="deletePlant(${plant.id})">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `;
}


/* CALCULATE NEXT WATERING DATE */

function calculateNextWatering(lastWatered, interval) {
    const date = new Date(lastWatered);
    date.setDate(date.getDate() + interval);
    return date;
}


/* GET WATERING STATUS */

function getWateringStatus(nextWatering) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextWatering.setHours(0, 0, 0, 0);

    if (nextWatering.getTime() === today.getTime()) {
        return "Water Today";
    }

    if (nextWatering < today) {
        return "Watering Overdue";
    }

    return "Watering OK";
}


/* FORMAT DATE */

function formatDate(dateValue) {

    const date = new Date(dateValue);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


/* WATER PLANT */

function waterPlant(id) {
    const plant = plants.find(function (plant) {
        return plant.id === id;
    });


    if (plant) {
        const today = new Date();
        plant.lastWatered =
            today.toISOString().split("T")[0];
        displayPlants();
        alert(plant.name + " has been marked as watered.");
    }

}


/* DELETE PLANT */

function deletePlant(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this plant?");

    if (!confirmDelete) {
        return;
    }

    plants = plants.filter(function (plant) {
        return plant.id !== id;
    });
    displayPlants();
}

/* EDIT PLANT */

function editPlant(id) {

    const plant = plants.find(function (plant) {
        return plant.id === id;
    });

    if (!plant) {
        return;
    }


    /* Put old values into form */

    document.getElementById("plantName").value =
        plant.name;

    document.getElementById("plantType").value =
        plant.type;

    document.getElementById("lastWatered").value =
        plant.lastWatered;

    document.getElementById("wateringInterval").value =
        plant.wateringInterval;

    document.getElementById("plantLocation").value =
        plant.location;


    /* Delete old record */

    plants = plants.filter(function (item) {
        return item.id !== id;
    });

    /* Scroll to form */
    document.getElementById("add-plant").scrollIntoView({
        behavior: "smooth"
    });

}


/* SEARCH */

searchInput.addEventListener("input", function () {

    displayPlants();

});


/* FILTER */
filterType.addEventListener("change", function () {
    displayPlants();
});

/* Clear errors when user enters valid data */
document.getElementById("plantName").addEventListener("input", function () {
    document.getElementById("plantNameError").textContent = "";
});

document.getElementById("plantType").addEventListener("change", function () {
    document.getElementById("plantTypeError").textContent = "";
});

document.getElementById("lastWatered").addEventListener("change", function () {
    document.getElementById("dateError").textContent = "";
});

document.getElementById("wateringInterval").addEventListener("input", function () {
    document.getElementById("intervalError").textContent = "";
});

document.getElementById("plantLocation").addEventListener("input", function () {
    const location = this.value.trim();

    if (location !== "" && /^[A-Za-z]/.test(location)) {
        document.getElementById("locationError").textContent = "";
    }
});

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

displayPlants();