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
}
export default ArtApiService;