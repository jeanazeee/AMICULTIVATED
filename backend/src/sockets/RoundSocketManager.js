// RoundSocketManager.js
import ArtApiService from "../Services/ArtApiService.js";
import RoomRepository from "../Repository/RoomRepository.js";

class RoundSocketManager {

    roomNamespace = null;
    roomCode = null;
    currentCorrectAnswerId = {};
    playersResponses = {};
    roomRepository = null;
    isRoundStarted = false;

    constructor(roomNamespace, roomCode) {
        this.roomNamespace = roomNamespace;
        this.roomCode = roomCode;
        this.roomRepository = new RoomRepository();
    }

    async startRound(difficulty, artId) {
        this.isRoundStarted = true;
        difficulty = parseInt(difficulty);

        if (difficulty == null) {
            difficulty = 0;
        }
        if (artId == null) {
            artId = "";
        }
        // Sélectionner une œuvre d'art et envoyer les détails aux joueurs de la room
        const chosenArtList = await ArtApiService.selectArtworkForRound(difficulty, artId);
        //TODO 
        // Choose the correct answer, shuffle the list and send it to the players
        this.roomNamespace.to(this.roomCode).emit('roundStarted', {artInfo: chosenArtList, room: this.roomCode });

        // Choisir the first art as the correct answer
        this.currentCorrectAnswer = chosenArtList[0];
        this.playersResponses = {};
        console.log("Round started ", this.currentCorrectAnswer);
    }

    async handlePlayerResponse(playerId, answer) {
        // Enregistrer la réponse du joueur
        this.playersResponses[playerId] = answer;
        console.log("Player response ", this.playersResponses);
        // Vérifier si toutes les réponses sont reçues
        if ((await this.areAllAnswersReceived())) {
            // Évaluer les réponses et envoyer les résultats
            this.evaluateAndSendResults();
        }
    }

    async areAllAnswersReceived() {
        // Récupérer le nombre actuel de joueurs dans la room
        const currentPlayerCount = await this.getCurrentPlayerCount();

        // Vérifier si le nombre de réponses reçues correspond au nombre de joueurs
        return Object.keys(this.playersResponses).length === currentPlayerCount;
    }

    async getCurrentPlayerCount() {
        // Récupérer la liste des joueurs dans la room
        const room = await this.roomRepository.getRoomByCode(this.roomCode);

        // Récupérer le nombre de joueurs dans la room
        return room.currentPlayerNumber;
    }

    handlePlayerLeave(user) {
        if (!this.isRoundStarted) {
            return;
        }

        // Supprimer la réponse du joueur si nécessaire
        if (this.playersResponses[user.userId]) {
            delete this.playersResponses[user.userId];
        }

        // Vérifiez si vous devez réévaluer l'état du jeu
        if (this.areAllAnswersReceived()) {
            this.evaluateAndSendResults();
        }
    }


    evaluateAndSendResults() {
        // Récupérer la liste des joueurs dans la room
        console.log("Evaluating results");
        // Envoyer les résultats aux joueurs
        

        this.handleRoundEnd();
    }

    handleRoundEnd() {
        // Envoyer les résultats aux joueurs
        console.log("Round ended");
        this.isRoundStarted = false;
    }
}

export default RoundSocketManager;