const SCREEN_WIDTH = 533;  // Canvas width in pixels
const SCREEN_HEIGHT = 400;  // Canvas height in pixels
const FPS = 60;  // The frame rate
// How high the penguin jumps in pixels when a key is pressed
const PENGUIN_JUMP_HEIGHT = 95;  // Jump height of the penguin in pixels
const GRAVITY = 5;  // How many pixels every frame the penguin falls down
const FISH_PER_WAVE = 1;  // How many fish come every wave
const PENGUIN_WIDTH = 25;  // The width of the penguin in pixels
const PENGUIN_HEIGHT = 45;  // The height of the penguin in pixels
const FISH_HEIGHT = 11;  // The height of the fish in pixels
const SCORE_COLOUR = "rgb(0, 0, 255)";  // The colour of the score text
const FONT_STYLE = "30px monospace";  // The font style
const SCORE_Y = 30;  // The Y position of the score text
// How much the speed of the fish increases every frame
const FISH_ACCELERATION = 0.8;
const INITIAL_FISH_SPEED = 3;
const FISH_INTERVAL = 3; // If FISH_INTERVAL, 3 every 3 rounds the fish will speed up.


// The fish constructor
var fish = function() {
    this.x = SCREEN_WIDTH;  // Fish X position: right of screen
    this.y = Math.random() * SCREEN_HEIGHT;  // Fish Y position: random position
                                             // between the top and bottom
}

var game = {  // The game object
    canvas: document.createElement("canvas"),  //the game's canvas
    penguin: {  //the game's penguin object
        img: new Image(),  //the penguin image
        x: 0,  //the x position
        y: SCREEN_HEIGHT / 2,  //the y position
        ateFish: false,  //if the penguin ate any fish recently

        jump: function() {  //the jump function to make the penguin jump
            game.penguin.y -= PENGUIN_JUMP_HEIGHT;  //makes the penguin jump
        }
    },
    fishImg: new Image(),  //the game's fish image
    fish: [],  //all the fish objects in the game
    score: 0,  //the game score
    currentRound: 0,
    fishMissed: 0,
    totalFish: 0,
    fishSpeed: INITIAL_FISH_SPEED,  // The distance a fish travels every frame

    //the function that creates the canvas, penguin objects, adds
    //event listeners and everything
    load: function() {
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;  //sets the width and height of the canvas

        this.penguin.img.src = "penguin.png";
        this.fishImg.src = "fish.png";  //sets the sources of the penguin and fish images

        for(var i = 0; i < FISH_PER_WAVE; i ++){
            this.fish[this.fish.length] = new fish();
        }  //fills the fish array with fish


        document.body.appendChild(this.canvas);  //appends the canvas to the body

        this.context = this.canvas.getContext("2d");  //gets the context of the canvas
        game.context.fillStyle = SCORE_COLOUR;
        game.context.font = FONT_STYLE;  //sets the colour and font style of the context

        this.canvas.setAttribute("tabindex", 0);  //if u dont put this then it will not respond to
                                                  //key events
        this.canvas.addEventListener("keydown", this.penguin.jump);  //makes the penguin jump when
                                                                     //a key is pressed
        game.fishMissedMsg = document.createElement("div");
        document.body.appendChild(game.fishMissedMsg);


        this.canvas.addEventListener("click", function() {
           game.interval = window.setInterval(game.mainloop, 1000 / FPS);
        });  //starts the game when the canvas is clicked
    },
    mainloop: function() {  //the mainloop
        if(game.fish[0].x <= 0){  //if the fish dissapeared off the left of the screen
            for(var i = 0; i < game.fish.length; i ++){
                game.fish.splice(i, 1);
            }  //emptys the fish array

            for(var i = 0; i < FISH_PER_WAVE; i ++){
                game.fish[game.fish.length] = new fish();
            }  //and fills it up again with new fish

            game.totalFish += game.fish.length;

            game.penguin.ateFish = false;  //it will remain false until the fish come back

            if(game.currentRound % FISH_INTERVAL == 0){
                game.fishSpeed += FISH_ACCELERATION;
            }

            game.currentRound ++;
        }

        if(game.penguin.y >= SCREEN_HEIGHT || game.fishMissed > 20){  //if the penguin falls down
            document.body.innerHTML += "<br>GAME OVER!!! (reload this page and click on the game screen)<br>score: " + game.score;
            window.clearInterval(game.interval);  //stops the game
        }

        for(var i = 0; i < game.fish.length; i ++){  //for each fish
            if(game.fish[i].x <= (game.penguin.x + PENGUIN_WIDTH) &&
            (game.penguin.y + PENGUIN_HEIGHT) >= game.fish[i].y && game.penguin.y <=
            (game.fish[i].y + FISH_HEIGHT)){  //if the penguin collided with a fish
                if(! game.penguin.ateFish){  //if the penguin had'nt eaten any fish recently
                    //if we take out that condition the score will keep on
                    //increasing even while the penguin is still eating the
                    //fish
                    game.score ++;  //increases the score
                    game.penguin.ateFish = true;  //the penguin ate the fish
                }
            }
        }

        game.penguin.y += GRAVITY;  //makes the penguin fall down

        game.context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);  //clears the screen

        for(var i = 0; i < game.fish.length; i ++){
            game.context.drawImage(game.fishImg, game.fish[i].x, game.fish[i].y)
            game.fish[i].x -= game.fishSpeed;
        }  //draws the fish and makes the fish go left a bit
        game.context.drawImage(game.penguin.img, game.penguin.x, game.penguin.y);  //draws the
                                                                                   //penguin
        game.context.fillText("Score: " + game.score, 0, SCORE_Y);  //displays the score

        game.fishMissed = game.totalFish - game.score;

        game.fishMissedMsg.innerHTML = "Fish missed: " + game.fishMissed;

        }
};

game.load();  //loads the game
