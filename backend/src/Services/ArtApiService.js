import fetch from "node-fetch";
import Logger from "../Logger/Logger.js";


class ArtApiService {
    static url = "http://www.wikiart.org/en/api/2/MostViewedPaintings";

    static async getArt(pageNumber1, pageNumber2) {
        let artData;
        let currentPaginationToken = '';

        for (let page = 1; page <= pageNumber2; page++) {
            try {
                const urlWithToken = ArtApiService.url + '?paginationToken=' + currentPaginationToken;
                const response = await fetch(urlWithToken);
                
                if (response.ok) {
                    const jsonData = await response.json();
                    currentPaginationToken = jsonData.paginationToken;
                    if(page>=pageNumber1 && page<=pageNumber2){
                        if (!artData) {
                            artData = jsonData; // Assign initial data
                        } else {
                            // Check if artData has 'items' property before using concat
                            if (artData.data && Array.isArray(artData.data) && jsonData.data && Array.isArray(jsonData.data)) {
                                artData.data = artData.data.concat(jsonData.data);
                            } else {
                                console.error('Invalid items structure in response data.');
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
}

export default ArtApiService;