function renderPlayer(player) {
    // Build the player card
    let card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = 
    `<img src="${player.imageURL}"/>
        <div class="content">
            <h2>${player.name}</h2>
            <h3>${player.value}</h3>
            <h3>${player.position}</h3>
            <p>${player.description}</p>
        </div>
        <div class="buttons">
            <button id="update-${player.id}">Update</button>
            <button id="delete-${player.id}">Delete</button>
        </div>
    `
    document.querySelector('#player-list').appendChild(card); // Append card to list
    
    // Add event listener for delete button
    card.querySelector(`#delete-${player.id}`).addEventListener('click', () => {
        card.remove();
        deletePlayer(player.id);
    });

    // Add event listener for update button
    card.querySelector(`#update-${player.id}`).addEventListener('click', () => {
        // Populate form with existing player details
        document.querySelector('#player-form').name.value = player.name;
        document.querySelector('#player-form').image_url.value = player.imageURL;
        document.querySelector('#player-form').position.value = player.position;
        document.querySelector('#player-form').value.value = player.value;
        document.querySelector('#player-form').description.value = player.description;

        // Change form submit event listener to handle update
        document.querySelector('#player-form').removeEventListener('submit', handleSubmit);
        document.querySelector('#player-form').addEventListener('submit', () => handleUpdate(event, player.id));
    });
}

function getAllPlayers() {
    fetch(`http://localhost:3000/playerData`)
        .then(res => res.json())
        .then(playerData => playerData.forEach(player => renderPlayer(player)))
        .catch(error => console.error('Error fetching players:', error));
}

document.querySelector('#player-form').addEventListener('submit', handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    let playerObj = {
        name: e.target.name.value,
        imageURL: e.target.image_url.value,
        position: e.target.position.value,
        value: e.target.value.value,
        description: e.target.description.value
    };
    sellPlayer(playerObj);
}

function sellPlayer(playerObj) {
    fetch(`http://localhost:3000/playerData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerObj)
    })
        .then(res => res.json())
        .then(player => {
            renderPlayer(player); // Render the newly added player
            alert("Player added successfully!");
        })
        .catch(error => console.error('Error selling player:', error));
}

function deletePlayer(id) {
    fetch(`http://localhost:3000/playerData/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(player => {
            console.log('Player deleted:', player);
            alert("Player deleted successfully!");
        })
        .catch(error => console.error('Error deleting player:', error));
}

function handleUpdate(event, playerId) {
    event.preventDefault();
    let updatedPlayer = {
        name: event.target.name.value,
        imageURL: event.target.image_url.value,
        position: event.target.position.value,
        value: event.target.value.value,
        description: event.target.description.value
    };

    // Send a PATCH request to update the player data
    fetch(`http://localhost:3000/playerData/${playerId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPlayer)
    })
        .then(res => res.json())
        .then(updatedPlayer => {
            // Optionally, update the player card with the new data
            console.log('Player updated:', updatedPlayer);
            alert("Player updated successfully!");
        })
        .catch(error => console.error('Error updating player:', error));
}

function initialize() {
    getAllPlayers();
}

// Call getAllPlayers to render existing players when the page loads
initialize();
