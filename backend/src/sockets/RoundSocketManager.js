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
    chosenArtList = null;

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

        this.roomNamespace.to(this.roomCode).emit('roundLoading', { room: this.roomCode });

        this.isRoundStarted = true;
        difficulty = parseInt(difficulty);

        if (difficulty == null) {
            difficulty = 0;
        }
        if (artId == null) {
            artId = "";
        }
        // Select a list of artworks
        this.chosenArtList = await ArtApiService.selectArtworkForRound(difficulty, artId);
        // Choose the correct answer, shuffle the list and send it to the players
        const questionType = this.chooseQuestionType();
        this.roomNamespace.to(this.roomCode).emit('roundStarted', { artInfo: this.chosenArtList, room: this.roomCode, questionType: questionType });

        // Choose the first art as the correct answer
        this.currentCorrectAnswerId = this.chosenArtList[0].id;
        this.playersResponses = {};
    }

    async handlePlayerResponse(user, answerId) {
        // Register the player's response
        const username = user.username;
        this.playersResponses[user.userId] = {
            username,
            answerId,
            index: this.roundAnswerIndex++
        };
        // Check if all players have answered
        if ((await this.areAllAnswersReceived())) {
            // Evaluate the answers and send the results
            this.evaluateAndSendResults();
        }
    }

    async areAllAnswersReceived() {
        // Retrieve the number of players in the room
        const currentPlayerCount = await this.getCurrentPlayerCount();

        // Check if the number of responses is equal to the number of players
        return Object.keys(this.playersResponses).length === currentPlayerCount;
    }

    async getCurrentPlayerCount() {
        if(await this.roomRepository.doesRoomExist(this.roomCode) === false){
            return 0;
        }

        // Retrieve the room
        const room = await this.roomRepository.getRoomByCode(this.roomCode);
        return room.currentPlayerNumber;
    }

    async handlePlayerLeave(user) {
        if (!this.isRoundStarted) {
            return;
        }

        // Delete the player's response
        if (this.playersResponses[user.userId]) {
            delete this.playersResponses[user.userId];
        }

        // Reevaluate if all players have answered
        try {
            if (await this.areAllAnswersReceived()) {
                this.evaluateAndSendResults();
            }
        } catch (e) {
            console.error(e);
        }
    }


    async evaluateAndSendResults() {
        const roundResults = {};
        const userIds = Object.keys(this.playersResponses);

        //sort userIds by response index
        userIds.sort((a, b) => {    
            return this.playersResponses[a].index - this.playersResponses[b].index;
        });

        // Check if the answers are correct and compute the score
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
        let answerData = {};
        try {
            if (this.chosenArtList && this.chosenArtList.length > 0) {
                answerData = {
                    artist: this.chosenArtList[0].artistName,
                    title: this.chosenArtList[0].title,
                    year: this.chosenArtList[0].completitionYear,
                }
            }
        } catch (e) {
            answerData = {}
        }
        // Send results to players
        this.roundAnswerIndex = 1;
        this.roundCorrectAnswerIndex = 1;
        this.isRoundStarted = false;
        this.roomNamespace.to(this.roomCode).emit('roundEnded', { roundResults: roundResults, room: this.roomCode, answerData: answerData });
    }

    endGame() {
        //Clean itself and emit endGame event
        this.isRoundStarted = false;
        this.roomNamespace.to(this.roomCode).emit('gameEnded', { room: this.roomCode });
    }

    async computeScore(index) {
        const playerCount = await this.getCurrentPlayerCount();

        // Define the maximum and minimum score
        const maxScore = 100;
        const minScore = 10;

        // Ajust the decay factor according to the number of players
        const decayFactor = 0.5 * (playerCount / 10);

        // Compute the score
        const score = Math.max(minScore, maxScore * Math.exp(-decayFactor * (index - 1)));


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