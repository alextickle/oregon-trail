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
  animalTimer: "",
  huntTimer: "",
  clearRows: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  reloaded: true,
  kills: 0,
  shots: 0,
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
        else if (this.grid[i][j] == "d"){
          document.getElementById(i + "-" + j).setAttribute("class", "dead");
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
      for (var b = 19; b >= 0; b--) {
        if (this.grid[a][b] == "a"){
          this.grid[a][b] = "";
          this.grid[a][b + 1] = "a";
        }
      }
    }
  },
  currentBullet: {
      column: this.manPos,
      row: 18,
      timer: ""
  }
}

function generateAnimal(){
  var initialPosition = state.clearRows[Math.floor(Math.random() * state.clearRows.length)];
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
  state.animalTimer = setInterval(generateAnimal, 1000);
}

function startHuntTimer(){
  state.huntTimer = setInterval(clearAnimalTimer, 20000);
}

function clearAnimalTimer(){
  clearTimeout(state.animalTimer);
  foodGained = Math.floor(Math.random() * state.kills * 10);
  document.getElementById("results").innerHTML = "You killed " + state.kills + " animals."
  $(document).unbind("keydown");
  $("#foodForm").attr("action", "/post-hunt/" + foodGained + "/" + state.shots);
  $("#foodForm").show();

}

function shoot(){
  state.shots++;
  var bulletTimer = setInterval(bulletAdvances, 50)
  state.reloaded = false;
  state.currentBullet.timer = bulletTimer;
  state.currentBullet.column = state.manPos;
}

function bulletAdvances(){
  if (state.currentBullet.row >= 0){
    if (state.currentBullet.row == 0){
      state.grid[state.currentBullet.row][state.currentBullet.column] = "";
      state.currentBullet.row -= 1;
    }
    else {
      if (state.grid[state.currentBullet.row - 1][state.currentBullet.column] == "a"){
        state.grid[state.currentBullet.row - 1][state.currentBullet.column] = "d";
        console.log("kill!");
        state.clearRows.splice(state.clearRows.indexOf(state.currentBullet.row - 1), 1);
        state.kills++
        state.grid[state.currentBullet.row][state.currentBullet.column] = "";
        clearTimeout(state.currentBullet.timer);
        state.reloaded = true;
        state.currentBullet.row = 18;
      }
      else {
        state.grid[state.currentBullet.row - 1][state.currentBullet.column] = "b";
        state.grid[state.currentBullet.row][state.currentBullet.column] = "";
        state.currentBullet.row -= 1;
      }
    }
  }
  else {
    clearTimeout(state.currentBullet.timer);
    state.reloaded = true;
    state.currentBullet.row = 18;
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
          if (state.reloaded){
              shoot();
          }
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
  startHuntTimer();
  populateGrid();
});
