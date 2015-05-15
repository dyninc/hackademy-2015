/**
 * The current turn state of the game. This effectively indicates which user's
 * turn it is
 * @type {string}
 */
var TURN_STATE = "X";

/**
 * Hardcoded list of all of our board's td ids
 * @type {Array}
 */
var TILE_IDS = ["0_0", "0_1", "0_2",
                "1_0", "1_1", "1_2",
                "2_0", "2_1", "2_2"];

/**
 * Custom Array method that returns true if all values in an Array are the same
 */
Array.prototype.allValuesSame = function() {
    for(var i = 1; i < this.length; i++) {
        if(this[i] !== this[0]) {
            return false;
        }
    }
    return true;
}

/**
 * Function which determines whether the last click (at cell idx) has
 * succesfully caused the game to be solved. Returns true if the last move
 * solved the game, false otherwise.
 */
var solved = function(idx) {
    var state_class = TURN_STATE == "X" ? "ex" : "oh";

    /**
     * Inner solved function that determines if the last move won the game by
     * solving vertically
     */
    var solved_vert = function() {
        var col = idx.split("_")[1];

        for (var i = 0; i < 3; i++) {
            var test_id = "#" + i.toString() + "_" + col;
            var $span = $($(test_id).children()[0]);
            if($span.attr("class") != state_class) {
                return false;
            }
        };

        return true;
    };

    /**
     * Inner solved function that determines if the last move won the game by
     * solving horizontally
     */
    var solved_hor = function() {
        var row = idx.split("_")[0];

        for (var i = 0; i < 3; i++) {
            var test_id = "#" + row + "_" + i.toString();
            var $span = $($(test_id).children()[0]);
            if($span.attr("class") != state_class) {
                return false;
            }
        };

        return true;
    };

    /**
     * Inner solved function that determines if the last move won the game by
     * solving diagonally. This is a bit hacky, but hey, it works.
     */
    var solved_diag = function() {
        var valid_ids = ["0_0", "0_2",
                         "1_1",
                         "2_0", "2_2"];
        if(valid_ids.indexOf(idx) != -1) {
            var ltr = ["0_0", "1_1", "2_2"];
            var btt = ["2_0", "1_1", "0_2"];
            var classes = [];

            for (var i = 0; i < ltr.length; i++) {
                var test_id = "#" + ltr[i];
                var $span = $($(test_id).children()[0]);
                classes.push($span.attr("class"));
            };

            // If the span has had it's class set, and the entire diagonal
            // matches, then return true
            if(classes.indexOf(undefined) == -1 && classes.indexOf("") == -1 && classes.allValuesSame()) {
                return true;
            }

            classes = [];
            for (var i = 0; i < btt.length; i++) {
                var test_id = "#" + btt[i];
                var $span = $($(test_id).children()[0]);
                classes.push($span.attr("class"));
            };

            // If the span has had it's class set, and the entire diagonal
            // matches, then return true
            if(classes.indexOf(undefined) == -1 && classes.indexOf("") == -1 && classes.allValuesSame()) {
                return true;
            }
        }
        return false;
    };

    // If any of the solutions returned true, then return true. Otherwise return
    // false. Note that chaining the logical ORs together like this will lazily
    // evaluate the additional solved_* functions. Ie, if solved_vert returns
    // true, solved_hor won't run because we've already determined the
    // truthiness of the statement.
    return solved_vert() || solved_hor() || solved_diag();
}

/**
 * This function determines if the game has ended in a draw. Returns true if
 * the game board is full, and neither player has succesfully won. Returns
 * false otherwise.
 */
var no_winners = function() {
    var classes = [];
    for(var i = 0; i < TILE_IDS.length; i++) {
        var cell_id = "#" + TILE_IDS[i];
        var $span = $($(cell_id).children()[0]);
        classes.push($span.attr("class"));
    };
    if(classes.indexOf(undefined) == -1 && classes.indexOf("") == -1) {
        return true;
    }
    return false;
}

/**
 * Clear the entire board and reset each tile to it's original state
 */
var reset_board = function() {
    TILE_IDS.forEach(function(idx){
        var real_id = "#" + idx;
        var classes = ["ex", "oh"];
        var $span = $($(real_id).children()[0]);
        $span.removeClass($span.attr("class"));
        $span.text("");
    });
}

/**
 * On page load, attach a call back to all of our board tiles to determine what
 * shape is to be placed on the tile for this turn. Then change to the other
 * user's turn
 */
$(document).ready(function() {
    // Add the appropriate callback to the reset button
    $(document).on("click", "#resetbtn", function() {
        reset_board();
    });

    // For each tile, add an on_click callback that checks to see if the click
    // event has caused the current player to win the game
    TILE_IDS.forEach(function(idx){
        var real_id = "#" + idx;
        var classes = ["ex", "oh"];
        $(document).on('click', real_id, function() {
            var $span = $($(real_id).children()[0]);
            var state_class = TURN_STATE == "X" ? "ex" : "oh";

            // Fail early if we've clicked on a tile that's already set, don't
            // want to allow players to undo other player's moves
            if(classes.indexOf($span.attr("class")) != -1) {
                return;
            }

            // Set the text of the span to the current value of TURN_STATE
            $span.text(TURN_STATE)

            // Switch on the current turn state to assign the appropriate CSS
            // class to the current span, and determine if the current user has
            // won. If the current user has won, reset the board and allow the
            // loser to play first on the next round. If the current move did
            // not win the game, update TURN_STATE to indicate that it's the
            // next player's turn.
            switch(TURN_STATE) {
                case "X":
                    $span.toggleClass("ex")
                    if(solved(idx)) {
                        alert(TURN_STATE + " WINS!");
                        reset_board();
                    }
                    TURN_STATE = "O"
                    break;
                default:  // case "O"
                    $span.toggleClass("oh")
                    if(solved(idx)) {
                        alert(TURN_STATE + " WINS!");
                        reset_board();
                    }
                    TURN_STATE = "X"
            }

            // Check to see if we've hit a draw. If so, alert the user and reset
            // the game.
            if(no_winners()) {
                alert("No Winner :(");
                reset_board();
            }

            // Indicate to the user who's turn it is by updating the turn piece
            // of the table caption
            $("#turn").text(TURN_STATE);
        });
    });
});
