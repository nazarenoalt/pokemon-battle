const API_URL = 'https://pokeapi.co/api/v2/pokemon/:id'
//Invocamos elementos del DOM
const box = document.getElementById('box');
const spriteJ = document.getElementById('pokemon-J');
const spriteM = document.getElementById('pokemon-M');
const dialogJ = document.getElementById('span-dialogJ');
const dialogM = document.getElementById('span-dialogM');
const statsBox = document.getElementsByClassName('stats-box');
const nameJ = document.getElementById('name-J');
const nameM = document.getElementById('name-M');
const HPBarJ = document.getElementById('hp-bar__J');
const HPBarM = document.getElementById('hp-bar__M');
const currencyHP = document.getElementById('currency-hp');
const pokemonJList = document.getElementById('pokemonJ-list');
const pokemonMList = document.getElementById('pokemonM-list');
const HP = document.getElementById('hp');
let turno;
//atributos de personajes
let vidaJ, ataqueJ;
let vidaM, ataqueM;
let idJugador, idMaquina;
let listaPokemones = [];
//Event Listeners
let listButton = document.getElementById('list-button');
listButton.addEventListener('click', cargarEntorno)
quitarMensajePantalla()
function indexarPokemones(){
    for(let i = 1; i <= 155; i++) {
        fetchData(API_URL, i)
            .then(data => {

                    let option = document.createElement('option')
                    let pokemonName = document.createTextNode(data.name);
                    option.appendChild(pokemonName)
                    option.value = data.id;
                    pokemonJList.appendChild(option)

                    return data;
            })
            .then(data => {
    
                let option = document.createElement('option')
                let pokemonName = document.createTextNode(data.name);
                option.appendChild(pokemonName)
                pokemonMList.appendChild(option)

        })
    }
    
}
indexarPokemones();

//Promesa que trae los datos de la api
function fetchData(url, id) {
    return new Promise((resolve, reject) => {
        fetch(url.replace(':id', id))
            .then(response => response.json())
            .then(data => resolve(data))
    })
}

//Traemos y ubicamos los datos de la API usando la funcion fetchData()
function cargarEntorno() {

    idJugador = pokemonJList.value;
    idMaquina = pokemonMList.value;
    turno = 1;
    precargarElementos();
    quitarMensajePantalla()

    //se traen los datos de los pokemones seleccionados
    fetchData(API_URL, idJugador)
        .then(data => {
         
            //se cargan stats del personaje
            nameJ.innerHTML = data.name;
            vidaJ = data.stats[0].base_stat;
            ataqueJ = data.stats[1].base_stat;
            spriteJ.src = data.sprites.back_default;
            currencyHP.innerHTML = vidaJ;
            HP.innerHTML = vidaJ;
            HPBarJ.value = vidaJ;
            HPBarJ.max = vidaJ;
            return fetchData(API_URL, idMaquina)
        
        })
        .then(data => {
        
            nameM.innerHTML = data.name;
            vidaM = data.stats[0].base_stat;
            ataqueM = data.stats[1].base_stat;
            spriteM.src = data.sprites.front_default;
            HPBarM.value = vidaM;
            HPBarM.max = vidaM;
        
        })
        .then(() => setTimeout(dibujarElementos,200))
        .then(() => batalla())
        .catch(err => console.error(err))
    
}


//Acá realizo la animacion de los stats y los personajes al principio
function dibujarElementos() {

    spriteJ.classList.remove("hidden");
    spriteM.classList.remove("hidden");

    setTimeout(switchStats, 1000)
    setTimeout(switchStats, 1100)
    setTimeout(switchStats, 1200)
    setTimeout(switchStats, 1300)
    setTimeout(switchStats, 1400)

}
function switchStats() {

    if(statsBox[0].style.visibility === 'visible') {
        statsBox[0].style.visibility = 'hidden'
        statsBox[1].style.visibility = 'hidden'
    } else {
        statsBox[0].style.visibility = 'visible'
        statsBox[1].style.visibility = 'visible'
    }

}

//Procede a la batalla 
function batalla() {

    if(turno === 1) {
        spriteM.addEventListener('click', atacar)        
    } else {
        setTimeout(() => atacar(), 2000);
    }

}
function atacar() {
    
    let dialogoJugador;
    if(turno === 1) {
        dialogoJugador = dialogM;
        vidaM -= Math.floor(ataqueJ / (Math.ceil((Math.random()*3) + 1)));
        HPBarM.value = vidaM;
        if(vidaJ < 0) vidaM = 0;
        turno = 0;
    } else {
        dialogoJugador = dialogJ;
        vidaJ -= Math.floor(ataqueM / (Math.ceil((Math.random()*3) + 1)));
        HPBarJ.value = vidaJ;
        if(vidaJ < 0) vidaJ = 0;
        HP.innerHTML = vidaJ;
        turno = 1;
    }

    //sale un dialogo que dice "japish"
    dialogoJugador.innerHTML = '*japish*';
    dialogoJugador.style.marginTop = '0px';
    setTimeout(() => dialogoJugador.innerHTML = '', 500)

    //finaliza el turno
    if(vidaJ > 0 && vidaM > 0) {
        batalla()
    } else {
        if(vidaJ <=0) {
            juegoPerdido()
        } else {
            juegoGanado()
        }
    }
}

function precargarElementos() {
    spriteJ.classList.add("hidden");
    spriteM.classList.add("hidden");
    statsBox[0].style.visibility = 'hidden';
    statsBox[1].style.visibility = 'hidden';
}
function agregarMensajePantalla(msj) {
    const mensaje = document.createElement('p');
    mensaje.classList.add('mensaje-final');
    mensaje.setAttribute('id', 'mensaje-final');
    const texto = document.createTextNode(msj);
    mensaje.appendChild(texto);
    box.appendChild(mensaje);
}

function quitarMensajePantalla() {
    const mensaje = document.getElementById('mensaje-final');
    if(mensaje) {
        padre = mensaje.parentNode;
        console.log(padre);
        console.log(mensaje);
        padre.removeChild(mensaje);
    }
    
}


function juegoPerdido() {
    precargarElementos()
    agregarMensajePantalla('Has perdido!')
}

function juegoGanado() {
    precargarElementos()
    agregarMensajePantalla('Has ganado!')
}