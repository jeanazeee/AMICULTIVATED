// RoundSocketManager.js
import ArtApiService from "../Services/ArtApiService.js";

class RoundSocketManager {

    roomNamespace = null;
    roomCode = null;


    constructor(roomNamespace, roomCode) {
        this.roomNamespace = roomNamespace;
        this.roomCode = roomCode;
        // Autres initialisations spécifiques au round
    }

    startRound(difficulty, artId) {
        difficulty = parseInt(difficulty);

        if (difficulty == null) {
            difficulty = 0;
        }
        if (artId == null) {
            artId = "";
        }
        // Sélectionner une œuvre d'art et envoyer les détails aux joueurs de la room
        const art = this.selectArtworkForRound(difficulty, artId);
        roomNamespace.to(roomCode).emit('startGame', {artInfo: art, room: this.roomCode });
    }

    async selectArtworkForRound(difficulty, artId) {
        const art = await ArtApiService.getRandomArt(difficulty, artId);
        return art;
    }

    // Autres méthodes liées aux rounds
}

export default RoundSocketManager;