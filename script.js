const input = document.querySelector('input[type="text"]')
const emptyResult = document.querySelector('.empty-result')

let data = []

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

const moviesContainer = document.querySelector('.movies-container')

//https://api.themoviedb.org/3/movie/top_rated?api_key=<<api_key>>&language=en-US&page=1
// console.log(fetchMovies(`https://api.themoviedb.org/3/movie/${index}?api_key=b842d7431a7c0531e859f21c70f3f16e`))

let movies = null

for (let i = 1; i <= 20; i++) {
    movies = fetchMovies(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=${i}`)
        .then(movie => {
            let results = movie.results
            for (const key in results) {
                data.push(results[key])
            }
            return data
        })
        .catch(error => console.log(error.message))
}

movies.then(movies => showData(movies))

input.addEventListener('input', () => {
    moviesContainer.innerHTML = ''
    let search = input.value
    if (search == '') {
        showData(data)
    }

    let filteredData = filterData(search)

    showData(filteredData)

    if (!hasChild()) {
        emptyResult.style.display = 'block'
    } else {
        emptyResult.style.display = 'none'
    }
})

function hasChild() {
    return moviesContainer.children.length != 0
}

function filterData(search) {
    let filters = []
    for (const el of data) {
        if (el.original_title.toLowerCase().includes(search.toLowerCase())) {
            filters.push(el)
        }
    }
    return filters
}

function showData(movies) {
    for (const movie of movies) {
        const imgUrl = 'https://image.tmdb.org/t/p/w220_and_h330_face/'
        const oneMovie = createMovieComponent(movie.original_title, movie.vote_average, movie.overview, imgUrl + movie.poster_path)
        moviesContainer.append(oneMovie)
    }
}

function createMovieComponent(title, rating, contentOverview, backdrop_path) {
    const movieContainer = createElement('div', { class: 'movie' })
    movieContainer.style.backgroundImage = `url('${backdrop_path}')`

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

