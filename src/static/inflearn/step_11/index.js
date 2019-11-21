/** =======================================
 * Promise
 * . callback과의 가장 큰 차이점은 비동기 상황을 일급 값으로 다룬다.
======================================= */
// ===== 기본 사용법
// # callback 패턴
function add10(a, callback){
  setTimeout(() => {
    callback(a + 10)
  }, 100);
}
// add10(5, res => log(res)) // 15

// # Promise 패턴
/** 비동기 상황을 만들어서 리턴 */
function add20(a){
  return new Promise(resolve => setTimeout(() =>
    resolve(a + 20)
  , 100));
}

add20(5)
  .then(add20)
  .then(add20)
  .then(log); // 65(딜레이도 더 걸린다.)

// # 위의 코드를 callback 패턴으로 작성
add10(5, res => {
  add10(res, res => {
    add10(res, res => {
      log(res); // 35
    })
  })
})