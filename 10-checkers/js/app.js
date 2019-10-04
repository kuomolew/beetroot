// Data controller
let dataController = (function() {

    //Position of all chekers on the board
    let dataBase = {
        //Positions of black and white chekers
        black: [],
        white: [],
        activePlayer: 'white',

        //All theoretical moves for active player, without calculating of position of another chekers on the board
        posblMoves: {},

        //Legal moves for active player where key is current position, value - possible moves
        legalMoves: {}
    };


    // Setting initial position for the game start in the database
    let initialArrangement =  function() {
        let xIndex, yIndex, cell;
        for (let i = 0; i < 8; i++ ){
            xIndex = i;
            if (xIndex % 2 === 0) {
                for (let j = 1; j < 8; j+=2) {
                    yIndex = j;
                    cell = xIndex.toString() + yIndex.toString();
                    if (xIndex < 3) {
                        dataBase.black.push(cell);
                    } else if (xIndex > 4) {
                        dataBase.white.push(cell);
                    } 
                };
            } else {
                for (let j = 0; j < 8; j+=2) {
                    yIndex = j;
                    cell = xIndex.toString() + yIndex.toString();
                    if (xIndex < 3) {
                        dataBase.black.push(cell);
                    } else if (xIndex > 4) {
                        dataBase.white.push(cell);
                    }
                }
            }
        }
        dataBase.black.push('black');
        dataBase.white.push('white');
    };

    //Storing possible moves for the players
    // let posblMoves = {};

    //Cheking possible moves for the white one
    let possibleMovesWhite = function(db) {
        for (position of db.white) {
            let xIndex, yIndex, posblXindex, posblYindex, posblPosition, posblYindexTwo;
            dataBase.posblMoves[position] = [];

            posblXindex = posblYindex = posblYindexTwo =  -1;
            xIndex = Number(position[0]);
            yIndex = Number(position[1]);

            if (xIndex > 0) {
                posblXindex = xIndex - 1;

                if (yIndex === 0) {
                    posblYindex = yIndex + 1;
                } else if (yIndex === 7) {
                    posblYindex = yIndex - 1;
                } else {
                    posblYindex = yIndex - 1;
                    posblYindexTwo = yIndex + 1;
                }
                
                if(posblYindexTwo !== -1 ) {
                    posblPosition = posblXindex.toString() + posblYindex.toString();
                    dataBase.posblMoves[position].push(posblPosition);
                    posblPosition = posblXindex.toString() + posblYindexTwo.toString();
                    dataBase.posblMoves[position].push(posblPosition);
                } else {
                    posblPosition = posblXindex.toString() + posblYindex.toString();
                    dataBase.posblMoves[position].push(posblPosition);
                }
            }
        }
    };

    //Cheking legal moves
    let checkLegalMovies = function(db) {
        
        for (key in db.posblMoves) {
            let moves = db.posblMoves[key];
            db.legalMoves[key] = [];
            for (move of moves) {
                if (!db.white.includes(move) && !db.black.includes(move)) {
                    db.legalMoves[key].push(move);
                }
            }
        }
        for (key in db.legalMoves){
            let moves = db.legalMoves[key];
            if (!moves[0]) {
                delete db.legalMoves[key];
            }
        }
        
    };

    let movingEventsListener = function() {
        var chosenID;
        document.querySelector('#board').addEventListener('click', function(e){  
            chosenID = e.target.closest('div').id;
            // console.log(chosenID);
            chosenID = chosenID.slice(3);
            // console.log(chosenID);

            let legalInitialPositions = [];
            for (key in dataBase.legalMoves) {
                legalInitialPositions.push(key);
                // console.log(legalInitialPositions);
            }

            // console.log(legalInitialPositions);
            if(chosenID) {
                console.log(chosenID);
                console.log(legalInitialPositions);
                if (legalInitialPositions.includes(chosenID)) {
                    console.log('Move is possible');
                } else {
                    console.log('Move is impossible');
                }
                




            }




          });
        
    };
    
    return {
        // Setting initial position for the game start in the database
        setInitialArrangement: function() {
            initialArrangement();
        },

        //Returning game database outside of function
        getDataBase: function() {
            return dataBase;
        },

        // Changing of active player
        changeActivePlayer: function() {
            dataBase.activePlayer === 'white'? dataBase.activePlayer = 'black' : dataBase.activePlayer = 'white';
        },

        calculateMovesWhite: function() {
            possibleMovesWhite(dataBase);
            // console.log(dataBase.posblMoves);
        },

        calculateLegalMovies: function() {
            checkLegalMovies(dataBase);
            // console.log(dataBase.legalMoves);
        },

        movingEventsListen: function() {
            movingEventsListener();
        },

        testing: function() {
            console.log(dataBase);
        }
    };


})();


