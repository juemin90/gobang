$(function () {
})

var PIECE_NUM = 0;
var PIECE_COORDINATE = [];
var MY_TURN = true;

$(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b69b4c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  init(ctx);
  initEvent(ctx);
})

function init(ctx) {
  for (var i = 0; i < 15; i ++) {
    var start = 20 + 30 * i;
    var end = 20 + 30 * i;

    if (i === 0 || i === 14) {
      ctx.lineWidth = 2;
    } else {
      ctx.lineWidth = 1;
    }
    ctx.beginPath();

    ctx.moveTo(20, start);
    ctx.lineTo(440, end);
    ctx.stroke();

    ctx.moveTo(start, 20);
    ctx.lineTo(end, 440);
    ctx.stroke();
    ctx.closePath();
  }

  var dots = [4, 8, 12];
  dots.forEach(d1 => {
    dots.forEach(d2 => {
      ctx.beginPath();
      var x = 20 + (d1 - 1) * 30;
      var y = 20 +(d2 - 1) * 30;

      ctx.arc(x, y, 5, 0, 360, false);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    })
  })
}

function initEvent(ctx) {
  var canvas = document.getElementById('canvas');
  canvas.addEventListener('click', function (evt) {
    if (!MY_TURN) return;
    var mousePos = getMousePos(canvas, evt)
    addPiece(mousePos, ctx);
    MY_TURN = !MY_TURN;
    robotTurn(ctx);
  });
}

function getMousePos(canvas, evt) {
  if (evt.clientX < 20 || evt.clientY < 20 || evt.clientX > 440 || evt.clientY > 440) return;
  var rect = canvas.getBoundingClientRect();
  var mousePos = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };

  var pieceCoordinate = getPieceCoordinate(mousePos);
  return {
    x: pieceCoordinate.x,
    y: pieceCoordinate.y,
    piece_type: PIECE_NUM % 2,
  };
}

function addPiece(pieceCoordinate, ctx) {
  if (PIECE_COORDINATE.find(function (c) {
    return c.x === pieceCoordinate.x && c.y === pieceCoordinate.y;
  })) return;

  var x = 20 + 30 * (pieceCoordinate.x - 1);
  var y = 20 + 30 * (pieceCoordinate.y - 1);

  ctx.beginPath();
  ctx.arc(x, y, 13, 0, 360, false);
  ctx.fillStyle = PIECE_NUM % 2 === 1 ? "black" : 'white';
  ctx.fill();
  ctx.closePath();

  PIECE_NUM++;
  PIECE_COORDINATE.push(pieceCoordinate);
  var result = judge(pieceCoordinate);
  console.log(result);

  if (result === 0) {
    setTimeout(function () {
      alert('white wins');
    }, 100)
  } else if (result === 1){
    setTimeout(function () {
      alert('black wins');
    }, 100)
  }
}

function robotTurn(ctx) {
  $.ajax({
    contentType: 'application/json',
    url: '/api/next_piece',
    type: 'POST',
    data: JSON.stringify({
      pieces: PIECE_COORDINATE,
    }),
    success: function (res) {
      MY_TURN = !MY_TURN;
      addPiece(res.data, ctx);
    }
  })
}

function getPieceCoordinate(mousePos) {
  var x =  Math.round((mousePos.x - 20) / 30) + 1;
  var y =  Math.round((mousePos.y - 20) / 30) + 1;

  return { x: x, y: y };
}

function judge(pieceCoordinate) {
  var pieces = PIECE_COORDINATE.filter(function (p) { return p.piece_type === pieceCoordinate.piece_type; })
  if (pieces.length < 5) return false;

  var count_horizontal = 1;
  var count_vertical = 1;
  var count_lb_rt = 1;
  var count_lt_rb = 1;

  count_horizontal = count_horizontal + countPieces(pieceCoordinate, [1, 0]) + countPieces(pieceCoordinate, [-1, 0]);
  count_vertical = count_vertical + countPieces(pieceCoordinate, [0, 1]) + countPieces(pieceCoordinate, [0, -1]);
  count_lb_rt = count_lb_rt + countPieces(pieceCoordinate, [-1, -1]) + countPieces(pieceCoordinate, [1, 1]);
  count_lt_rb = count_lt_rb + countPieces(pieceCoordinate, [-1, 1]) + countPieces(pieceCoordinate, [1, -1]);
  console.log(pieceCoordinate.piece_type, count_horizontal, count_vertical, count_lb_rt, count_lt_rb)

  if ([count_horizontal, count_vertical, count_lb_rt, count_lt_rb].indexOf(5) > -1) {
    console.log(pieceCoordinate);
    return pieceCoordinate.piece_type
  }
}

function countPieces(pieceCoordinate, vector) {
  var count = 0;
  var x = pieceCoordinate.x;
  var y = pieceCoordinate.y;

  for (var i = 0; i < 15; i++) {
    // out of bound
    x += vector[0];
    y += vector[1];
    if (x < 1 || y < 1 || x > 15 || y > 15) break;

    // not same piece
    var iteratedPos = PIECE_COORDINATE.find(function (p) { return p.x === x && p.y === y });
    if (!iteratedPos || iteratedPos.piece_type !== pieceCoordinate.piece_type) break;

    count++;
  }

  return count;
}
