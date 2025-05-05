let elementsData = {}; // Initialize an empty object to store element data
let allElementsList = []; // Store all elements for filtering

// Create a custom dropdown for suggestions
document.addEventListener('DOMContentLoaded', () => {
    fetchAllElements();
    createCustomDropdown();
});

function createCustomDropdown() {
    const input = document.getElementById('elementInput');
    const dropdown = document.createElement('div');
    dropdown.id = 'customDropdown';
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '1000';
    dropdown.style.width = input.offsetWidth + 'px';
    dropdown.style.display = 'none';
    input.parentNode.appendChild(dropdown);

    input.addEventListener('input', function() {
        showSuggestions(this.value);
    });

    input.addEventListener('focus', function() {
        showSuggestions(this.value);
    });

    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && e.target !== input) {
            dropdown.style.display = 'none';
        }
    });
}

function showSuggestions(query) {
    const input = document.getElementById('elementInput');
    const dropdown = document.getElementById('customDropdown');
    dropdown.innerHTML = '';
    if (!query) {
        dropdown.style.display = 'none';
        return;
    }
    const matches = allElementsList.filter(el =>
        el.name.toLowerCase().startsWith(query.toLowerCase()) ||
        el.symbol.toLowerCase().startsWith(query.toLowerCase())
    );
    if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    matches.forEach(el => {
        const option = document.createElement('div');
        option.className = 'autocomplete-option';
        option.textContent = `${el.name} (${el.symbol})`;
        option.style.cursor = 'pointer';
        option.onclick = function() {
            input.value = el.name;
            dropdown.style.display = 'none';
        };
        dropdown.appendChild(option);
    });
    dropdown.style.display = 'block';
}

// Fetch all elements from the local JSON file and populate the datalist
async function fetchAllElements() {
    try {
        console.log("Fetching elements.json..."); // Debugging log
        const response = await fetch('elements.json'); // Fetch the local JSON file
        if (!response.ok) {
            throw new Error("Failed to fetch elements from local JSON");
        }

        const elements = await response.json();
        console.log("Elements fetched successfully:", elements); // Debugging log

        elementsData = {}; // Clear existing data
        allElementsList = elements; // Store for filtering

        elements.forEach(element => {
            // Add element to elementsData
            elementsData[element.name.toLowerCase()] = {
                name: element.name,
                symbol: element.symbol,
                atomicNumber: element.atomicNumber,
                atomicWeight: element.atomicMass,
                group: element.groupBlock,
                period: element.period,
                state: element.standardState || "Unknown",
                density: element.density ? `${element.density} g/cm³` : "Unknown",
                meltingPoint: element.meltingPoint ? `${element.meltingPoint}°C` : "Unknown",
                electronConfig: element.electronicConfiguration,
                description: element.summary || "No description available."
            };
        });

        console.log("Elements data loaded successfully:", elementsData); // Debugging log
    } catch (error) {
        console.error("Error fetching elements:", error);
    }
}

async function searchElement() {
    const input = document.getElementById('elementInput').value.toLowerCase();
    const elementInfo = document.getElementById('elementInfo');
    const errorMessage = document.getElementById('errorMessage');

    try {
        if (!elementsData[input]) {
            throw new Error("Element not found");
        }

        const element = elementsData[input];

        // Update UI elements
        document.getElementById('elementName').textContent = element.name;
        document.getElementById('elementSymbol').textContent = element.symbol;
        document.getElementById('elementAtomicNumber').textContent = `#${element.atomicNumber}`;
        document.getElementById('elementAtomicWeight').textContent = element.atomicWeight;
        document.getElementById('elementGroup').textContent = element.group;
        document.getElementById('elementPeriod').textContent = element.period;
        document.getElementById('electronConfig').textContent = element.electronConfig;
        document.getElementById('elementState').textContent = element.state;
        document.getElementById('elementDensity').textContent = element.density;
        document.getElementById('meltingPoint').textContent = element.meltingPoint;

        elementInfo.style.display = 'block';
        errorMessage.style.display = 'none';
    } catch (error) {
        errorMessage.textContent = "Element not found! Please try again.";
        errorMessage.style.display = 'block';
        elementInfo.style.display = 'none';
        console.error("Error searching element:", error); // Debugging log
    }
}

// Add enter key functionality
document.getElementById('elementInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('customDropdown').style.display = 'none';
        searchElement();
    }
});