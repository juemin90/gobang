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

      if (i === 7 && j === 8) {
        console.log('score', item.score)
      }
      scores.push(item);
    })
  });

  const sorted_result = scores.sort((s1, s2) => s2.score - s1.score);

  res.json({
    status: 0,
    data: sorted_result[0],
  });
}

function getTotalScore(i, j, pieces) {
  if (pieces.find(p => { return p.x === i && p.y === j })) {
    return 0;
  }

  let score = 1;

  // const robotNum = getContinueNum({ x: i, y: j, piece_type: 1 }, pieces);
  const userNum = defence({ x: i, y: j, piece_type: 0 }, pieces);
  if (i === 7 && j === 8) {
    console.log('user_num', userNum)
  }

  return 1 + userNum;

}

function defence(pieceCoordinate, pieces) {
  var count_l = countPieces(pieceCoordinate, [-1, 0], pieces, 0);
  var reverse_l = checkPoint(pieceCoordinate, [-1, 0], pieces, count_l);
  var l = {
    direction: 'l',
    count: count_l,
    reverse:reverse_l,
  };

  var count_r = countPieces(pieceCoordinate, [1, 0], pieces, 0);
  var reverse_r = checkPoint(pieceCoordinate, [1, 0], pieces, count_r);
  var r = {
    direction: 'r',
    count: count_r,
    reverse:reverse_r,
  };

  var count_t = countPieces(pieceCoordinate, [0, 1], pieces, 0);
  var reverse_t = checkPoint(pieceCoordinate, [0, 1], pieces, count_t);
  var t = {
    direction: 't',
    count: count_t,
    reverse:reverse_t,
  };

  var count_b = countPieces(pieceCoordinate, [0, -1], pieces, 0);
  var reverse_b = checkPoint(pieceCoordinate, [0, -1], pieces, count_b);
  var b = {
    direction: 'b',
    count: count_b,
    reverse:reverse_b,
  };

  var count_lt = countPieces(pieceCoordinate, [-1, 1], pieces, 0) ;
  var reverse_lt = checkPoint(pieceCoordinate, [1, 1], pieces, count_lt);
  var lt = {
    direction: 'lt',
    count: count_lt,
    reverse:reverse_lt,
  };

  var count_rt = countPieces(pieceCoordinate, [1, 1], pieces, 0);
  var reverse_rt = checkPoint(pieceCoordinate, [1, 1], pieces, count_rt);
  var rt = {
    direction: 'rt',
    count: count_rt,
    reverse:reverse_rt,
  };

  var count_lb = countPieces(pieceCoordinate, [-1, -1], pieces, 0);
  var reverse_lb = checkPoint(pieceCoordinate, [-1, -1], pieces, count_lb);
  var lb = {
    direction: 'lb',
    count: count_lb,
    reverse:reverse_lb,
  };

  var count_rb = countPieces(pieceCoordinate, [1, -1], pieces, 0);
  var reverse_rb = checkPoint(pieceCoordinate, [1, -1], pieces, count_rb);
  var rb = {
    direction: 'rb',
    count: count_rb,
    reverse:reverse_rb,
  };

  var counts = [l, r, t, b, lt, rt, lb, rb];
  if (pieceCoordinate.x === 7 && pieceCoordinate.y === 8) {
    console.log(counts);
  }

  const four_empty = counts.filter(c => c.count === 4 && c.reverse === 0).length;
  const four_full = counts.filter(c => c.count === 4 && c.reverse === 1).length;
  const three_empty = counts.filter(c => c.count === 3 && c.reverse === 0).length;
  const three_full = counts.filter(c => c.count === 3 && c.reverse === 1).length;
  const two_empty = counts.filter(c => c.count === 2 && c.reverse === 0).length;
  const two_full = counts.filter(c => c.count === 2 && c.reverse === 1).length;
  const one_empty = counts.filter(c => c.count === 1 && c.reverse === 0).length;
  const one_full = counts.filter(c => c.count === 1 && c.reverse === 1).length;

  if (pieceCoordinate.x === 7 && pieceCoordinate.y === 8) {
    console.log('fe', four_empty, 'ff', four_full, 'te', three_empty, 'tf', three_full, 'te', two_empty, 'tf', two_full, 'oe', one_empty, 'of', one_full);
  }

  return four_empty * 50000 + four_full * 15000 + three_empty * 5000 + three_full * 50 + two_empty * 50 + two_full * 1 + one_empty * 1 + one_full * 1;

}

function getOneScore(num) {
  if (num >= 3) {
    return num * num;
  } else {
    return num
  }
}

function checkPoint(pieceCoordinate, vector, pieces, length) {
  var x = pieceCoordinate.x + vector[0] * length;
  var y = pieceCoordinate.y + vector[1] * length;
  var result;
  if (pieces.find(p => p.x === x && p.y === y)) {
    result = 0;
  } else {
    result = 1;
  }

  return result;
}

function countPieces(pieceCoordinate, vector, pieces, piece_type) {
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
    if (!iteratedPos || iteratedPos.piece_type !== piece_type) break;

    count++;
  }

  return count;
}
