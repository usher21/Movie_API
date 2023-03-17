const input = document.querySelector('input[type="text"]')
const emptyResult = document.querySelector('.empty-result')
const moviesContainer = document.querySelector('.movies-container')
let page = 98
const searchAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page='

let data = []
let movieArray = []
let searchMovies = []

showResults(API_URL + page)

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries)
        if (entry.isIntersecting)
            showResults(API_URL + (++page))
})

input.addEventListener('input', () => {
    moviesContainer.innerHTML = ''
    
    observer.unobserve(document.querySelector('.observe'))

    let search = input.value
    if (search == '') {
        page = 77
        movieArray = []
        showResults(API_URL + page)
        observer.observe(document.querySelector('.observe'))
        return
    }

    searchMovies = []
    
    fetchMovies(searchAPI + search)
        .then(movie => {
            return showSearchMovies(movie.results)
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
        .then(movie => showData(movie.results))
        .then(() => observer.observe(document.querySelector('.observe')))
        .catch(error => console.log(error.message))
}

function hasChild() {
    return moviesContainer.children.length != 0
}

function showData(movies) {
    for (const movie of movies) {
        const imgUrl = 'https://image.tmdb.org/t/p/w220_and_h330_face/'

        const oneMovie = createMovieComponent('', '', '', '')
        moviesContainer.append(oneMovie)
        
        const movieInfos = {}
        movieInfos.original_title = movie.original_title
        movieInfos.vote_average  = movie.vote_average
        movieInfos.overview = movie.overview

        if (movie.poster_path != null)
            movieInfos.img = imgUrl + movie.poster_path
        else
            movieInfos.img = 'notfound.jpg'
        movieArray.push(movieInfos)
    }
    setTimeout(() => {
        removeAnimation()
        let i = 0
        for (const movie of movieArray) {
            fillMovieInfos(movie.original_title , movie.vote_average, movie.overview, movie.img, i++)
        }
    }, 2000);
}

/*-----------------------------------------------------------------------------------------------------------------*/

function showSearchMovies(movies) {
    for (const movie of movies) {
        
        const imgUrl = 'https://image.tmdb.org/t/p/w220_and_h330_face/'

        const oneMovie = createMovieComponent('', '', '', '')
        moviesContainer.append(oneMovie)
        
        const movieInfos = {}
        movieInfos.original_title = movie.original_title
        movieInfos.vote_average  = movie.vote_average
        movieInfos.overview = movie.overview

        if (movie.poster_path != null)
            movieInfos.img = imgUrl + movie.poster_path
        else
            movieInfos.img = 'notfound.jpg'
        searchMovies.push(movieInfos)
    }
    setTimeout(() => {
        removeAnimation()
        let i = 0
        for (const movie of searchMovies) {
            fillMovieInfos(movie.original_title , movie.vote_average, movie.overview, movie.img, i++)
        }
    }, 2000);
}

/*-----------------------------------------------------------------------------------------------------------------*/

function removeAnimation() {
    const childs = moviesContainer.children
    for (const child of childs) {
        child.classList.remove('loading')
        const firstChild = child.firstElementChild
        const lastChild = child.lastElementChild
        firstChild.classList.remove('loading')
        lastChild.classList.remove('loading')
    }
}

/*-----------------------------------------------------------------------------------------------------------------*/

function fillMovieInfos(title, rating, contentOverview, poster_path, index) {
    const movies = moviesContainer.children
    const movie = movies[index]
    if (movie) {
        movie.style.backgroundImage = `url('${poster_path}')`
        const titleContainer = movie.firstElementChild
        const titleText = titleContainer.firstElementChild
        titleText.textContent = title
        titleText.style.backgroundColor = 'rgb(85, 15, 151)'
        const rate = titleContainer.lastElementChild
        rate.textContent = rating
        rate.style.backgroundColor = 'rgb(50, 2, 95)'

        const overviewContainer = movie.lastElementChild
        overviewContainer.style.backgroundColor = '#FFF'
        const overviewTitle = overviewContainer.firstElementChild
        overviewTitle.textContent = 'Overview'
        const overviewContent = overviewContainer.lastChild
        overviewContent.textContent = contentOverview
    }
}

/*-----------------------------------------------------------------------------------------------------------------*/

function createMovieComponent(title, rating, contentOverview, poster_path) {
    const movieContainer = createElement('div', { class: 'movie loading' })
    movieContainer.style.backgroundImage = `url('${poster_path}')`

    const titleMovie = createElement('div', { class: 'title-movie loading'})
    const titleContent = createElement('h3', { class: 'title'}, title)
    const rate = createElement('span', { class: 'rate'}, rating)
    titleMovie.append(titleContent)
    titleMovie.append(rate)

    const overviewContainer = createElement('div', { class: 'overview-container loading'})
    const overviewTitle = createElement('h3', { class: 'overview-title'}, 'Overview')
    const overviewContent = createElement('p', { class: 'overview-content'}, contentOverview)
    overviewContainer.append(overviewTitle)
    overviewContainer.append(overviewContent)

    movieContainer.append(titleMovie)
    movieContainer.append(overviewContainer)

    return movieContainer
}

/*-----------------------------------------------------------------------------------------------------------------*/

function createElement(tagName, attributs = {}, content = '') {
    const element = document.createElement(tagName)
    for (const attribut in attributs) {
        element.setAttribute(attribut, attributs[attribut])
    }
    element.textContent = content
    return element
}

/*-----------------------------------------------------------------------------------------------------------------*/