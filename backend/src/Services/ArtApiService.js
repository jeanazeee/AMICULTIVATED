class ArtApiService {


    static getAllArt() {
        return fetch('http://localhost:3000/art')
            .then(response => response.json())
    }
}