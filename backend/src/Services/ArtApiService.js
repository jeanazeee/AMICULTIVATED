import axios from 'axios';

class ArtApiService {
    static url = "http://www.wikiart.org/en/api/2/MostViewedPaintings";

    static async getArt(pageStart, pageEnd) {
        let artData;
        let currentPaginationToken = '';

        for (let page = 1; page <= pageEnd; page++) {
            try {
                const urlWithToken = `${ArtApiService.url}?paginationToken=${currentPaginationToken}`;
                const response = await axios.get(urlWithToken);

                if (response.status === 200) {
                    const jsonData = response.data;
                    currentPaginationToken = jsonData.paginationToken;
                    if (page >= pageStart && page <= pageEnd) {
                        if (!artData) {
                            artData = jsonData; // Assign initial data
                        } else {
                            // Check if artData has 'data' property before using concat
                            if (artData.data && Array.isArray(artData.data) && jsonData.data && Array.isArray(jsonData.data)) {
                                artData.data = artData.data.concat(jsonData.data);
                            } else {
                                console.error('Invalid data structure in response data.');
                            }
                        }
                    }
                } else {
                    console.error('Request failed with status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching art:', error);
            }
        }
        return artData;
    }

    static async getRandomArt(difficulty, artId) {
        let arts = [];
        switch (difficulty) {
            case 0:
                arts = (await ArtApiService.getArt(1, 3)).data;
                break;
            case 1:
                arts = (await ArtApiService.getArt(4, 6)).data;
                break;
            case 2:
                arts = (await ArtApiService.getArt(7, 9)).data;
                break;
            default:
                arts = (await ArtApiService.getArt(1, 3)).data;
        }
        const index = Math.floor(Math.random() * arts.length);
        let chosenArt =  arts[index];

        return chosenArt;

    }

    static async selectArtworkForRound(difficulty, artId) {
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
        while (chosenArtList.length < 4) {
            const index = Math.floor(Math.random() * artList.data.length);
            const chosenArt = artList.data[index];
    
            // Check if the chosen art is unique in terms of title, artistName, and completionYear
            const isUnique = !chosenArtList.some(art => 
                art.title === chosenArt.title ||
                art.artistName === chosenArt.artistName ||
                art.completionYear === chosenArt.completitionYear
            );
            

            if (isUnique) {
                chosenArtList.push(chosenArt);
            }
        }

        return chosenArtList;
    }
}

export default ArtApiService;