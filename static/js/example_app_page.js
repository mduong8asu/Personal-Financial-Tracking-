document.addEventListener('DOMContentLoaded', function() {

    // Listen for the form submission
    document.getElementById('addUserForm').addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
    
        // Collect data from the form inputs
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var description = document.getElementById('description').value;
        // Get the checkbox value and convert it to a boolean
        var isAdmin = document.getElementById('isAdmin').checked;
    
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Description:', description);
        console.log('Is Admin:', isAdmin); // Log the admin status
    
        // Call the addUser function with the form data, including the admin status
        addUser(email, password, description, isAdmin).then(() => {
            // Clear the input fields after user is added
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('description').value = '';
            document.getElementById('isAdmin').checked = false; // Reset the checkbox
    
            // Hide the modal using Bootstrap's modal instance
            const addUserModalEl = document.getElementById('addUserModal');
            const modalInstance = bootstrap.Modal.getInstance(addUserModalEl); // Get existing modal instance
            modalInstance.hide();
        }).catch((error) => {
            console.error('Error adding user:', error);
            alert('Error adding user. Please try again.');
        });
    
        loadUsersIntoTable();
    });

    // Add a listener for the Edit User form submission
document.getElementById('editUserForm').addEventListener('submit', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Collect data from the form inputs
    const email = document.getElementById('editEmail').value;
    const description = document.getElementById('editDescription').value;
    const isAdmin = document.getElementById('editIsAdmin').checked;  // Grab the value of the isAdmin checkbox

    try {
        // Call the DataModel's editSelectedUser function to update the user
        await DataModel.editSelectedUser(email, description, isAdmin);  // Pass isAdmin as the third parameter

        // If the update was successful, clear the modal inputs
        document.getElementById('editEmail').value = '';
        document.getElementById('editDescription').value = '';
        document.getElementById('editIsAdmin').checked = false; // Reset the checkbox

        // Hide the modal
        const editUserModalEl = document.getElementById('editUserModal');
        const modalInstance = bootstrap.Modal.getInstance(editUserModalEl);
        modalInstance.hide();

        // Alert that the user was successfully edited
        alert('User successfully edited!');

        // Refresh the user list in the table
        loadUsersIntoTable();
    } catch (error) {
        console.error('Error editing user:', error);
        alert('Error editing user. Please try again.');
    }
});

document.getElementById('addChatroomForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('chatroomName').value;
    const description = document.getElementById('chatroomDescription').value;
    const costInput = document.getElementById('expenseCost').value;

    // Validate and parse the cost input
    const cost = parseFloat(costInput);
    if (isNaN(cost) || cost <= 0) {
        alert('Please enter a valid positive cost.');
        return;
    }

    try {
        await DataModel.addChatroom(name, description, cost.toFixed(2)); // Add chatroom
        alert('Expense successfully added!');

        // Clear the input fields
        document.getElementById('chatroomName').value = '';
        document.getElementById('chatroomDescription').value = '';
        document.getElementById('expenseCost').value = '';

        // Hide the modal and reload the table
        const addChatroomModalEl = document.getElementById('addChatroomModal');
        const modalInstance = bootstrap.Modal.getInstance(addChatroomModalEl);
        modalInstance.hide();

        loadChatroomsIntoTable(); // Reload table to reflect the new expense
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense. Please try again.');
    }
});
    
    loadChatroomsIntoTable();

    document.getElementById('editChatroomForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission
    
        // Get values from the form
        const name = document.getElementById('editChatroomName').value;
        const description = document.getElementById('editChatroomDescription').value;
        const costInput = document.getElementById('editChatroomCost').value;
    
        // Parse the cost input as a float
        const cost = parseFloat(costInput);
        if (isNaN(cost) || cost <= 0) {
            alert('Please enter a valid positive cost.');
            return;
        }
    
        try {
            // Ensure the cost is stored with two decimal places
            await DataModel.editSelectedChatroom(name, description, cost.toFixed(2));
    
            // Clear the input fields
            document.getElementById('editChatroomName').value = '';
            document.getElementById('editChatroomDescription').value = '';
            document.getElementById('editChatroomCost').value = '';
    
            // Hide the modal
            const editChatroomModalEl = document.getElementById('editChatroomModal');
            const modalInstance = bootstrap.Modal.getInstance(editChatroomModalEl);
            modalInstance.hide();
    
            // Reload the table and alert success
            alert('Expense successfully edited!');
            loadChatroomsIntoTable();
        } catch (error) {
            console.error('Error editing expense:', error);
            alert('Error editing expense. Please try again.');
        }
    });
    
    adminStatus = localStorage.getItem('admin');
    //alert('adminStatus: ' + adminStatus);
    DataModel.admin = adminStatus;
    if (adminStatus == 'true') {
        // Load users into the table after adding a new user
        loadUsersIntoTable();
    } else {
        // Disable the account management tab
        //alert('You are not an admin');
        document.getElementById('account-management-tab').classList.add('disabled');  // Add the 'disabled' class to the tab
        document.getElementById('account-management-tab').setAttribute('disabled', 'true');  // Set the disabled attribute
    }

    // Load chatrooms into the table
    loadChatroomsIntoTable();
    ChatSocket.setMessageCallback(handleMessage);
    ChatSocket.connect();
});

