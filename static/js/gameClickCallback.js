function setupGameClickCallback() {
    mainGame.display.clickedPiece = null;

    $("#board").on("click", "div", function () {
        if (mainGame.done) {
            return false;
        }

        if (!mainGame.display.clickedPiece) {
            mainGame.display.clickedPiece = mainGame.board.pieceAtPoint(mainGame.display.pointAtSquareElement(this));

            if (!mainGame.display.clickedPiece) {
                mainGame.display.clickedPiece = null;
                return false;
            }

            if (!mainGame.performLocalProcessing) {
                if (mainGame.color === null) {
                    mainGame.display.clickedPiece = null;

                    invalidMoveDialog("You're just watching!");
                    return false;
                }

                if (mainGame.display.clickedPiece.color !== mainGame.color) { //You clicked on the other player's piece
                    mainGame.display.clickedPiece = null;

                    invalidMoveDialog("That's not your piece!");
                    return false;
                }
            }

            if (!(mainGame.display.clickedPiece.color === "white") === mainGame.whiteMove) { //User clicked on a piece which is not allowed to move
                mainGame.display.clickedPiece = null;

                if (mainGame.performLocalProcessing) {
                    invalidMoveDialog("That's not your piece!");
                }
                else {
                    invalidMoveDialog("It's not your turn!");
                }
                return false;
            }

            mainGame.updateView();
            return true;
        }
        else {
            var newLocation = mainGame.display.pointAtSquareElement(this);

            if (newLocation) {
                if (mainGame.display.clickedPiece.location.isEqual(newLocation)) { //User unclicked the piece that was currently selected
                    mainGame.display.clickedPiece = null;
                    mainGame.display.update();
                    return false;
                }
                else if (mainGame.board.pieceAtPoint(newLocation) && mainGame.board.pieceAtPoint(newLocation).color == mainGame.display.clickedPiece.color) { //User selected a different piece of his color
                    mainGame.display.clickedPiece = mainGame.board.pieceAtPoint(newLocation);
                    mainGame.display.update();
                    return false;
                }

                var move = new Move(mainGame.display.clickedPiece, newLocation);

                if (!mainGame.executeMove(move)) { //User's move was invalid
                    invalidMoveDialog("That move isn't allowed!");
                    return false;
                }
            }

            mainGame.display.clickedPiece = null;
            mainGame.tick();
            mainGame.updateView();
            if (mainGame.performLocalProcessing) {
                saveGame(mainGame);
            }
            return true;
        }
    });
}