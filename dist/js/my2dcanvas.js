
const colorHighlight = getComputedStyle(chartSection).borderColor;
const colorDark = getComputedStyle(chartSection).color;

const ctx = chartCanvas.getContext("2d");
ctx.translate(0.5, 0.5);

function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.stroke();
}
drawChartXY();

function drawChartXY() {
  const chartPadding = {
    top: chartCanvas.height / 6,
    right: chartCanvas.width / 20,
    bottom: chartCanvas.height / 5,
    left: chartCanvas.width / 10
  };
  // draw Y axis
  //            startX                                  
  drawLine(ctx, chartPadding.left,
  //            startY 
                chartPadding.top,
  //            endX
                chartPadding.left,
  //            endY
                chartCanvas.height - chartPadding.bottom, 
                colorDark);
  // draw X axis
  drawLine(ctx, chartPadding.left,
                chartCanvas.height - chartPadding.bottom,
                chartCanvas.width - chartPadding.right, 
                chartCanvas.height - chartPadding.bottom, 
                colorDark);
}