// NOTE: PLACE ALL OF YOUR FUNCTIONS BELOW

// Example function that sends a websocket message via the ChatSocket object
function sendChat(text) {
    // Checks to make sure string is not empty
    if (text.trim() === "") {
        console.error("Cannot send an empty message.");  // Log error if message is empty
        return;
    }

    ChatSocket.sendMessage(text);  // Send the message using ChatSocket
}

// Function to add a new user
async function addUser(email, password, description, isAdmin) {
    if (!email || !password || !description) {
        console.error("Email, password, and description are required.");
        return;
    }

    try {
        // Use DataModel's addUser function to add the user, including the isAdmin parameter
        const result = await DataModel.addUser(email, password, description, isAdmin);
        console.log('User created:', result);
        alert('User successfully added!');  // Show a success message

        await loadUsersIntoTable();  // Refresh user list in the table after addition

    } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user. Please try again.');
    }
}

// Function to delete a user by ID
async function deleteUser(userId) {
    if (!userId) {
        console.error("User ID is required for deletion.");
        return;
    }

    // Ask for user confirmation before proceeding with deletion
    const isConfirmed = confirm(`Are you sure you want to delete this user? This action cannot be undone.`);

    // If the user confirms the deletion, proceed
    if (!isConfirmed) {
        return;  // Exit the function if the user doesn't confirm
    }

    try {
        // Call DataModel's deleteUser function to delete the user by their ID
        DataModel.setSelectedUser(userId);
        await DataModel.deleteUser();
        console.log(`User with ID ${userId} deleted.`);
        alert('User successfully deleted!');  // Show a success message
        await loadUsersIntoTable();  // Refresh user list in the table after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
    }
}

// Function to load chatrooms into the table and dropdown
async function loadChatroomsIntoTable() {
    try {
        const chatrooms = await DataModel.getAllChatrooms(); // Fetch all chatrooms
        console.log('Chatrooms data:', chatrooms); // Debugging API response

        // Select the table body and clear existing content
        const tableBody = document.querySelector('#main tbody');
        tableBody.innerHTML = ''; // Clear the table to avoid duplicates

        let totalCost = 0; // Initialize total cost

        chatrooms.forEach(chatroom => {
            // Parse the cost as a float
            const cost = parseFloat(chatroom.cost);
            if (isNaN(cost)) {
                console.warn(`Invalid cost for chatroom: ${chatroom.name}`);
                return; // Skip invalid cost entries
            }

            totalCost += cost; // Add the cost to the total

            // Create a new table row
            const row = document.createElement('tr');

            // Name column
            const nameCell = document.createElement('td');
            nameCell.textContent = chatroom.name;
            row.appendChild(nameCell);

            // Description column
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = chatroom.description || 'No description';
            row.appendChild(descriptionCell);

            // Cost column
            const costCell = document.createElement('td');
            costCell.textContent = `$${cost.toFixed(2)}`;
            row.appendChild(costCell);

            // Actions column
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-primary btn-sm me-2';
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editButton.addEventListener('click', () => showEditChatroomModal(chatroom.id));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
            deleteButton.addEventListener('click', () => deleteChatroom(chatroom.id));
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell); // Append actions to the row
            tableBody.appendChild(row); // Append row to the table
        });

        // Update the total cost display
        document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;

    } catch (error) {
        console.error('Error loading chatrooms into table:', error);
        alert('Error loading expenses. Please try again.');
    }
}




