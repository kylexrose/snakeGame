let grid = "";
let highScore = 0;
let currentScore = 0;
const width = 40;
const height = 40;
for (let row = 1; row <= height; row++){
    grid += "<div class=\"row\" id = \"row" + row + "\" >";
    for (let column = 1; column <= width; column++){
        grid += "<p class =\"row" + row + " column" + column + " cell\" id=\"cell[" + row + ", " + column + "]\" ></p>";
    }
    grid += "</div>"
}
document.getElementById("grid").innerHTML = grid;
document.getElementById("highScore").innerHTML = "High Score: " + highScore;
document.getElementById("currentScore").innerHTML = "Current Score: " + currentScore;

function boxSize(size){
    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++){
        cells[i].style.height = size + "px";
        cells[i].style.width = size + "px";
    }
}

boxSize(14);
//-----------------------------------------------------------------------------------------------------------------
let difficultyHTML = document.getElementsByName("difficulty");
let direction;
let snake;
let snakeLength;
let currentDot;
let started = false;
let engine;
let speed;
let difficulty;
let paused = false


document.addEventListener("keydown", (e)=>{
    if(!started && e.key === " "){
        checkDifficulty();
        init();
    }/*else if(started && e.key === " " && !paused){
        clearInterval(engine);
        paused = true;
    }else if(started && e.key === " " && paused){
        setInterval(updateSnake, speed);
        paused = false;
    }*/
    if(direction !== "ArrowUp" && e.key === "ArrowDown"){
        direction = e.key;
    }else if(direction !== "ArrowRight" && e.key === "ArrowLeft"){
        direction = e.key;
    }else if(direction !== "ArrowDown" && e.key === "ArrowUp"){
        direction = e.key;
    }else if(direction !== "ArrowLeft" && e.key === "ArrowRight"){
        direction = e.key;
    }
   })

function init(){
    direction = "ArrowRight";
    if(snake !== undefined){
    removeSnake();
    }
    snake = [[10, 10], [10, 9], [10, 8]];    
    snakeLength = snake.length;
    colorSnake("snake");
    if (currentDot !== undefined){
        removeDot();
    }else{
        dotPlacer();
    }
    speed = 200;
    engine = setInterval(updateSnake, speed);
    started = true;
    currentScore = 0;
}
//updateSnake();
function updateSnake(){
    if (direction === "ArrowRight"){
        snakePop();
        snake.unshift([snake[0][0], snake[0][1] + 1]);
        if (!(checkForGameOver())){
            addLeadClass();
        }
    }else if (direction === "ArrowDown"){
        snakePop();
        snake.unshift([snake[0][0] + 1, snake[0][1]]);
        if (!(checkForGameOver())){
            addLeadClass();
        }
    }else if (direction === "ArrowLeft"){
        snakePop();
        snake.unshift([snake[0][0], snake[0][1] - 1]);
        if (!(checkForGameOver())){
            addLeadClass();
        }
    }else if (direction === "ArrowUp"){
        snakePop();
        snake.unshift([snake[0][0] - 1, snake[0][1]]);
        if (!(checkForGameOver())){
            addLeadClass();
        }
    }
    removeDot();
}

function addLeadClass(){
    document.getElementById("cell[" + snake[0][0] + ", " + snake[0][1] + "]").classList.add("snake");
}

function snakePop(){
    if (snake.length >= snakeLength){
        let remove = snake.pop()
        document.getElementById("cell[" + remove[0] + ", " + remove[1] + "]").classList.remove("snake");
    }
}

function checkForGameOver(){
    let array = snake.map((x)=> x );
    array.shift();
    if (snake[0][0] >= height + 1 || snake[0][0] <= 0 || snake[0][1] >= width + 1 || snake[0][1] <= 0){
        clearInterval(engine);
        snakeGameOver();
        started = false;
        return true;
    }
    if (JSON.stringify(array).includes(JSON.stringify(snake[0]))){
        clearInterval(engine);
        snakeGameOver();
        started = false;
        return true;
    }
}

function colorSnake(className){
    for(let i = snake.length - 1; i >= 0; i--){
        document.getElementById("cell[" + snake[i][0] + ", " + snake[i][1] + "]").classList.add(className);
    }
}

function snakeGameOver(){
    for(let i = snake.length - 1; i >= 1; i--){
        let snakeSection = document.getElementById("cell[" + snake[i][0] + ", " + snake[i][1] + "]");
        snakeSection.classList.add("gameOver");
    }
}
function updateScore(){
    currentScore = snakeLength;
    document.getElementById("currentScore").innerHTML = "Current Score: " + currentScore;
    if (snakeLength > highScore){
        highScore = snakeLength;
        document.getElementById("highScore").innerHTML = "High Score: " + highScore;
    }
}

function removeSnake(){
    for(let i = snake.length - 1; i >= 0; i--){
        let snakeSection = document.getElementById("cell[" + snake[i][0] + ", " + snake[i][1] + "]");
        if (snakeSection !== null){
                snakeSection.classList.remove("gameOver");
                snakeSection.classList.remove("snake");
        }
    }
}

function speedUp(){
    speed *= difficulty;
    clearInterval(engine);
    engine = setInterval(updateSnake, speed);
}

//------------------------------------------------------------------------------------------------------------------

function dotPlacer(){
    let dotRow = getRandomInt(1, height+1)
    let dotColumn = getRandomInt(1, width+1)
    currentDot = [dotRow, dotColumn];
    if (document.getElementById("cell[" + dotRow + ", " + dotColumn + "]").classList.contains("snake")){
        dotPlacer();
    }else{
        document.getElementById("cell[" + dotRow + ", " + dotColumn + "]").classList.add("dot");
    }
}

function removeDot(){
    if(currentDot[0] === snake[0][0] && currentDot[1] === snake[0][1]){
        snakeLength++;
        document.getElementById("cell[" + currentDot[0] + ", " + currentDot[1] + "]").classList.remove("dot");
        updateScore();
        speedUp();
        dotPlacer();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

function checkDifficulty(){
    if (difficultyHTML[0].checked){
        difficulty = .98;
        speed = 250;
    }else{
        difficulty = .96;
        speed = 200;
    }
}