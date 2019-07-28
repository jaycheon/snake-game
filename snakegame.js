var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var startBtn = document.getElementById('startButton');
var direction = " ";
var bestScore = 0;
var score;
const width = 400;
const height = 350;
const snakeSize = 10;


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


//initializing game...
(function() {
  buttons = document.getElementsByClassName("button");
  buttons[0].onmousedown=buttons[0].ontouchstart=function() {
    if (direction!="down")
      direction="up";
  };
  buttons[1].onmousedown=buttons[1].ontouchstart=function() {
    if (direction!="right")
      direction="left";
  };
  buttons[2].onmousedown=buttons[2].ontouchstart=function() {
    if (direction!="left")
      direction="right"; 
  };
  buttons[3].onmousedown=buttons[3].ontouchstart=function() {
    if (direction!="up")
      direction="down";
  };
  
  window.onkeydown = function(event) {
    switch (event.keyCode) {
    case 37:  //left arrow key
    case 65:  //a key
      if (direction != "rignt")
        direction = "left";
      break;
    case 38:  //up arrow key
    case 87:  //w key
      if (direction != "down")
        direction = "up";
      break; 
    case 39:  //right arrow key
    case 68:  //d key
      if (direction != "left")
        direction = "right";
      break;
    case 40:  //left arrow key
    case 83:  //s key
      if (direction != "up")
        direction = "down";
      break;
    default:
      break;
    }
  }
  window.onload = function() {snakeGame.init();};
  startBtn.addEventListener("click", function() {snakeGame.start();});
}());


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////


var snakeGame = (function() {
  var init = function() {
    canvas.width = width;
    canvas.height = height;
    areaClear();
  }
  
  var areaClear = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightgrey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }
  
  var start = function() {
    startBtn.disabled = true;
    score = 0;
    direction = "down";
    mySnake = new makeSnake(3);
    createFood();
    gameInterval = setInterval(updateGame, 100);
  }
  
  var stop = function() {
    clearInterval(gameInterval);
    bestScore = (score > bestScore) ? score : bestScore;
    startBtn.disabled = false;
  }
  
  var makeSnake = function(tail_length) {
    this.snake = [];
    for (var i = tail_length; i >= 0; i--)
      this.snake.push({x: i, y: 0})
          
    this.newPos = function() {
      posX = this.snake[0].x;
      posY = this.snake[0].y;
      switch (direction) {
      case "left":
        posX--;
        break;
      case "right":
        posX++;
        break;
      case "up":
        posY--;
        break;
      case "down":
        posY++;
        break;
      default:
        break;
      }
      if (checkCollision(posX, posY, this.snake))
        stop();
      this.snake.unshift({x: posX,y: posY});  
      if (isThereFood(posX, posY)) {
        score++;
        createFood();
      }
      else
        this.snake.pop();
    }

    this.display = function() {
      for (var i = 0; i < this.snake.length; i++)
        draw.snakeBody(this.snake[i].x, this.snake[i].y)
    }
  }
  
  var draw = {
    snakeBody: function(x, y) {
      ctx.fillStyle = 'green';
      ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
      ctx.strokeStyle = 'darkgreen';
      ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    },
    food: function(x, y) {
      ctx.fillStyle='brown';
      ctx.fillRect(x * snakeSize,y * snakeSize, snakeSize, snakeSize);
      ctx.strokeStyle ='black';
      ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    },
    scoreText: function(x, y, font, color) {
      text = "BEST SCORE: " + bestScore + "   MY SCORE: " + score;
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  }
  
  var checkCollision = function(x, y, arr) {
    if (x < 0 || y < 0 || x >= width/10 || y >= height/10)
      return true;
    for (i = 0; i < arr.length; i++)
      if (x == arr[i].x && y == arr[i].y) 
        return true;
    return false;
  }
    
  var createFood = function() {
    do {
      foodX=Math.round(Math.random()*(width/10));
      foodY=Math.round(Math.random()*(height/10));
    } while(checkCollision(foodX, foodY, mySnake.snake));
  }
  
  var isThereFood = function(headX, headY) {
    return headX == foodX && headY == foodY;
  }
  
  var updateGame = function() {
    areaClear();
    mySnake.newPos();
    mySnake.display();
    draw.food(foodX, foodY);
    draw.scoreText(10, height - 10, "15px Georgia", "black");
  }
  
  return {init: init, start: start};
}());