$(document).ready(function() {
  var sysArr = [],
    playArr = [],
    indexCount = -1,
    startArr = [0, 1, 3, 2, 3, 1, 0],
    count = 0,
    timer = 0,
    power = false,
    strict = false,
    running = false,
    lightTimer = [],
    id,
    errorSound = new Audio(
      "http://www.jarrodyellets.com/sounds/SimonError.mp3"
    ),
    endSound = new Audio("http://www.jarrodyellets.com/sounds/SimonEnd.mp3");
  padSounds = {
    pad0: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    pad1: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    pad2: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    pad3: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
  };

  // Power on game
  function powerOn() {
    if (power) {
      $("#count").css("color", "rgba(168, 0, 0, .8)");
      powerSeq(startArr, 100, 100);
      setTimeout(function() {
        updateCount(count);
      }, 1000);
    } else if (!power) {
      clearTimer();
      $("#count").css("color", "rgba(168, 0, 0, 0)");
      $("#strictLabel").removeClass("strictOn");
      updateCount(88);
      strict = false;
      resetVar();
      count = 0;
      lightTimer = [];
    }
  }

  // Sets timer for light interval
  function powerSeq(arr, time, timerPlus) {
    for (var i = 0; i < arr.length; i++) {
      lightUp(arr[i], time);
      timer += timerPlus;
    }
  }

  // Function for lighting and unlighting game pads
  function lightUp(i, time) {
    lightTimer.push(
      setTimeout(function() {
        id = "pad" + i;
        activate();
      }, timer)
    );
    dark = setTimeout(function() {
      deactivate();
    }, timer + time);
  }

  // Lights game pads
  function activate() {
    if (power) {
      $("#" + id).addClass(id + "On");
      padSounds[id].play();
    }
  }

  // Turns off game pads
  function deactivate() {
    $("#" + id).removeClass(id + "On");
  }

  function clearTimer() {
    lightTimer.forEach(function(timer) {
      clearTimeout(timer);
    });
  }

  // Computer plays through sequence
  function playGame() {
    running = true;
    power = true;
    timer = 0;
    indexCount = -1;
    lightTimer = [];
    playArr = [];
    if (count < 5) {
      powerSeq(sysArr, 300, 1000);
    } else if (5 <= count < 9) {
      powerSeq(sysArr, 300, 700);
    } else if (9 <= count < 13) {
      powerSeq(sysArr, 200, 500);
    } else if (count >= 13) {
      powerSeq(sysArr, 150, 400);
    }
    setTimeout(function() {
      running = false;
    }, timer);
  }

  // Move is added to sequence
  function nextSeq() {
    var compTurn = Math.round(Math.random() * 3);
    sysArr.push(compTurn);
  }

  // Count is updated in window
  function updateCount(num) {
    $("#count").empty();
    $("#count").append(num);
  }

  // Shows player they made wrong choice
  function wrongChoice() {
    errorSound.play();
    if (!strict) {
      updateCount("!!");
      setTimeout(playGame, 2000);
      setTimeout(function() {
        updateCount(count);
      }, 2000);
    } else if (strict) {
      updateCount("!!");
      setTimeout(resetGame, 2000);
    }
  }

  // Shows player they won the game
  function winGame() {
    endSound.play();
    updateCount("&diams;&diams;");
    setTimeout(resetGame, 2000);
  }

  // Reset variables
  function resetVar() {
    sysArr = [];
    playArr = [];
    timer = 0;
  }

  // Setup board for new game
  function resetGame() {
    resetVar();
    count = 1;
    power = false;
    indexCount = 0;
    running = true;
    nextSeq();
    updateCount(count);
    setTimeout(playGame, 1000);
  }

  // Computer Click Events
  $(".gamePad").mousedown(function() {
    if (power && !running) {
      id = $(this).attr("id");
      var idNum = Number(id[3]);
      playArr.push(idNum);
      indexCount++;
      if (playArr[indexCount] !== sysArr[indexCount] && sysArr.length > 0) {
        wrongChoice();
        return true;
      }
      activate();
      if (playArr.length === 20 && sysArr.length > 0) {
        winGame();
        running = true;
        return true;
      }
      if (playArr.length === sysArr.length) {
        count++;
        running = true;
        setTimeout(playGame, 1000);
        setTimeout(function() {
          updateCount(count);
        }, 1000);
        nextSeq();
      }
    }
  });
  $(".gamePad").mouseup(function() {
    deactivate();
  });
  $("#power").click(function() {
    power = !power;
    powerOn();
  });
  $("#start").on("click", function() {
    if (power) {
      resetGame();
      clearTimer();
    }
  });
  $("#strict").on("click", function() {
    if (power) {
      $("#strictLabel").toggleClass("strictOn");
      strict = !strict;
    }
  });
});