/** =======================================
 * 이미지 가져오기
 ======================================= */
const { log, clear } = console;

// ===== 에러가 없는 데이터
const imgs = [
  { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
  { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.png"},
  { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
  { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
];

// ===== 에러 발생 데이터
const imgs2 = [
  { name: "HEART", url: "https://s3.marpple.co/files/m2/t3/colored_images/45_1115570_1162087_150x0.png" },
  { name: "6", url: "https://s3.marpple.co/f1/2018/1/1054966_1516076919028_64501_150x0.jpg"},
  { name: "하트", url: "https://s3.marpple.co/f1/2019/1/1235206_1548918825999_78819_150x0.png" },
  { name: "도넛", url:"https://s3.marpple.co/f1/2019/1/1235206_1548918758054_55883_150x0.png"},
];


const loadImage = url => new Promise((resolve, reject) => {
  let img = new Image();
  img.src = url;
  // # 이미지 로드 시
  img.onload = function(){
    // log('> 이미지 로드 성공 : ', img);
    resolve(img);
  };
  // # 로드 에러시(여기서 에러 핸들링 하지 말것.)
  img.onerror = function(e){
    // log('> 이미지 로드 실패 : ', e);
    reject(e)
  };
  return img;
});

// loadImage(imgs2[0].url).then(img => log(img.height));
// loadImage(imgs[0].url).then(img => document.body.appendChild(img));


/** =======================================
 * 실전
 * . 이미지들을 불러와서 모든 이미지의 높이를 더한다.
 ======================================= */
// ===== 에러 핸들링을 하려다가 복잡해 지고 버그난 코드
async function f1(){
  try{
    let error = null; // 에러가 있을 경우 담을 객체
    // # 로드된 전체 이미지의 높이의 합
    const total = await imgs2
      // # 이미지 전체 순회
      .map(async({url}) => {
        // # 에러가 있을 경우 멈춘다.
        if(error){ return; }
        try{
          const img = await loadImage(url); // 로드 후 이미지 객체.
          return img.height;
        }catch(e){
          log(e);
          throw e;
        }
      })
      // // # 이미지의 전체 높이
      .reduce(async (total, height) => await total + await height, 0);
  }catch(e){
    log('> Error : ', 0);
  }
}
// # 실행하면 에러가 난다.
// f1();

// ===== iteratable 프로토콜을 이용한 에러 핸들링
// # iteratable 프로토콜을 따르는 map
function* map(f, iter){
  for(const a of iter){
    // 에러가 났을 시 promise는 reject를 발생 시킨다.
    yield a instanceof Promise ? a.then(f) : f(a);
  }
}

// # async/await을 따르는 reduce async
async function reduceAsync(f, acc, iter){
  // await 안에 throw 까지 숨어져 있다.
  for await (const a of iter){
    acc = f(acc, a);
  }
  return acc;
}

// #
const f2 = imgs =>
  reduceAsync((a, b) => a + b, 0,
    map(img => img.height,
      map(({url}) => loadImage(url), imgs)));
// f2(imgs2).then(log);
// log(f2(imgs2));
// f2(imgs).catch(_=> 0 ).then(log);

/**
 * @ 함수 내에서 에러 핸들링을 하지 말고 인자를
 * 전달하는 시점에 에러 핸들링을 해야 한다.
 * 함수내에서 에러 핸들 및 가드를 하면 사용성을 제약 하게된다.
 * 에러를 발생시켜 sentry.io 등을 이용해서 발생되는 모든 에러를 확인하는 것이 좋다.
 *
 * @ 에러 발생 시점 트랙킹
 * . 최근 node는 비동기 에러도 콜 스택에 쌓인다.(예전에는 비동기 에러가 콜 스택에 안쌓였다.)
 *
 * @ 에러 제외 하고 나머지를 처리 하고 싶을 때
 * . filter 함수를 이용해 에러핸들링을 filter에서 제외하고 나머지를 실행한다.
 *
 * @ 부수 효과는 바깥에서 일으키는게 좋다.
 */
f2(imgs2).catch(_=> _ ).then(log);




