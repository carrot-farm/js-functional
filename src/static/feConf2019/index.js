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
  // log('> 이미지 로드 : ', url);
  // # 이미지 로드 시
  img.onload = function(){
    // log('> 이미지 로드 성공 : ', img);
    resolve(img);
  };
  // # 로드 에러시
  img.onerror = function(e){
    // log('> 이미지 로드 실패 : ', e);
    reject(e)
  };
  return img;
});

// loadImage(imgs[0].url).then(img => log(img.height));
// loadImage(imgs[0].url).then(img => document.body.appendChild(img));



/** =======================================
 * 실전
 * . 이미지들을 불러와서 모든 이미지의 높이를 더한다.
 ======================================= */
// ===== 에러 핸들링을 하려다가 버그난 코드
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
    yield a instanceof Promise ? a.then(f) : f(a);
  }
}
// # async/await을 따르는 reduce async
async function reduceAsync(f, acc, iter){
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
f2(imgs).catch(_=> 0 ).then(log);
f2(imgs2).catch(_=> 0 ).then(log);