function openAddUserModal() {
    var addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    addUserModal.show();
  }

// Function to show the edit modal with user details
// Function to show the edit modal with user details
function showEditModal(userId) {
    // Set the selected user in DataModel
    DataModel.setSelectedUser(userId);  

    // Get the selected user object from DataModel
    const user = DataModel.getCurrentUser();  

    // Check if the user exists
    if (user) {
        // Populate the email and description inputs in the modal with the user's data
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editDescription').value = user.description;

        // Set the checkbox value based on the user's admin status
        document.getElementById('editIsAdmin').checked = user.admin;  // Update: Set checkbox for admin status

        // Show the edit modal
        const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editUserModal.show();
    } else {
        console.error('User not found');
    }
}

// Function to open the Add Chatroom Modal
function openAddChatroomModal() {
    var addChatroomModal = new bootstrap.Modal(document.getElementById('addChatroomModal'));
    addChatroomModal.show();
}

// Function to show the Edit Chatroom Modal with chatroom details
function showEditChatroomModal(chatroomId) {
    // Set the selected chatroom in DataModel
    DataModel.setSelectedChatroom(chatroomId);  

    // Get the selected chatroom object from DataModel
    const chatroom = DataModel.getCurrentChatroom();  

    // Check if the chatroom exists
    if (chatroom) {
        // Populate the name and description inputs in the modal with the chatroom's data
        document.getElementById('editChatroomName').value = chatroom.name;
        document.getElementById('editChatroomDescription').value = chatroom.description;
        document.getElementById('editChatroomCost').value = chatroom.cost

        // Show the edit chatroom modal
        const editChatroomModal = new bootstrap.Modal(document.getElementById('editChatroomModal'));
        editChatroomModal.show();
    } else {
        console.error('Chatroom not found');
    }
}

// Function to delete a chatroom by ID
async function deleteChatroom(chatroomId) {
    if (!chatroomId) {
        console.error("Chatroom ID is required for deletion.");
        return;
    }

    // Ask for user confirmation before proceeding with deletion
    const isConfirmed = confirm(`Are you sure you want to delete this expense? This action cannot be undone.`);

    // If the user confirms the deletion, proceed
    if (!isConfirmed) {
        return;  // Exit the function if the user doesn't confirm
    }

    try {
        // Call DataModel's deleteChatroom function to delete the chatroom by its ID
        DataModel.setSelectedChatroom(chatroomId);
        await DataModel.deleteSelectedChatroom();
        console.log(`Expense with ID ${chatroomId} deleted.`);
        alert('Expense successfully deleted!');  // Show a success message
        await loadChatroomsIntoTable();  // Refresh chatroom list in the table after deletion
    } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
    }
}

// Function to send a quick chat message
function quickChatSend() {
    const message = document.getElementById('quick_chat_message').value.trim();
    const roomId = document.getElementById('quick_chat_room').value;

    // Check that both message and room are provided
    if (!message) {
        alert('Please enter a message before sending.');
        return;
    }
    if (roomId === "Select a room..." || !roomId) {
        alert('Please select a chat room before sending.');
        return;
    }

    // Send the message through ChatSocket
    ChatSocket.sendMessage(message, roomId);

    // Clear out the message input box
    document.getElementById('quick_chat_message').value = '';
}

function addGlowEffect(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        if (element.classList.contains('glow-effect')) {
            element.classList.remove('glow-effect');
            
            // Re-add the class after a brief delay to restart the animation
            setTimeout(() => {
                element.classList.add('glow-effect');
            }, 100); // 0.1 second delay
        } else {
            element.classList.add('glow-effect');
        }
    }
}

