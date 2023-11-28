// RoundSocketManager.js
import ArtApiService from "../Services/ArtApiService.js";
import RoomRepository from "../Repository/RoomRepository.js";
import UserRepository from "../Repository/UserRepository.js";
import Logger from "../Logger/Logger.js";

class RoundSocketManager {

    roomNamespace = null;
    roomCode = null;
    currentCorrectAnswerId = {};
    playersResponses = {};
    roomRepository = null;
    userRepository = null;
    isRoundStarted = false;
    roundAnswerIndex = 1;
    roundCorrectAnswerIndex = 1;

    constructor(roomNamespace, roomCode) {
        this.roomNamespace = roomNamespace;
        this.roomCode = roomCode;
        this.roomRepository = new RoomRepository();
        this.userRepository = new UserRepository();
    }

    async startRound(difficulty, artId) {
        if (this.isRoundStarted) {
            Logger.warning("Round already started");
            return;
        }

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
        const questionType = this.chooseQuestionType();
        this.roomNamespace.to(this.roomCode).emit('roundStarted', { artInfo: chosenArtList, room: this.roomCode, questionType: questionType });

        // Choisir the first art as the correct answer
        this.currentCorrectAnswerId = chosenArtList[0].id;
        this.playersResponses = {};
    }

    async handlePlayerResponse(user, answerId) {
        // Enregistrer la réponse du joueur
        const username = user.username;
        this.playersResponses[user.userId] = {
            username,
            answerId,
            index: this.roundAnswerIndex++
        };
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

    async handlePlayerLeave(user) {
        if (!this.isRoundStarted) {
            return;
        }

        // Supprimer la réponse du joueur si nécessaire
        if (this.playersResponses[user.userId]) {
            delete this.playersResponses[user.userId];
        }

        // Vérifiez si vous devez réévaluer l'état du jeu
        if (await this.areAllAnswersReceived()) {
            this.evaluateAndSendResults();
        }
    }


    async evaluateAndSendResults() {
        const roundResults = {};
        // Récupérer la liste des joueurs dans la room
        // Envoyer les résultats aux joueurs
        const userIds = Object.keys(this.playersResponses);

        userIds.sort((a, b) => {
            return this.playersResponses[a].index - this.playersResponses[b].index;
        });

        for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            const username = this.playersResponses[userId].username;
            if (this.playersResponses[userId].answerId === this.currentCorrectAnswerId) {
                const score = await this.computeScore(this.roundCorrectAnswerIndex);
                roundResults[userId] = { username: username, response: true, score: score };
                this.userRepository.addScoreById(userId, score)
            } else {
                roundResults[userId] = { username: username, response: false, score: 0 };
            }
        }

        this.handleRoundEnd(roundResults);
    }

    handleRoundEnd(roundResults) {
        // Send results to players
        this.roundAnswerIndex = 1;
        this.roundCorrectAnswerIndex = 1;
        this.isRoundStarted = false;
        this.roomNamespace.to(this.roomCode).emit('roundEnded', { roundResults: roundResults, room: this.roomCode });
    }

    endGame() {
        //Clean itself and emit endGame event
        this.isRoundStarted = false;
        this.roomNamespace.to(this.roomCode).emit('gameEnded', { room: this.roomCode });
    }

    async computeScore(index) {
        const playerCount = await this.getCurrentPlayerCount();

        // Définir le score maximum et le score minimum
        const maxScore = 100;
        const minScore = 10;

        // Ajuster la décroissance du score en fonction du nombre de joueurs
        const decayFactor = 0.5 * (playerCount / 10);

        // Calculer un score qui diminue de manière exponentielle
        const score = Math.max(minScore, maxScore * Math.exp(-decayFactor * (index - 1)));

        console.log(index, decayFactor)

        this.roundCorrectAnswerIndex++;
        return Math.round(score);
    }

    // 0 = artist, 1 = title, 2 = year
    chooseQuestionType() {
        //random number between 0 and 2
        const random = Math.floor(Math.random() * 3);

        switch (random) {
            case 0:
                return "artist";
            case 1:
                return "title";
            case 2:
                return "year";
            default:
                return "artist";
        }
    }
}

export default RoundSocketManager;