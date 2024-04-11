const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let playerData = [];

// Endpoint to handle PATCH request for updating player data
app.patch('/playerData/:id', (req, res) => {
    const playerId = req.params.id;
    const updatedPlayer = req.body;

    const index = playerData.findIndex(player => player.id == playerId);
    if (index !== -1) {
        playerData[index] = { id: playerId, ...updatedPlayer };
        res.json(playerData[index]);
    } else {
        res.status(404).send('Player not found');
    }
});

// Other routes for handling POST, GET, DELETE requests...

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