function handleMessage(message) {
    // Construct the element ID using the room_id from the message
    const elementId = `room-${message.room_id}`;
    
    // Check if the element exists in the DOM
    const element = document.getElementById(elementId);
    if (element) {
        // If it exists, apply the glow effect
        addGlowEffect(elementId);
    }
}

// Store chart instances globally to manage them
let barChartInstance = null;
let pieChartInstance = null;

async function createCharts() { 
    try {
        // Fetch data from the API
        const response = await fetch('/api/chatroom_costs');
        if (!response.ok) {
            throw new Error('Failed to fetch chatroom data');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Debugging API response

        // Group costs by category (description)
        const categoryCosts = {};
        data.forEach(chatroom => {
            const category = chatroom.description || 'No Category'; // Use description as the category
            const cost = parseFloat(chatroom.cost) || 0; // Parse the cost as a number
            if (categoryCosts[category]) {
                categoryCosts[category] += cost; // Add to existing category cost
            } else {
                categoryCosts[category] = cost; // Initialize the category cost
            }
        });

        // Extract aggregated category data
        const categories = Object.keys(categoryCosts); // Get category names
        const aggregatedCosts = Object.values(categoryCosts); // Get aggregated costs
        console.log('Aggregated Categories:', categories);
        console.log('Aggregated Costs:', aggregatedCosts);

        // Destroy existing bar chart if it exists
        if (barChartInstance) {
            barChartInstance.destroy();
        }

        // Create Bar Chart
        const barCtx = document.getElementById('myBarChart').getContext('2d');
        barChartInstance = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: data.map(chatroom => chatroom.name), // Chatroom names for the bar chart
                datasets: [{
                    label: '',
                    data: data.map(chatroom => chatroom.cost), // Chatroom costs for the bar chart
                    backgroundColor: 'rgba(75, 192, 192, 0.65)',
                    borderColor: Array(10).fill('black'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'null',  // Position the legend to the right
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Destroy existing polar area chart if it exists
        if (pieChartInstance) {
            pieChartInstance.destroy();
        }

        // Predefined distinct shades of blue
        const blueShades = [
            'rgba(255, 99, 132, 0.5)',  // Red
            'rgba(54, 162, 235, 0.5)',  // Blue
            'rgba(255, 159, 64, 0.5)',  // Orange
            'rgba(153, 102, 255, 0.5)', // Purple
            'rgba(255, 205, 86, 0.5)',  // Yellow
            'rgba(153, 51, 102, 0.5)',  // Pink
            'rgba(39, 174, 96, 0.5)',   // Emerald Green
            'rgba(75, 192, 192, 0.5)'   // Teal

        ];

        // Function to generate random colors from the predefined shades of blue
        const generateRandomBlueColor = () => {
            if (blueShades.length === 0) {
                // If no colors are left, you can either reset the list or return a default color
                console.warn('No more colors available');
                return 'rgba(0, 0, 0, 0.5)';  // Default color if the pool is exhausted
            }

    const randomIndex = Math.floor(Math.random() * blueShades.length);
    const selectedColor = blueShades[randomIndex];

    // Remove the selected color from the array
    blueShades.splice(randomIndex, 1);

    return selectedColor;
};

        // Create Doughnut Chart
        const pieCtx = document.getElementById('myPieChart').getContext('2d');
        pieChartInstance = new Chart(pieCtx, {
            type: 'doughnut',  // Explicitly set to 'doughnut'
            data: {
                labels: categories,  // Use aggregated categories as labels
                datasets: [{
                    label: 'Expenses by Category',
                    data: aggregatedCosts,  // Use aggregated costs as data
                    backgroundColor: Array.from({ length: 10 }, generateRandomBlueColor), // Randomly select 10 shades of blue
                    borderColor: Array(10).fill('black'),
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',  // Position the legend to the right
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                // Format tooltip to show value with a dollar sign and two decimal places
                                return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
    });

} catch (error) {
    console.error('Error creating charts:', error);
}
}

// Function to refresh charts
function refreshCharts() {
    createCharts(); // Call the existing function to recreate the charts
}

// Ensure the refresh button is linked
document.getElementById('refreshChartsButton').addEventListener('click', refreshCharts);

// Load the charts when the page loads
window.onload = createCharts;