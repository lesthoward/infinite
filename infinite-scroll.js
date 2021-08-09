// https://jsonplaceholder.typicode.com/posts?_limit=5&_page=1
const postWrapper = document.querySelector('.posts__wrapper');
const loader = document.querySelector('.loader')
const footerText = document.querySelector('.post__footertext');
const inputSearch = document.querySelector('.posts__search');
const loadmore = document.querySelector('.posts__loadmore');

let limit = 5
let page = 1
let fired = 0
function showLoading () {
    footerText.style.opacity = 0
    loader.classList.add('loader--active')
    setTimeout(function() {
        removeLoading()
    }, 1000);
}

function removeLoading () {
    loader.classList.remove('loader--active')
    footerText.style.opacity = 1
}

function printData (posts) {
    const fragment = document.createDocumentFragment()
    posts.forEach(function (post) {
        const postItem = document.createElement('div');
        postItem.classList.add('posts__item')
        postItem.innerHTML = `
             <h2 class="post__title">${post.title}</h2>
            <p class="posts__description">${post.body}</p>
            <span class="posts__numer">${post.id}</span>
        `
        fragment.appendChild(postItem);
        // postWrapper.appendChild(postItem);
    })
    postWrapper.appendChild(fragment)
    
}

const getData = async () => {
    // https://jsonplaceholder.typicode.com/posts?_limit=5&_page=1
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`)
    const data = await res.json()
    printData(data)
    page++
    fired = 0
    
}

document.addEventListener('DOMContentLoaded', () => {
    getData()
})

window.addEventListener('scroll', () => {
    const {scrollTop, clientHeight, scrollHeight ,} = document.documentElement
    // ClientHeigh: es el alto de la pantalla del navegador, lo que yo veo. Si tengo la consola abierta, voy a ver menos y debo hacer más scroll
    // scrollTop: La distancia desde el inicio del documento, si mi clientHeight es poco entonces debo hacer más scroll
    if (scrollTop + clientHeight > scrollHeight - 50) {
        // Con este variable calculo para que no se ejecuta la función de obtener data múltiples veces por el evento de scroll. De modo que le digo, si se cumple la condición suma el "fired", y si es menor a 1 o igual, ejecuta mis funciones y al momento que se obtienen los datos "getData()" resetear la variable fired a 0.
        fired++
        if (fired <= 1) {
            setTimeout(function() {
                showLoading()
            }, 500);
            setTimeout(function() {
                getData()
            }, 1500);
        }

        // Esta es otro método conocido como debounce. No es tan efectivo porque dentro de la condición anterior el usuario no debe mover el scroll sino no tira el evento hasta el termine o salga de la condición.
        // setTimeout(function() {
        //     showLoading ()
        // }, 500);
        // const runDebounce = debounce(() => {
        //     getData()
        //     removeLoading()
        // },1000)
        // runDebounce()
    }
})

let timeoutId
function debounce (fn, delay=1000) {
    return (...args) => {
        console.log(timeoutId);
        if(timeoutId) {
            clearTimeout (timeoutId)
        }
        timeoutId = setTimeout(function() {
            fn(...args)
        }, delay);
    }
}


function markContent () {
    
}

function searchInContent (e) {
    const singlePost = document.querySelectorAll('.posts__item');
    const searched = e.target.value
    singlePost.forEach(post => {
        const title = post.querySelector('.post__title').innerText.toLowerCase()
        const description = post.querySelector('.posts__description').innerText.toLowerCase()
        if (title.indexOf(searched) > -1 || description.indexOf(searched) > -1){
            post.style.display = 'block'

            // Resaltar el texto
            const pattern = new RegExp(`${searched}`, 'gi')
            const replacedText = title.replace(pattern, () => `<mark>${searched}</mark>`)
            post.querySelector('.post__title').innerHTML = replacedText
        } else {
            post.style.display = 'none'
        }
    })
    
    
    
    markContent(searched)
}

inputSearch.addEventListener('input', (e) => {
    searchInContent (e)
})

