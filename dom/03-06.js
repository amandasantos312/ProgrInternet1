function getById(id) {
    return document.getElementById(id)
}

getById('botaoExtrair').addEventListener('click', () => {
    let links = document.getElementsByTagName('a');

    let hrefs = "";
    for (let i = 0; i < links.length; i++) {
        hrefs += "<p>" + links[i].href + " - " + links[i].id + "</p>";
    }
    getById('resultado').innerHTML = hrefs;
});


getById('botaoMostrar').addEventListener('click', ()=> {
    let nomeClasse = getById('nomeClasse').value;

    let elementos = document.getElementsByClassName(nomeClasse);

    let texto = "";
    for (let i = 0; i < elementos.length; i++) {
        texto += elementos[i].innerText + "<br/>";
    }
    getById('resultado2').innerHTML = texto;
});


getById('marcarCheckboxes').addEventListener('click', () => {
    let checkboxes = 
        document.querySelectorAll("input[type='checkbox']");

    marcarDesmarcar(checkboxes, true);    
});

getById('desmarcarCheckboxes').addEventListener('click', () => {
    let checkboxes = 
        document.querySelectorAll("input[type='checkbox']");

    marcarDesmarcar(checkboxes, false);    
});

function marcarDesmarcar(checkboxes, marcar) {
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = marcar;
    }
}