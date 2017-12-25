document.addEventListener("DOMContentLoaded", function() {
  //console.log("Jestem działającym skryptem, elo!");

  var EMPTY_CELL = 0, //puste komórki
    CIRCLE_CELL = 1, //komórki w których  jest kulka
    CLICKED_CIRCLE = 2, //kliknięta kulka
    mainDiv = document.createElement("div"),
    boardRows = 9,
    boardCols = 9,
    randomCell = 0,
    boardCells,
    messyBoard,
    colors,
    circleColor,
    circle,
    place;
  //----------------------------------------------------

  //--------- Tworzenie planszy -----------

  function createBoard() {
    var x, y, cell, row, nr;
    nr = 0; //numer komórki
    boardCells = []; //tablica z komórkami

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
    console.log(place);
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
    messyBoard = true;

    for (var j = 0; j < 3; j++) {
      addCircle();
    } //dodanie 3 kulek
  }

  // -------- Kliknieto -------------
  function clickCell() {
    console.log(this.dataset.type);
    /*if (messyBoard) {
      for (var i = 0; i < boardCells.length; i++) {
        if (boardCells[i].dataset.type == EMPTY_CELL) {
          boardCells[i].innerHTML = ' ';
        }
      }
      messyBoard = false;
    }*/
  }
  //-----------------------------

  //----wywołanie funkcji ------
  createBoard();
  resetBoard();
  console.log(boardCells);
});
