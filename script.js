const input = document.querySelector('input[type="text"]')
const emptyResult = document.querySelector('.empty-result')
const moviesContainer = document.querySelector('.movies-container')
const page = Math.floor(Math.random() * 235)
const searchAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${page}`

let data = []

showResults(API_URL)

input.addEventListener('input', () => {
    moviesContainer.innerHTML = ''
    let search = input.value
    if (search == '') {
        showResults(API_URL)
        return
    }

    fetchMovies(searchAPI + search)
        .then(movie => {
            return showData(movie.results)
        }).then(() => {
            if (!hasChild()) {
                emptyResult.style.display = 'block'
            } else {
                emptyResult.style.display = 'none'
            }
        })
        .catch(error => console.log(error.message))
})

async function fetchMovies(url) {
    const responsePromise = await fetch(url, {
        headers: {
            Accept: 'application/json'
        }
    })

    if (!responsePromise.ok)
        throw new Error('Impossible de charger les données -> Erreur serveur : ', { cause: responsePromise })

    return responsePromise.json()
}

function showResults(url) {
    const movies = fetchMovies(url)
    movies
        .then(movie => {
            showData(movie.results)
        })
        .catch(error => console.log(error.message))
}

function hasChild() {
    return moviesContainer.children.length != 0
}

function showData(movies) {
    for (const movie of movies) {
        const imgUrl = 'https://image.tmdb.org/t/p/w220_and_h330_face/'
        if (movie.poster_path != null) {
            const oneMovie = createMovieComponent(movie.original_title, movie.vote_average, movie.overview, imgUrl + movie.poster_path)
            moviesContainer.append(oneMovie)
        } else {
            const oneMovie = createMovieComponent(movie.original_title, movie.vote_average, movie.overview, 'notfound.jpg')
            moviesContainer.append(oneMovie)
        }
    }
}

function createMovieComponent(title, rating, contentOverview, poster_path) {
    const movieContainer = createElement('div', { class: 'movie' })
    movieContainer.style.backgroundImage = `url('${poster_path}')`

    const titleMovie = createElement('div', { class: 'title-movie'})
    const titleContent = createElement('h3', { class: 'title'}, title)
    const rate = createElement('span', { class: 'rate'}, rating)
    titleMovie.append(titleContent)
    titleMovie.append(rate)

    const overviewContainer = createElement('div', { class: 'overview-container'})
    const overviewTitle = createElement('h3', { class: 'overview-title'}, 'Overview')
    const overviewContent = createElement('p', { class: 'overview-content'}, contentOverview)
    overviewContainer.append(overviewTitle)
    overviewContainer.append(overviewContent)

    movieContainer.append(titleMovie)
    movieContainer.append(overviewContainer)

    return movieContainer
}

function createElement(tagName, attributs = {}, content = '') {
    const element = document.createElement(tagName)
    for (const attribut in attributs) {
        element.setAttribute(attribut, attributs[attribut])
    }
    element.textContent = content
    return element
}

