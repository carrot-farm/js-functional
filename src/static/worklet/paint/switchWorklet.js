const DEG_360 = Math.PI * 2;
const CIRCLE_MARGIN = 3;
const BG_COLOR = '#e1e1e1';
const BG_COLOR_ON = '#ffcd00';
const FG_COLOR = '#ffffff';


class Switch{
  // ===== 매개변수 받기
  // static get inputArguments() {
  //   return ["on|off"];
  // }

  // ===== 스타일 정보 받기
  static get inputProperties() {
    return ["color"];
  }

  // ===== 그리기
  paint(ctx, geom, props, args){
    // 매개변수 받기
    // const on = args[0].toString() === 'on';

    // 스타일 정보 받기
    const color = props.get('color').toString();
    console.log('> paint : ', props);

    const { width, height } = geom; // 엘리먼트의 width, height 정보를 받는다.

    const halfOfCircleSize = height / 2;
    const innerWidth = width - height;

    // ===== 배경
    // ctx.fillStyle = on ? BG_COLOR_ON : BG_COLOR;
    ctx.fillStyle = color;
    ctx.beginPath();
    // 왼쪽의 원
    ctx.arc(halfOfCircleSize, halfOfCircleSize, halfOfCircleSize, 0, DEG_360);
    // 오른쪽의 원
    ctx.arc(
      width - halfOfCircleSize,
      halfOfCircleSize,
      halfOfCircleSize,
      0,
      DEG_360
    );
    // 가운데 사각형.
    ctx.rect(halfOfCircleSize, 0, innerWidth, height);
    ctx.fill();

    // ===== 내부 원
    ctx.fillStyle = FG_COLOR;
    ctx.beginPath();
    // 내부원
    ctx.arc(
        halfOfCircleSize,
        halfOfCircleSize,
        halfOfCircleSize - CIRCLE_MARGIN,
      0,
      DEG_360
    )
    ctx.fill();

  }
}

registerPaint('switch', Switch);
