export const drawLine = (ctx, stroke) => {

  ctx.beginPath();

  ctx.moveTo(stroke.x1, stroke.y1);

  ctx.lineTo(stroke.x2, stroke.y2);

  ctx.stroke();

};