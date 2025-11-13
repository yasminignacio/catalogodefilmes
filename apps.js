// Substitua pela sua chave REAL da OMDB API
const OMDB_API_KEY = 'c4e45fd4';
const listaFilmesContainer = document.querySelector('.lista-filmes');
const searchInput = document.querySelector('.search-input');

//... A. Função para Criar o HTML do Card ---
/***
* Cria o elemento HTML de um Card de Filme com os dados da OMDB.
* @param {Object} filme - Objeto de filme retornado pela API.
*/
function criarCardFilme (filme) {
  const card = document.createElement('div');
  card.classList.add('card-filme');
// Adiciona o IMDB ID como um data-attribute para buscar detalhes/trailer depois
card.dataset.imdbId = filme.imdbID; 

// Garante que o rating seja um valor presente
const rating = filme.imdbRating ? `⭐ ${filme.imdbRating}` : `⭐ N/A`;

// Conteudo HTML do card, usando as novas classes CSS
card.innerHTML = `
   <img src="${filme.Poster !== 'N/A' ? filme.Poster : 'placeholder.jpg'}"
     alt="${filme.Title}"
     class="poster-filme">
<span class="avaliacao">${rating}</span>
<div class="card-detalhes">
    <h3 class="titulo-filme">${filme.Title} (${filme.Year})</h3>
    <button class="botao-adicionar" data-title="${filme. Title}">
      + Minha Lista
  </button>
</div>
`;

// Adiciona um listener para a funcionalidade de trailer (Se você tiver a API)
// Se você usar a OMDB, precisará de uma segunda chamada para os detalhes
card.addEventListener('click', () => buscarEExibirDetalhes (filme.imdbID));

return card;
}

// --- B. Função Principal de Busca ---
/**
* Busca o filme na OMDS e atualiza o container.
* @param {string} termo - Termo de busca digitado pelo usuario.
*/
async function buscarFilmes (termo) { 
  if (!termo) return; // Não busca se o campo estiver vazio

// Limpa a lista anterior e mostra um indicador de carregamento
listafilmesContainer.innerHTML = '<p style="text-align: center; color: gray;">Carregando...</p>';
 
try { 
// Busca na OMDB (O parametro 's' para busca por termo)
  const response = await fetch(`https://www.omdbapi.com/?s=${termo}&apikey=${OMDB_API_KEY}`);
  const data = await response.json();

// Limpa o container novamente
listaFilmesContainer.innerHTML ='';

if (data.Response === 'True' && data.Search){ 
  data.Search.forEach (async (filmeBase) => { 
    // A OMDB retorna apenas dados básicos na busca (s). 
  // Precisamos de uma segunda busca (1) para pegar o Rating.
  const.filmeDetalhado = await buscarDetalhes(filmeBase.imdbID);
   if (filmeDetalhado) { 
    listaFilmesContainer.appendChild(criarCardFilme (filmeDetalhado));
   }
  });
} else {
  listaFilmesContainer.innerHTML = `<p style="text-align: center;">Nenhum filme encontrado para "${termo}".</p>`;
}
} catch (error) {
  console.error("Erro ao buscar filmes:", error);
  listaFilmesContainer.innerHTML= '<p style="text-align: center; color: red;">Erro na conexão com a API.</p>';
  }
}
