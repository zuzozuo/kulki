document.addEventListener("DOMContentLoaded", function() {
  var EMPTY_CELL = 0, //puste komórki
    CIRCLE_CELL = 1, //komórki w których  jest kulka
    mainDiv = document.createElement("div"),
    boardRows = 9, //wiersze
    boardCols = 9, //kolumny
    randomCell = 0, //losowa komórka
    boardCells, //tablica ze wszystkimi komórkami
    colors, //tablica z kolorami
    circleColor, //wylosowany kolor dla kółka
    posStart, //pozycja startu
    posEnd, //pozycja końca
    place, //miejsce wylosowane dla  kulki
    selected = false, //flaga wybranej kulki
    turn = false, //flaga ruchu
    found = false, //flaga odnalezionej ścieżki
    circleToCopy; //to jest moje kółko do kopiowania;
  //----------------------------------------------------

  //--------- Tworzenie planszy -----------
  function createBoard() {
    var x, y, cell, row, nr;
    nr = 0; //numer komórki
    boardCells = []; //tablica z wszystkimi komórkami

    document.body.appendChild(mainDiv);
    mainDiv.className = "main";

    for (y = 0; y < boardRows; y++) {
      row = document.createElement('div')
      mainDiv.appendChild(row); //utworzenie wierszy

      for (x = 0; x < boardCols; x++) {
        cell = document.createElement('div');
        cell.dataset.nr = nr;
        cell.dataset.x = x; //dodanie atrybutów x, y do komórki
        cell.dataset.y = y;
        cell.className = 'cell'
        cell.addEventListener('click', clickCell); //podpięcie clicka do każdej komorki
        row.appendChild(cell); //dodanie komórek do wierszy
        boardCells.push(cell); //dodanie komórki do tablicy
        nr++;
      }
    }
  }

  //-----------losowanie koloru-------------
  function drawColor() {
    var randomColor;
    colors = ['#ff6666', '#cc99ff', '#66d9ff', '#66ff66', '#ffff66'];
    randomColor = Math.floor((Math.random() * colors.length));
    circleColor = colors[randomColor];
  }

  //-------losowanie miejsca-------------
  function drawPlace() {
    do {
      randomCell = Math.floor((Math.random() * boardCells.length));
    } while (boardCells[randomCell].dataset.type == CIRCLE_CELL);

    boardCells[randomCell].dataset.type = CIRCLE_CELL;
    place = boardCells[randomCell];
    //console.log(place);
  }

  //---------Dodanie kulki-----------
  function addCircle() {
    var circleDiv = document.createElement('div');
    circleDiv.className = 'circle';
    drawPlace();
    place.appendChild(circleDiv);
    drawColor();
    circleDiv.style.backgroundColor = circleColor;
  }
  //---------Reset i przygotowanie planszy do gry ------------

  function resetBoard() {
    for (var i = 0; i < boardCells.length; i++) {
      boardCells[i].dataset.type = EMPTY_CELL;
      boardCells[i].innerHTML = '';
    }

    for (var j = 0; j < 3; j++) {
      addCircle();
    } //dodanie 3 kulek
  }

  // -------- Kliknieto -------------
  function clickCell() {
    var nr = parseInt(this.dataset.nr),
      cellMode = this.dataset.type;

    if (cellMode == CIRCLE_CELL) {
      this.firstChild.className = "selected";
      if (selected == false) {
        posStart = nr;
        circleToCopy = this.firstChild;
        selected = true;
        clearVisible();
        this.dataset.type = EMPTY_CELL;
      } else {
        this.firstChild.className = "circle";
      }
    } else if (cellMode == EMPTY_CELL && selected == true) {
      posEnd = nr;
      findTheShortestPath(posStart, posEnd);
      if (found == true) {
        this.appendChild(circleToCopy);
        this.firstChild.className = "circle";
        selected = false;
        this.dataset.type = CIRCLE_CELL;
        checkTurn(posStart, posEnd);
      }
    } else {
      return;
    }
  }

  function checkTurn(start, end) {
    if (start == end || found == false) {
      return;
    } else if (start != end) {
      turn = true;
      addAfterTurn();
      console.log("tura zrobiona!");
    }
  }


  //------Dodaj kulki po ruchu----------
  function addAfterTurn() {
    var i;
    for (i = 0; i < 3; i++) {
      addCircle();
    }
    checkBoard();
  }

  //--------Szukaj sąsiadów----------------

  function findNeighbours(current) {
    var x = boardCells[current].dataset.x,
      y = boardCells[current].dataset.y,
      neighbours = [];

    //sprawdzenie kierunku w lewo
    if (x > 0) {
      neighbours.push(current - 1);
    }
    //kierunek w prawo
    if (x < boardCols - 1) {
      neighbours.push(current + 1);
    }
    //kierunek w górę
    if (y > 0) {
      neighbours.push(current - boardCols);
    }
    //kierunek w dół
    if (y < boardRows - 1) {
      neighbours.push(current + boardCols);
    }

    return neighbours;
  }

  //---------- Szukaj najkrótszej ścieżki----------
  function findTheShortestPath(start, end) {
    var current, //komórka w której aktualnie się znajdujemy
      neighbours, //tablica z sąsiadami komórki
      check, //zmienna pomocnicza, do sprawdzania flagi odwiedzonych
      path, //tablica, która zwróci nam całą ścieżkę
      i,
      track = [], //tablica początkowa ze ścieżką
      backtrack = [], //tablica   z historią ścieżki
      visited = []; //tablica z flagami odwiedzonych komórek

    //ustawiamy kulkom flagi odwiedzonych, aby nie sprawdzać ścieżki w tych polach
    for (i = 0; i < boardCells.length; i++) {
      if (boardCells[i].dataset.type == CIRCLE_CELL) {
        visited.push(true);
      } else {
        visited.push(false);
      }
    }

    for (i = 0; i < boardCells.length; i++) {
      backtrack.push(-1);
    } // inicjalizacja tablicy do której bedzie wpisywana ściezka powrotna

    track = [start] //ustawienie  1 pozycji w tablicy ze ścieżką

    while (track.length > 0) { //jest to pętla po kolejce pól do sprawdzenia
      current = track.shift(); //pobranie aktualnej komórki z pozycją z tablicy ścieżki
      if (current == end) {
        break;
      }

      neighbours = findNeighbours(current); //szukanie i wpisanie do tablicy sąsiadów aktualnej komórki

      for (i = 0; i < neighbours.length; i++) { //pętla wykonuje się dla każdego sąsiada
        check = neighbours[i]; //zmienna pomocnicza do której przypisujemy naszego sąsiada
        if (visited[check] == false) { //pętla, która sprawdza czy aktualne pole nie było jeszcze odwiedzone
          visited[check] = true; //jeżeli nie było, to teraz już jest i ustawiamy flagę odwiedzenia pola
          backtrack[check] = current; //zapamiętujemy z którego pola tu trafiliśmy
          track.push(check); //dodajemy pole do listy do sprawdzenia
        }
      }

    }

    if (current == end) { //czy aktualne pole na którym się znajdujemy jest równe naszemu celowi?
      found = true;
      path = [end]; //zaczynamy odtwarzać ścieżkę od końca do początku
      current = end;
      while (current != start) {
        current = backtrack[current];
        path.unshift(current);
      }

      if (path.length > 1) { //gotowa ścieżka, kolorowanie jej
        for (i = 0; i < path.length - 1; i++) {
          boardCells[path[i]].style.backgroundColor = "lightpink";
        }
      }
    } else { //jeżeli nie dotrzemy do końca, nie znajdziemy drogi końca
      console.log("Nie znaleziono ściezki");
      found = false;

    }
  }

  //------Czyszczenie kolorków!-------------

  function clearVisible() {
    var i;
    for (i = 0; i < boardCells.length; i++) {
      if (boardCells[i].style.backgroundColor == "lightpink") {
        boardCells[i].style.backgroundColor = "white";
      }
    }
  }

  //----Sprawdzenie czy plansza jest zapełniona-------

  function checkBoard() {
    var circleCells = [],
      i;

    for (i = 0; i < boardCells.length; i++) {
      if (boardCells[i].dataset.type == CIRCLE_CELL) {
        circleCells.push(boardCells[i]);
      }
    }

    if (boardCells.length == circleCells.length) {
      var gameEnd = document.createElement('div');
      document.body.appendChild(gameEnd);
      gameEnd.className = "end";
      gameEnd.innerHTML = "Koniec gry";
    }
  }
  //-----------------------------

  //----wywołanie funkcji ------
  createBoard();
  resetBoard();
});
