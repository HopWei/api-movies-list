const apiKey = "<<SUA_API_KEY_AQUI>>";
const searchInput = document.getElementById("search");
const filmesContainer = document.getElementById("filmes");
const favoritosContainer = document.getElementById("favoritos");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length >= 2) {
    buscarFilmes(query);
  } else {
    filmesContainer.innerHTML = "";
  }
});

function buscarFilmes(query) {
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`)
    .then(res => res.json())
    .then(data => {
      filmesContainer.innerHTML = "";
      data.results.slice(0, 10).forEach(filme => {
        const card = criarCardFilme(filme, false);
        filmesContainer.appendChild(card);
      });
    });
}

function criarCardFilme(filme, isFavorito) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = filme.poster_path
    ? `https://image.tmdb.org/t/p/w200${filme.poster_path}`
    : "https://via.placeholder.com/150x225?text=Sem+Imagem";

  const title = document.createElement("p");
  title.textContent = filme.title;

  const button = document.createElement("button");
  button.textContent = isFavorito ? "Remover" : "Favoritar";
  button.onclick = () => {
    if (isFavorito) {
      removerFavorito(filme.id);
    } else {
      adicionarFavorito(filme);
    }
    renderizarFavoritos();
  };

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(button);

  return card;
}

function adicionarFavorito(filme) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.find(f => f.id === filme.id)) {
    favoritos.push(filme);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }
}

function removerFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter(f => f.id !== id);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function renderizarFavoritos() {
  favoritosContainer.innerHTML = "";
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.forEach(filme => {
    const card = criarCardFilme(filme, true);
    favoritosContainer.appendChild(card);
  });
}

renderizarFavoritos();