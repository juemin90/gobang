var PIECE_NUM = 0;
var PIECE_COORDINATE = [];

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
    var mousePos = getMousePos(canvas, evt)
    addPiece(mousePos, ctx);
  });
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function addPiece(mousePos, ctx) {
  if (mousePos.x < 20 || mousePos.y < 20 || mousePos.x > 440 || mousePos.y > 440) return;

  var pieceCoordinate = getPieceCoordinate(mousePos);
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
  console.log(PIECE_COORDINATE);

  if (!judge()) return;
  if (judge() === 1) {
    setTimeout(function () {
      alert('black wins');
      init(ctx);
    }, 100)
  } else if (judge() === 0) {
    setTimeout(function () {
      alert('white wins');
      init(ctx);
    }, 100)
  }
}

function getPieceCoordinate(mousePos) {
  var x =  Math.round((mousePos.x - 20) / 30) + 1;
  var y =  Math.round((mousePos.y - 20) / 30) + 1;

  return { x: x, y: y, piece_type: PIECE_NUM % 2 };
}

function judge() {
  PIECE_COORDINATE.forEach(function (c) {

  })
  if (PIECE_NUM === 5) {
    return 1;
  }
}
