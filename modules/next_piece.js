exports.postHandler = (req, res) => {
  const { pieces } = req.body;
  const coordinates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const scores = [];

  coordinates.forEach((i) => {
    coordinates.forEach((j) => {
      const item = {
        x: i,
        y: j,
      };
      item.score = getTotalScore(i, j, pieces);

      scores.push(item);
    })
  });

  const result = scores.sort((s1, s2) => s2.score - s1.score)[0]

  res.json({
    status: 0,
    data: result,
  });
}

function getTotalScore(i, j, pieces) {
  if (pieces.find(p => { return p.x === i && p.y === j })) {
    return 0;
  }

  let score = 1;

  const robotNum = getContinueNum({ x: i, y: j, piece_type: 1 }, pieces);
  const userNum = getContinueNum({ x: i, y: j, piece_type: 0 }, pieces);

  return 1 + robotNum + userNum * 1.5;

}

function getContinueNum(pieceCoordinate, pieces) {
  var count_horizontal = 1;
  var count_vertical = 1;
  var count_lb_rt = 1;
  var count_lt_rb = 1;

  count_horizontal = count_horizontal + countPieces(pieceCoordinate, [1, 0], pieces) + countPieces(pieceCoordinate, [-1, 0], pieces);
  count_vertical = count_vertical + countPieces(pieceCoordinate, [0, 1], pieces) + countPieces(pieceCoordinate, [0, -1], pieces);
  count_lb_rt = count_lb_rt + countPieces(pieceCoordinate, [-1, -1], pieces) + countPieces(pieceCoordinate, [1, 1], pieces);
  count_lt_rb = count_lt_rb + countPieces(pieceCoordinate, [-1, 1], pieces) + countPieces(pieceCoordinate, [1, -1], pieces);

  return getOneScore(count_horizontal) + getOneScore(count_vertical) + getOneScore(count_lb_rt) + getOneScore(count_lt_rb);
}

function getOneScore(num) {
  return num * num;
}

function countPieces(pieceCoordinate, vector, pieces) {
  var count = 0;
  var x = pieceCoordinate.x;
  var y = pieceCoordinate.y;

  for (var i = 0; i < 15; i++) {
    // out of bound
    x += vector[0];
    y += vector[1];
    if (x < 1 || y < 1 || x > 15 || y > 15) break;

    // not same piece
    var iteratedPos = pieces.find(function (p) { return p.x === x && p.y === y });
    if (!iteratedPos || iteratedPos.piece_type !== pieceCoordinate.piece_type) break;

    count++;
  }

  return count;
}
