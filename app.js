$(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b69b4c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  init(ctx);
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
      var start = 20 + (d1 - 1) * 30;
      var end = 20 +(d2 - 1) * 30;

      ctx.arc(start, end, 5, 0, 360, false);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    })
  })
}
