var req = null;

// Constante para teste de quando os dados estão prontos para serem usados
var READY_STATE_COMPLETE = 4;

/**
* Função que fica verificando as notícias no servidor em períodos
* de tempo
* @param data Endereco dos dados no servidor
*/
function timedNews(data) {
    // Busca os dados no servidor
    sendRequest(data);

    // Programa para ser executada novamente em 30 segundos
    var t = setTimeout("timedNews('" + data + "')", 30000);
}

/**
* Função para requisitar uma página com dados
* @param url URL do dado a ser buscado
* @param params Parâmetos (querystring) para páginas dinâmicas
* @param HttpMethod Método do protocolo HTTP, se omitido será usado GET
*/
function sendRequest(url, params, HttpMethod) {
    // Verifica se o metodo foi setado, caso contrário seta para GET
    if (!HttpMethod) { 

        HttpMethod = "GET";
    
    }

    // Instância o objeto XMLHttpRequest
    req = initXMLHttpRequest();

    if(req) {
        // Seta a função de callback
        req.onreadystatechange = onReadyState;
        req.open(HttpMethod, url, true);
        req.setRequestHeader("Content-Type", "text/xml");
        req.send(params);
    }
}

/**
* Função que inicia o objeto XMLHttpRequest de acordo com o browser cliente.
* @return objeto do tipo XMLHttpRequest.
*/

function initXMLHttpRequest() {
    var xRequest = null;

    // código para o Mozilla
    if (window.XMLHttpRequest) {
        xRequest = new XMLHttpRequest();

    // código para IE
    } else if (window.ActiveXObject) {
        
        xRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Retorna o objeto instânciado
    return xRequest;
}

/**
* Função de callback que verifica se o dado já esta pronto para uso.
* Caso posistivo, chama um função para trata-lo
*/
function onReadyState() {
    var ready = req.readyState;

    // Se a requisição estiver completa
    if (ready == READY_STATE_COMPLETE) {
        
        // Retira mensagem de loading
        loadingMsg(0)

        // Trata os dados recem chegados
        parseNews();

        // Caso o contrário coloca a mensagem de loading
    }   else {
        loadingMsg(1);
    }
}


/**
* Função que dado a data e título de uma notícia verifica se ela já
* esta sendo exibida na página.
* @param titulo O título da notícia que se deseja buscar
* @return ’True’ se a notícia já existir e ’False’ caso contrário
*/
function newDetect(titulo) {

    // Recupera a div onde as notícias serão inseridas
    var sitenews = document.getElementById('news');

    // Pga o primeiro filho
    var oldnew = sitenews.firstChild;

    if (oldnew == null) {
        
        // A div de notícias não possui filhos
        // logo não existe nenhuma noticia 
        return false;

    } else {
        // Busca em todas as notícias
        while (oldnew != null) {
            // Armazena o título das notícias atual
            var tit = oldnew.getElementsByTagName('h3');
            tit = tit[0].innerHTML;

            // Se for igual ao título que estamos testando
            if (tit == titulo) {
                // Retorna que a notícia já existe
                return true;
            }
            oldnew = oldnew.nextSibling;
        }
        // Se nenhuma notícias for igual
        // Retorna que não existe
        return false;
    }
}

/**
* Função que recebe o XML carregado, separa as notícias e as
* insere na página caso ela não exista
*/
function parseNews() {
    var news = req.responseXML.getElementsByTagName('new');

    for(var i =0; i < news.length; i++) {

        var date = getNodeValue(news[i], 'date');
        var title = getNodeValue(news[i], 'title');
        var titcont = date + " - " + title;

        // Verifica se a notícia já esta na página
        if (newDetect(titcont) == false) {
            // Cria a div que ira conter a notícia
            divnew = document.createElement('div');
            divnew.setAttribute('id', 'new' + i);

            // Cria o título das notícias
            var titulo = document.createElement('h3');
            titulo.appendChild(document.createTextNode(titcont));

            // Cria o corpo das notícias
            var corpo = document.createElement('p');
            corpo.setAttribute('class', 'corpo');

            // Agrega o conteúdo obtido ao corpo criado anteriormente
            var txt = document.createTextNode(getNodeValue(news[i], 'content'));
            corpo.appendChild(txt); 

            // Agrega o título e o corpo a div criada no iniciado
            divnew.appendChild(titulo);
            divnew.appendChild(corpo);

            // Busca onde a notícias será inserida na página
            var base = document.getElementById('news');

            // Insere a notíciacomo primeira da página
            base.insertBefore(divnew, base.firstChild);
        }
    }
}

/**
* Função para pegar o valor de uma propriedade de um objeto
* @param obj
* @param tag Nome da propriedade que se deseja saber o valor
* @return retorna uma string contendo o valor da propriedade
*/
function getNodeValue(obj, tag) {
    return obj.getElementsByTagName(tag)[0].firstChild.nodeValue;

}

/**
* Função que indica indica ao usuário quando dados estam sendo carregados
* @param set Valor 1 para colocar a mensagem, qualquer outro para remover
*/
function loadingMsg(set) {
    if (set == 1) { 
        var msg_div = document.getElementById('loadDiv');

        if (msg_div == null) {
            // Cria a div de loading
            msg_div = document.createElement('div');
            msg_div.setAttribute('id', 'loadDiv');

            // Insere o texto na div criada
            var txt = document.createTextNode('Loading...');
            msg_div.appendChild(txt);

            // Agrega a div no corpo da página
            var corpo = document.getElementsByTagName('body');
            corpo[0].appendChild(msg_div);

        } else {
            // Altera o conteúdo da div 
            msg_div.innerHTML = "Loading...";

        }
    } else {
        // Busca a div de loading na página
        var msg_div = document.getElementById('loadDiv');

        // Se encontrar remove
        if (msg_div != null) {
            var pai = msg_div.parentNode;
            pai.removeChild(msg_div);
        }
    }
}