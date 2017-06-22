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

  return 1 + userNum * 1.5;

}

function getContinueNum(pieceCoordinate, pieces) {
  var count_l = countPieces(pieceCoordinate, [-1, 0], pieces) + checkPoint(pieceCoordinate, [1, 0], pieces);
  var count_r = countPieces(pieceCoordinate, [1, 0], pieces) + checkPoint(pieceCoordinate, [-1, 0], pieces);
  var count_t = countPieces(pieceCoordinate, [0, 1], pieces) + checkPoint(pieceCoordinate, [0, -1], pieces);
  var count_b = countPieces(pieceCoordinate, [0, -1], pieces) + checkPoint(pieceCoordinate, [0, 1], pieces);
  var count_lt = countPieces(pieceCoordinate, [-1, 1], pieces) + checkPoint(pieceCoordinate, [1, -1], pieces);
  var count_rt = countPieces(pieceCoordinate, [1, 1], pieces) + checkPoint(pieceCoordinate, [-1, -1], pieces);
  var count_lb = countPieces(pieceCoordinate, [-1, -1], pieces) + checkPoint(pieceCoordinate, [1, 1], pieces);
  var count_rb = countPieces(pieceCoordinate, [1, -1], pieces) + checkPoint(pieceCoordinate, [-1, 1], pieces);

  return getOneScore(count_l) + getOneScore(count_r) + getOneScore(count_t) + getOneScore(count_b) + getOneScore(count_lt) + getOneScore(count_rt) + getOneScore(count_lb) + getOneScore(count_rb);
}

function getOneScore(num) {
  if (num >= 3) {
    return num * num;
  } else {
    return num
  }
}

function checkPoint(pieceCoordinate, vector, pieces) {
  var x = pieceCoordinate.x + vector.x;
  var y = pieceCoordinate.y + vector.y;
  if (pieces.find(p => p.x === x && p.y === y)) {
    return 0;
  } else {
    return 0.5;
  }
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
