function initGrid(){
  var grid = document.getElementById("grid")
  var currentRow;
  var currentCell;
  for (var i = 0; i < 20; i++) {
    currentRow = grid.insertRow(i);
    for (var j = 0; j < 20; j++) {
      currentCell= currentRow.insertCell(j)
      currentCell.id = i + "-" + j;
    }
  }
}

var state = {
  grid: [],
  manPos: 10,
  huntTimer: "",
  render: function(){
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 20; j++) {
        if (this.grid[i][j] == "a"){
          document.getElementById(i + "-" + j).setAttribute("class", "animal");
        }
        else if (this.grid[i][j] == "m"){
          document.getElementById(i + "-" + j).setAttribute("class", "man");
        }
        else if (this.grid[i][j] == "b"){
          document.getElementById(i + "-" + j).setAttribute("class", "bullet");
        }
        else {
          document.getElementById(i + "-" + j).setAttribute("class", "blank");
        }
      }
    }
  },
  // all animals advance right one column
  animalsMove: function(){
    for (var a = 0; a < 20; a++) {
      for (var b = 18; b >= 0; b--) {
        if (this.grid[a][b] == "a"){
          this.grid[a][b] = "";
          this.grid[a][b + 1] = "a";
        }
      }
    }
  },
  currentBullet: {
      column: this.manPos,
      row: 19,
      timer: ""
  }
}

function manAlive(){
  var alive = false;
  for (var i = 19; i >= 0; i--) {
    for (var j = 0; j < 20; j++) {
      if (state.grid[i][j] == "m"){
        alive = true;
      }
    }
  }
  return alive;
}

function generateAnimal(){
  var initialPosition = Math.floor(Math.random() * 19);
  state.grid[initialPosition][0] = "a";
  state.render();
  state.animalsMove();
}

function moveRight(){
  if (state.manPos == 19){
    if (state.grid[19][0] != "a"){
      state.grid[19][0] = "m";
    }
    state.grid[19][19] = "";
    state.manPos = 0;
  }
  else {
    if (state.grid[19][state.manPos + 1] != "a"){
      state.grid[19][state.manPos + 1] = "m";
    }
    state.grid[19][state.manPos] = "";
    state.manPos += 1;
  }
  state.render();
}

function moveLeft(){
  if (state.manPos == 0){
    if (state.grid[19][19] != "a"){
      state.grid[19][19] = "m";
    }
    state.grid[19][0] = "";
    state.manPos = 19;
  }
  else {
    if (state.grid[19][state.manPos - 1] != "a"){
      state.grid[19][state.manPos - 1] = "m";
    }
    state.grid[19][state.manPos] = "";
    state.manPos -= 1;
  }
  state.render();
}

function startAnimals(){
  state.huntTimer = setInterval(generateAnimal, 1000);
}

function shoot(){
  var bulletTimer = setInterval(bulletAdvances, 50)
  state.currentBullet.timer = bulletTimer;
  state.currentBullet.column = state.manPos;
}

function bulletAdvances(){
  if (state.currentBullet.row > 0){
    state.grid[state.currentBullet.row][state.currentBullet.column] = "";
    state.grid[state.currentBullet.row - 1][state.currentBullet.column] = "b";
    state.currentBullet.row -= 1;
  }
  else {
    clearTimeout(state.currentBullet.timer);
    for (var row = 0; row < 19; row++){
      state.grid[row][state.currentBullet.column] = "";
      state.render();
      state.currentBullet.row = 19;
    }
  }
  state.render();
}

function populateGrid(){
  var array = [];
  var currentRow;
  for (var i = 0; i < 20; i++){
    currentRow = [];
    array.push(currentRow);
    for (var j = 0; j < 20; j++){
      currentRow.push("");
    }
  }
  state.grid = array;
  state.grid[19][10] = "m";
}

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          moveLeft();
          break;

        case 38: // up
          shoot();
          break;

        case 39: // right
          moveRight();
          break;

        default: return;
    }
    e.preventDefault();
});

$(document).ready(function(){
  initGrid();
  startAnimals();
  populateGrid();
});
