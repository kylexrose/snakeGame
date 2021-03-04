let grid = "";
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

//-----------------------------------------------------------------------------------------------------------------

let direction = "ArrowRight";
let snake;
let snakeLength = 3;
let currentDot;
let started = false;
let engine;
let lastDirection;



document.addEventListener("keydown", (e)=>{
    if(!started && e.key === " "){
        init();
    }
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
    if(snake !== undefined){
    removeSnake();
    }
    snake = [[10, 10], [10, 9], [10, 8]];    
    colorSnake("snake");
    if (currentDot !== undefined){
        removeDot();
    }else{
        dotPlacer();
    }
    engine = setInterval(updateSnake, 200);
    started = true;
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

function removeSnake(){
    for(let i = snake.length - 1; i >= 0; i--){
        let snakeSection = document.getElementById("cell[" + snake[i][0] + ", " + snake[i][1] + "]");
        if (snakeSection !== null){
                snakeSection.classList.remove("gameOver");
                snakeSection.classList.remove("snake");
        }
    }
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
        dotPlacer();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }