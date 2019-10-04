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

        //Legal moves for active player where key is current position, values - possible moves
        legalMoves: {}
    };


    // Setting initial position for the game start in the database
    let initialArrangement =  function() {
        let xIndex, yIndex, cell;
        dataBase.black = [];
        dataBase.white = [];
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
    };


    //Cheking possible moves for the current player
    let possibleMoves = function(db) {

        if (db.activePlayer === 'white') {
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
        } else if (db.activePlayer === 'black') {
            for (position of db.black) {
                let xIndex, yIndex, posblXindex, posblYindex, posblPosition, posblYindexTwo;
                dataBase.posblMoves[position] = [];

                posblXindex = posblYindex = posblYindexTwo =  -1;
                xIndex = Number(position[0]);
                yIndex = Number(position[1]);

                if (xIndex < 7) {
                    posblXindex = xIndex + 1;

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

        } else {
            console.log(`Possible Moves Countinig Error`);
        }
    };

    //Cheking legal moves
    let checkLegalMoves = function(db) {
        
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

        calculateMoves: function() {
            possibleMoves(dataBase);
        },

        calculateLegalMoves: function() {
            checkLegalMoves(dataBase);
        },

        //Changing cheker's positions inside of database
        dataBaseMove: function (a, b) {
            let checkers = dataBase[dataBase.activePlayer];
            checkers.splice(checkers.indexOf(a), 1);
            checkers.push(b);
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

        // Removing all checkers images without database influence!!!
        clearBord: function() {
            let dataBase = dataController.getDataBase();
            let totalCheckersNumber = dataBase.white.length + dataBase.black.length;
            for (let i = 0; i < totalCheckersNumber; i++) {
                document.querySelector('.checker').remove('.checker');
            }
            document.getElementById('clear').classList.add('hidden');
            
        },
        
        // Showing all checkers on the board according to its database position
        displayPosition: function() {
            let black = dataController.getDataBase().black;
            let white = dataController.getDataBase().white;

            for (let i = 0; i < black.length; i++) {
                let id =  DOMstrings.cellPrefix + black[i];
                let field = document.getElementById(id);
                field.insertAdjacentHTML('afterbegin', DOMstrings.chekerBlackImage);
            }

            for (let i = 0; i < white.length; i++) {
                let id =  DOMstrings.cellPrefix + white[i];
                let field = document.getElementById(id);
                field.insertAdjacentHTML('afterbegin', DOMstrings.chekerWhiteImage);
            }
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
    let db = dataCtrl.getDataBase();


    // Awaiting listeners for buttons pushing
    let setupEventsListener = function() {
        document.getElementById(DOM.startButton).addEventListener('click', startGame);
        document.getElementById(DOM.restartButton).addEventListener('click', restartGame);
        document.getElementById(DOM.clearButton).addEventListener('click', UICtrl.clearBord);
    };


    //Awaiting listeners for inside of boar alerts
    let movingEventsListener = function() {
        var clickedID,  selectedID;
        let legalInitialPositions = [];
        let legalTargetPositions = [];

        selectedID = -1;

        // Listener for identification of chosen checker
        document.getElementById('board').addEventListener('click', function(e){  
            clickedID = e.target.closest('div').id;
            clickedID = clickedID.slice(3);


            //If chosen checker is able to move in this position we are moving
            if (legalTargetPositions.includes(clickedID) && legalInitialPositions.includes(selectedID)) {
                
                //Write this move to database
                dataCtrl.dataBaseMove(selectedID, clickedID);

                //Set values to 0 before next move
                clickedID = selectedID =  -1;
                legalInitialPositions = [];
                legalTargetPositions = [];

                //Refresh bord display
                UICtrl.clearBord();
                UICtrl.displayPosition();

                //Changing of active player
                dataCtrl.changeActivePlayer();

                // Calculate moves for the next player
                dataCtrl.calculateMoves();
                dataCtrl.calculateLegalMoves();
            }


            for (key in db.legalMoves) {
                legalInitialPositions.push(key);
            }


            if(clickedID) {
                //If chosen cheker is able to move we are saving it's coordinates and waiting for valid position where to move
                if (legalInitialPositions.includes(clickedID)) {
                    selectedID = clickedID;
                    legalTargetPositions = db.legalMoves[selectedID];
                }
            }
          });
        
    };

    // Starting the game with standart positioning
    let startGame = function() {
        
        dataCtrl.setInitialArrangement();
        UICtrl.displayPosition();
        UICtrl.hideElement(DOM.startButton);
        UICtrl.showElement(DOM.restartButton);
        UICtrl.showElement(DOM.clearButton);
        dataCtrl.calculateMoves();
        dataCtrl.calculateLegalMoves();
        movingEventsListener();
        
        
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

    }

}) (dataController, UIController);



controller.init();