// Interface controller
let UIController = (function() {
    let DOMstrings = {
        chekerBlackImage: '<img src="img/black2.png" class="checker">',
        chekerWhiteImage: '<img src="img/white.png" class="checker">',
        startButton: 'start',
        restartButton: 'restart',
        clearButton: 'clear',
        cellPrefix: 'bc-',
        cell: '.cell'
    }

    return {
        // Hiding element chosen by ID
        hideElement: function(element) {
            document.getElementById(element).classList.add('hidden');
        },

        // Showing element chosen by ID
        showElement: function(element) {
            document.getElementById(element).classList.remove('hidden');
        },

        // Hiding all checkers without database influence!!!
        clearBord: function() {
            let dataBase = dataController.getDataBase();
            let totalCheckersNumber = dataBase.white.length + dataBase.black.length;
            for (let i = 0; i < totalCheckersNumber; i++) {
                document.querySelector('.checker').remove('.checker');
            }
            document.getElementById('clear').classList.add('hidden');
            
        },
        
        // Showing checkers of one color on the board according to its database initial position
        displayInitialPosition: function(color) {
            let totalCheckersCount = color.length - 1;
            for (let i = 0; i < totalCheckersCount; i++) {
                let id =  DOMstrings.cellPrefix + color[i];
                let field = document.getElementById(id);
                if (color[totalCheckersCount] === 'black') {
                    field.insertAdjacentHTML('afterbegin', DOMstrings.chekerBlackImage);
                } else {
                    field.insertAdjacentHTML('afterbegin', DOMstrings.chekerWhiteImage);
                }
            }
            color.pop();  
        },

        // Returning list of domstrings
        getDOMstrings: function() {
            return DOMstrings;
        }

        
    }

}) ();

//Global app controller
let controller = (function(dataCtrl, UICtrl) {
    let DOM = UICtrl.getDOMstrings();

    let moveBegin = function (id) {
        console.log('move on ' + id);
    }

    // Awaiting listeners for buttons pushing
    let setupEventsListener = function() {
        
        document.getElementById(DOM.startButton).addEventListener('click', startGame);
        document.getElementById(DOM.restartButton).addEventListener('click', restartGame);
        document.getElementById(DOM.clearButton).addEventListener('click', UICtrl.clearBord);
    };

    // Starting the game with standart positioning
    let startGame = function() {
        
        dataCtrl.setInitialArrangement();
        let db = dataCtrl.getDataBase();
        UICtrl.displayInitialPosition(db.black);
        UICtrl.displayInitialPosition(db.white);
        // console.log(db);
        UICtrl.hideElement(DOM.startButton);
        UICtrl.showElement(DOM.restartButton);
        UICtrl.showElement(DOM.clearButton);
        dataCtrl.calculateMovesWhite();
        dataCtrl.calculateLegalMovies();
        dataCtrl.movingEventsListen();
    }

    // Reloading the page
    let restartGame = function() {
        location.reload();
    }

    return {
        init: function() {
            console.log('It\'s alive...');
            setupEventsListener();
        }, 

        // movingListener: function() {
        //     console.log('movingListener on');
            
        // }

    }

}) (dataController, UIController);



controller.init();
// controller.movingListener();

// dataController.setInitialArrangement();
// // dataController.testing();

// let db = dataController.getDataBase();
// console.log(db);
// UIController.displayInitialPosition(db.black);
// UIController.displayInitialPosition(db.white);

// console.log(db);

