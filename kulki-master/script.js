document.addEventListener("DOMContentLoaded", function() {
  var EMPTY_CELL = 0, //puste komórki
    CIRCLE_CELL = 1, //komórki w których  jest kulka
    mainDiv = document.createElement("div"),
    boardRows = 9,
    boardCols = 9,
    randomCell = 0,
    boardCells,
    colors,
    circleColor,
    posStart,
    posEnd,
    place,
    selected = false,
    turn = false,
    circleToCopy //to jest moje kółkko do kopiowania;
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
    var nr = parseInt(this.dataset.nr)
    var cellMode = this.dataset.type;

    console.log(this.dataset.type)

    if (selected == false && cellMode == CIRCLE_CELL) {
      clearVisible();
      this.firstChild.className = "selected";
      circleToCopy = this.firstChild;
      posStart = nr;
      selected = true;
      turn = false;
      this.dataset.type = EMPTY_CELL;
    } else if (selected == true && cellMode == EMPTY_CELL) {
      posEnd = nr;
      console.log(posStart, posEnd);
      findTheShortestPath(posStart, posEnd);
      checkTurn(posStart, posEnd); //sprawdza czy wykonano ruch
      this.appendChild(circleToCopy); // to do zmienienia, bo dodaje się nawet po tym jak nie znajdzie ścieżki,
      //zatem jeżeli znajdzie ścieżke,to  ma się dodawać jesli nie to nie
      circleToCopy.className = "circle";
      this.dataset.type = CIRCLE_CELL;
      selected = false;
    }
  }

  //---------sprawdź ruch--------------
  function checkTurn(start, end) {
    if (start == end) {
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
  }

  //--------Szukaj sąsiadów----------------

  function findNeighbours(pos) {
    var x = boardCells[pos].dataset.x,
      y = boardCells[pos].dataset.y,
      neighbours = [];

    if (x > 0) {
      neighbours.push(pos - 1);
    }

    if (x < boardCols - 1) {
      neighbours.push(pos + 1);
    }

    if (y > 0) {
      neighbours.push(pos - boardCols);
    }

    if (y < boardRows - 1) {
      neighbours.push(pos + boardCols);
    }

    return neighbours;
  }

  //---------- Szukaj najkrótszej ścieżki----------
  function findTheShortestPath(start, end) {
    var current, neighbours, check, path, i,
      track = [],
      backtrack = [],
      visited = [];

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

    track = [start] //ustawienie pozycji starowej ścieżki

    while (track.length > 0) {
      current = track.shift();

      if (current == end) {
        break;
      }

      /*if (current != start) {
        boardCells[current].style.backgroundColor = 'pink';
      }*/ //kwestia estetyki

      neighbours = findNeighbours(current);

      for (i = 0; i < neighbours.length; i++) {
        check = neighbours[i];
        if (visited[check] == false) {
          visited[check] = true;
          backtrack[check] = current;
          track.push(check);
        }
      }
    }

    if (current == end) {
      path = [end];
      current = end;
      while (current != start) {
        current = backtrack[current];
        path.unshift(current);
      }

      if (path.length > 2) {
        for (i = 0; i < path.length - 1; i++) {
          boardCells[path[i]].style.backgroundColor = "lightpink";
        }
      }
    }
  }

  //------Czyszczenie kolorków!-------

  function clearVisible() {
    var i;
    for (i = 0; i < boardCells.length; i++) {
      if (boardCells[i].style.backgroundColor == "lightpink") {
        boardCells[i].style.backgroundColor = "white";
      }
    }
  }
  //-----------------------------

  //----wywołanie funkcji ------
  createBoard();
  resetBoard();
});
