function divEdit() {

    var header = document.getElementById("header");

    var conteudo = header.innerHTML;

    header.innerHTML = "<strong>" + conteudo + "</strong>";

    var paragrafo =  document.createElement('p');

    paragrafo.setAttribute('title', 'Novo Paragrafo');

    var txt = document.createTextNode('Parágrafo adicionado a árvore DOM');

    paragrafo.appendChild(txt);

    header.appendChild(paragrafo);
}