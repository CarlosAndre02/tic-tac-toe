const Modal = {
  modalElement: document.querySelector(".modal-overlay"),
  modalTitleTextElement: document.getElementById("modal-title"),
  modalBtn: document.getElementById("modal-button"),

  open() {
    Modal.modalElement.classList.add("active");
  },
  close() {
    Modal.modalElement.classList.remove("active");
  },
  addModalMessage(message) {
    Modal.modalTitleTextElement.innerText = message;
  },
};

const Scores = {
  playerScoreElement: document.getElementById("scores-player-value"),
  AIScoreElement: document.getElementById("scores-ai-value"),
  playerScores: 0,
  AIScores: 0,

  updateScores() {
    Scores.playerScoreElement.innerText = Scores.playerScores;
    Scores.AIScoreElement.innerText = Scores.AIScores;
  },
};

const TicTacToe = {
  squareElements: document.querySelectorAll(".square"),
  squareObjects: [],
  xImg: '<img src="./images/x.svg" alt="X Image">',
  circleImg: '<img src="./images/circle.svg" alt="Circle Image">',

  events() {
    TicTacToe.squareElements.forEach((square) => {
      TicTacToe.createSquareObjs(square);

      square.addEventListener("click", () => {
        TicTacToe.managePlays(square);
      });
    });
    
    Modal.modalBtn.addEventListener("click", () => {
      Scores.updateScores();
      TicTacToe.clearSquare();
      Modal.close();
    });
  },

  createSquareObjs(squareElement) {
    const square = {
      index: squareElement.id,
      typeSquare: "",
    };
    TicTacToe.squareObjects.push(square);
  },

  updateSquare() {
    TicTacToe.squareElements.forEach((squareElement) => {
      TicTacToe.squareObjects.find((squareObj) => {
        if (squareObj.index === squareElement.id)
          squareElement.innerHTML = squareObj.typeSquare;
        return;
      });
    });
  },

  clearSquare() {
    TicTacToe.squareElements.forEach((squareElement) => {
      squareElement.innerHTML = "";
    });
    TicTacToe.squareObjects.forEach((squareObj) => {
      squareObj.typeSquare = "";
    });
  },

  managePlays(squareSelectedFromPlayer) {
    if (!TicTacToe.isSquareAvailable(squareSelectedFromPlayer.id)) return;

    let isWinner;
    Player.makePlay(squareSelectedFromPlayer);
    isWinner = TicTacToe.checkResult("player");
    if (isWinner) return TicTacToe.winnerResult("player");

    if (TicTacToe.isDraw()) return TicTacToe.winnerResult("draw");

    AI.makePlay();
    isWinner = TicTacToe.checkResult("AI");
    if (isWinner) TicTacToe.winnerResult("AI");
  },

  checkResult(caller) {
    const squareImage = caller == "player" ? TicTacToe.xImg : TicTacToe.circleImg;
    const squaresSelected = TicTacToe.squareObjects.filter(
      (square) => square.typeSquare === squareImage
    );
    return TicTacToe.isThereWinner(squaresSelected);
  },

  isThereWinner(squaresSelected) {
    const victoryPossibilities = [
      ["0x0", "0x1", "0x2"],
      ["1x0", "1x1", "1x2"],
      ["2x0", "2x1", "2x2"],
      ["0x0", "1x0", "2x0"],
      ["0x1", "1x1", "2x1"],
      ["0x2", "1x2", "2x2"],
      ["0x0", "1x1", "2x2"],
      ["0x2", "1x1", "2x0"],
    ];

    let isWinner = false;
    victoryPossibilities.forEach((possibility) => {
      let points = 0;
      squaresSelected.forEach((square) => {
        if ([possibility[0], possibility[1], possibility[2]].includes(square.index)) 
          points++;
      });
      if (points === 3) isWinner = true;
    });
    return isWinner;
  },

  winnerResult(winner) {
    Modal.open();
    if (winner == "player") {
      Modal.addModalMessage("Você ganhou!!!");
      Scores.playerScores++;
    } else if (winner == "AI") {
      Modal.addModalMessage("Você perdeu!!!");
      Scores.AIScores++;
    } else {
      Modal.addModalMessage("Empate!!!");
    }
  },

  isDraw() {
    const isThereSquareAvailable = TicTacToe.squareObjects.every(
      (square) => square.typeSquare !== ""
    );
    return isThereSquareAvailable;
  },

  isSquareAvailable(index) {
    const square = TicTacToe.squareObjects.find(
      (square) => square.index === index
    );
    return square.typeSquare == "";
  },
};

const Player = {
  makePlay(squareElement) {
    TicTacToe.squareObjects.find((squareObj) => {
      if (squareObj.index === squareElement.id) {
        squareObj.typeSquare = TicTacToe.xImg;
        return;
      }
    });
    TicTacToe.updateSquare();
  },
};

const AI = {
  makePlay() {
    const rowNumber = Math.floor(Math.random() * 3);
    const columnNumber = Math.floor(Math.random() * 3);
    const squareIndex = `${rowNumber}x${columnNumber}`;

    if (!TicTacToe.isSquareAvailable(squareIndex)) return AI.makePlay();

    TicTacToe.squareObjects.find((square) => {
      if (squareIndex === square.index) {
        square.typeSquare = TicTacToe.circleImg;
        return;
      }
    });
    TicTacToe.updateSquare();
  },
};

TicTacToe.events();
