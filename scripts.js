/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/partidas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.futebol.forEach(item => insertList(item.mandante,
        item.visitante,
        item.mandante_ganhou
      ))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList();

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputHomeTeam, inputAwayTeam) => {
  const formData = new FormData();
  formData.append('mandante', inputHomeTeam);
  formData.append('visitante', inputAwayTeam);

  let url = 'http://127.0.0.1:5000/partida';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let tr = this.parentElement.parentElement;
      const homeTeam = tr.getElementsByTagName('td')[0].innerHTML;
      const awayTeam = tr.getElementsByTagName('td')[1].innerHTML;

      if (confirm("Você tem certeza?")) {
        tr.remove();
        deleteItem(homeTeam, awayTeam);
        alert("Removido!");
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (homeTeam, awayTeam) => {
  let url = `http://127.0.0.1:5000/partida?mandante=${homeTeam}&visitante=${awayTeam}`;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const predictOutcome = async () => {
  let inputHomeTeam = document.getElementById("homeTeam").value;
  let inputAwayTeam = document.getElementById("awayTeam").value;

  // Verifique se o time mandante já existe antes de adicionar
  const checkUrl = `http://127.0.0.1:5000/partidas?homeTeam=${inputHomeTeam}`;
  fetch(checkUrl, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      if (inputHomeTeam === '' || inputAwayTeam === '') {
        alert("Preencha todos os campos!");
      } else {
        insertList(inputHomeTeam, inputAwayTeam);
        postItem(inputHomeTeam, inputAwayTeam);
        alert("Item adicionado!");

        // Atualizar a página após adicionar o item
        location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (homeTeam, awayTeam, winner) => {
  var item = [homeTeam, awayTeam, winner];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cell = row.insertCell(i);
    cell.textContent = item[i];
  }

  var deleteCell = row.insertCell(-1);
  insertDeleteButton(deleteCell);

  document.getElementById("homeTeam").value = "";
  document.getElementById("awayTeam").value = "";

  removeElement();
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}



// Lista de times
const times = [
  "America-MG", "America-RN", "Athletico-PR", "Atletico-GO", "Atletico-MG", "Avai", "Bahia", "Barueri",
  "Botafogo-RJ", "Bragantino", "Brasiliense", "Ceara", "Chapecoense", "Corinthians", "Coritiba",
  "Criciuma", "Cruzeiro", "CSA", "Cuiaba", "Figueirense", "Flamengo", "Fluminense", "Fortaleza",
  "Goias", "Gremio", "Gremio Prudente", "Guarani", "Internacional", "Ipatinga", "Joinville", "Juventude",
  "Nautico", "Palmeiras", "Parana", "Paysandu", "Ponte Preta", "Portuguesa", "Santa Cruz", "Santo Andre",
  "Santos", "Sao Caetano", "Sao Paulo", "Sport", "Vasco", "Vitoria"
];

// Função para preencher as comboboxes
const fillTeamsDropdowns = () => {
  const homeTeamSelect = document.getElementById("homeTeam");
  const awayTeamSelect = document.getElementById("awayTeam");

  times.forEach(team => {
    const option = document.createElement("option");
    option.value = team;
    option.textContent = team;

    homeTeamSelect.appendChild(option.cloneNode(true));
    awayTeamSelect.appendChild(option);
  });
};

// Chamada para preencher as comboboxes no carregamento da página
fillTeamsDropdowns();