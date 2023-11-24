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

    async startRound(difficulty, artId) {
        difficulty = parseInt(difficulty);

        if (difficulty == null) {
            difficulty = 0;
        }
        if (artId == null) {
            artId = "";
        }
        // Sélectionner une œuvre d'art et envoyer les détails aux joueurs de la room
        const chosenArtList = await this.selectArtworkForRound(difficulty, artId);
        this.roomNamespace.to(this.roomCode).emit('roundStarted', {artInfo: chosenArtList, room: this.roomCode });
    }

    async selectArtworkForRound(difficulty, artId) {
        let pageStart = 1;
        let pageEnd = 3;
        if(difficulty == 1){
            pageStart = 4;
            pageEnd = 6;
        }else if(difficulty >= 2){
            pageStart = 7;
            pageEnd = 9;
        }

        const artList = await ArtApiService.getArt(pageStart, pageEnd);

        // chose 4 random arts from the list
        const chosenArtList = [];
        for(let i = 0; i < 4; i++){
            const index = Math.floor(Math.random() * artList.data.length);
            const chosenArt = artList.data[index];
            console.log(chosenArt.title);
            chosenArtList.push(chosenArt);
        }

        return chosenArtList;
    }

}

export default RoundSocketManager;