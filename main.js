$(document).ready(function() {
  var board = [];
  var huPlayer = "";
  var aiPlayer = "";
  var turn = 1;
  var terminal;

  choose();
  startGame();

  $("#aiWinner, #huWinner, #drawEnd, #chooseX, #chooseO, #aiTurn, #huTurn").hide();
  function choose() {
    $("#roleX").click(function() {
      $(this).removeClass("inactive").addClass("active");
      $("#roleX, #roleO").hide();
      $("#chooseX").show();
      $("#huTurn").show().fadeOut(5000);
      huPlayer = "X";
      aiPlayer = "O";
    });
    $("#roleO").click(function() {
      $(this).removeClass("inactive").addClass("active");
      $("#roleX, #roleO").hide();
      $("#chooseO").show();
      $("#huTurn").show().fadeOut(5000);
      huPlayer = "O";
      aiPlayer = "X";
    });
  }

  function startGame() {
    $(".grids, #cloud").empty();
    board = Array.from(Array(9).keys());
    if (turn % 2 == 0) {
      var arr = [
        0,
        2,
        4,
        6,
        8,
        0,
        2,
        4,
        6,
        8
      ];
      var m = Math.floor(Math.random() * 10);
      var x = arr[m];
      $("#" + x).html(aiPlayer);
      board[x] = aiPlayer;
      $("#aiTurn").show().fadeOut(3000);
    } else if (turn % 2 != 0 && turn > 2) {
      $("#huTurn").show().fadeOut(5000);
    }
    turn += 1;

    $(".grids").click(function() {
      var cell = $(this).attr("id");
      var pos = parseInt(cell);
      if (typeof board[pos] == "number") {
        $(this).html(huPlayer);
        board[pos] = huPlayer;
        var id = bestGrid();
        $("#" + id).html(aiPlayer);
        board[id] = aiPlayer;
        terminal = isFinal();
        if (terminal) {
          setTimeout(startGame, 2000);
        }
      }
    });
  }

  function isFinal() {
    var result = winOrLose();
    if (result === "aiWin") {
      $("#aiWinner").fadeIn(1000).fadeOut(2000);
      $("#huWinner, #drawEnd").hide();
      $(".grids").unbind("click");
      return true;
    } else if (result === "huWin") {
      $("#huWinner").fadeIn(1000).fadeOut(2000);
      $("#aiWinner, #drawEnd").hide();
      $(".grids").unbind("click");
      return true;
    } else if (isBoardFull() && result === "unknown") {
      $("#drawEnd").fadeIn(1000).fadeOut(2000);
      $("#aiWinner, #huWinner").hide();
      return true;
    }
    return false;
  }

  function emptyGrids(board) {
    var arr = [];
    for (var m = 0; m < 9; m++) {
      if (typeof board[m] == "number") {
        arr.push(m);
      }
    }
    return arr;
  }

  function bestGrid() {
    return minimax(board, aiPlayer).index;
  }
  // minimax function was based on a youtube tutorial
  //video made by free code camp on 17/11/17:
  // https://www.youtube.com/watch?v=P2TcQ3h0ipQ
  function minimax(nextBoard, player) {
    var emptyPos = emptyGrids(nextBoard);
    var winner = winOrLose();
    if (winner === "aiWin") {
      return {score: 10};
    } else if (winner === "huWin") {
      return {score: -10};
    } else if (emptyPos.length === 0) {
      return {score: 0};
    }

    var actions = [];
    emptyPos.forEach(function(element) {
      var action = {};
      action.index = nextBoard[element];
      nextBoard[element] = player;
      if (player == aiPlayer) {
        var result = minimax(nextBoard, huPlayer);
        action.score = result.score;
      } else {
        var result = minimax(nextBoard, aiPlayer);
        action.score = result.score;
      }
      nextBoard[element] = action.index;
      actions.push(action);
    });

    var bestAction;
    if (player === aiPlayer) {
      var bestScore = -10000;
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].score > bestScore) {
          bestScore = actions[i].score;
          bestAction = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < actions.length; i++) {
        if (actions[i].score < bestScore) {
          bestScore = actions[i].score;
          bestAction = i;
        }
      }
    }
    return actions[bestAction];
  }

  function isBoardFull() {
    for (var s = 0; s < board.length; s++) {
      if (typeof board[s] === "number") {
        return false;
      }
    }
    return true;
  }

  function winOrLose() {
    var final = "";
    var winComposite = [
      [
        0, 1, 2
      ],
      [
        3, 4, 5
      ],
      [
        6, 7, 8
      ],
      [
        0, 3, 6
      ],
      [
        1, 4, 7
      ],
      [
        2, 5, 8
      ],
      [
        0, 4, 8
      ],
      [
        2, 4, 6
      ]
    ];
    for (var i = 0; i < 9; i++) {
      var aiOutcome = winComposite.filter(function(arr) {
        return (board[arr[0]] == board[arr[1]] && board[arr[0]] == board[arr[2]] && board[arr[0]] == aiPlayer);
      });
    }

    for (var i = 0; i < 9; i++) {
      var huOutcome = winComposite.filter(function(arr) {
        return (board[arr[0]] == board[arr[1]] && board[arr[0]] == board[arr[2]] && board[arr[0]] == huPlayer);
      });
    }

    if (aiOutcome.length > 0) {
      final = "aiWin";
    } else if (huOutcome.length > 0) {
      final = "huWin";
    } else {
      final = "unknown";
    }
    return final;
  }
});
