var mongoose = require('mongoose');
var gameSchema = mongoose.Schema({

        playerX: String,
        playerO: String,
        playerX_turn: {type: Boolean, default: true},
        board: {topLeft: {type: String, default: ""}, topMid: {type: String, default: ""}, topRight: {type: String, default: ""},
                midLeft: {type: String, default: ""}, midMid: {type: String, default: ""}, midRight: {type: String, default: ""},
                botLeft: {type: String, default: ""}, botMid: {type: String, default: ""}, botRight: {type: String, default: ""}},
        winner: String
});

gameSchema.methods.emptySquares = function(){
  //looks at board, tells empty squares
  //tie game scenario: no winners no remaining plays
  return boardToArray(this.board).indexOf("") !== -1;
}

gameSchema.methods.winGame = function() {
  var boardArr = boardToArray(this.board);
  for (var i=0; i<boardArr.length; i+=3) {
console.log("line 22")
    if (boardArr[i] === boardArr[i+1] && boardArr[i+1] === boardArr[i+2] && boardArr[i] !== "") {
      this.winner = boardArr[i]
      console.log("Before return true")
      return true;
    }
  }
  console.log("Before return false")
  return false;
}

function boardToArray(board){
  return [board.topLeft, board.topMid, board.topRight,
          board.midLeft, board.midMid, board.midRight,
          board.botLeft, board.botMid, board.botRight];
}


//userSchema.methods.validPassword = function(password) {
//    return bcrypt.compareSync(password, this.local.password);

module.exports = mongoose.model('Game', gameSchema);
