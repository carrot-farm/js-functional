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
  // .then(log); // 65(딜레이도 더 걸린다.)

// # 위의 코드를 callback 패턴으로 작성
add10(5, res => {
  add10(res, res => {
    add10(res, res => {
      // log(res); // 35
    })
  })
})

// ===== 일급 활용
/** 비동기를 체크해서 동일한 상황을 만든다. */
clear();
const delay100 = a => new Promise(resolve =>
  setTimeout(() => { resolve(a); }, 100));
const add5 = a => a + 5;
// var go1 = (a, f) => a instanceof Promise ? a.then(f) :  f(a);
var r = go1(10, add5);
var r2 = go1(delay100(10), add5);

// log(r); // 15
// r2.then(log); // 15


// ===== 합성 관점에서의 Promise와 모나드
/** 모나드는 합수 합성을 안전하게 하기위한 도구 */
var g = a => a + 1;
var f = a => a * a;
log(f(g(1))); // 4
log(f(g())); // NaN. 에러가 났지만 계속 실행된다.
[].map(g).map(f); // [] 에러가 안난다. js의 `[]`이 모나드이다.
[1].map(g).map(f).forEach(r => log(r)); // 4
[].map(g).map(f).forEach(r => log(r)); // 함수자체가 실행이 안되므로 안전하다.

Promise.resolve(1).then(g).then(f).then(r => log(r)); // 4 (비동기 상황의 함수 합성)
Promise.resolve().then(g).then(f).then(r => log(r)); // NaN
new Promise(resolve =>
  setTimeout(() => resolve(2), 100)
).then(g).then(f).then(r => log(r));


// ===== promise.then의 중요한 규칙
/** Promise.then 메소드를 통해 결과는 꺼냈을 때
 *  결과는 Promise가 아니어야 한다. */
// # Promise가 중첩되어 있어도 단한번의 then으로 Promise가 아닌 값을 꺼낼 수 있어야 한다.
Promise.resolve(Promise.resolve(Promise.resolve(10))).then(log); // 10
new Promise(resolve => resolve(new Promise(resolve => resolve(11)))).then(log);




/** =======================================
 * Kleisli Composition 관점에서의 Promise
 * . Kleisli Composition
 *  - 오류가 있을 수 있는 상황에서의 함수합성 규칙
 *  - 외부 상황에 의해 합수합성이 정확하게 이루어지지 않을 가능성이 있을 때
 * 안전하게 합성하기 위한 규칙
 *  - 에러가난뒤 계속 실행되거나 엉뚱한 결과를 사용하게 될수도 있는것을 방지.
======================================= */
clear();
var users = [
  { id: 1, name: 'aa' },
  { id: 2, name: 'bb' },
  { id: 3, name: 'cc' },
];

// # 에러가 나는 케이스
// var getUserById = id =>
//   find(u => u.id === id, users);
// var g = getUserById; // 유저 찾기
// var f = ({name}) => name; // 이름 추출
// var fg = id => f(g(id)); // 유저 찾은 후 이름 추출 함수 합성.
// log('> kleisli 미적용(정상) : ', fg(2)); // 정상 작동
// users.pop(); // 상황 변함.
// users.pop();
// log('> kleisli 미적용(상황변화 후 에러) : ', fg(2)); // 에러(undefined를 리턴해서 엉뚱한 결과를 사용할수도 있다.)

// # Kleisli Composition 적용 후 코드
var getUserById = id =>
  find(u => u.id == id, users) || Promise.reject('없어요!');
var g = getUserById; // 유저 찾기
var f = ({name}) => name; // 이름 추출
const fg2 = id => Promise.resolve(id).then(g).then(f);
fg2().then(log).catch(log); // 함수가 g만 실행되고 f는 실행안됨.
users.pop(); // 상황 변함.
users.pop();



/** =======================================
 * go, pipe, reduce에서 비동기 제어
 * . 비동기를 제어하기 위해 curry 함수내에 Promise를 위한 처리를 해준다.
======================================= */
// ===== 중간에 Promise 가 있을 경우.
// # go내부의 curry 함수 비동기 처리
go(1,
  a => a + 10,
  a => Promise.resolve(a + 100), // 중간에 Promise 난입
  a => a + 1000,
  log);

// ===== 처음에 Promise 일 경우
// # curry 내부의 recur함수에 go1 적용으로 Promise를 적용 후 전달.
go(Promise.resolve(1),
  a => a + 10,
  a => Promise.resolve(a + 100),
  a => a + 1000,
  log);

// ===== 에러 발생 시
go(Promise.resolve(1),
  a => a + 10,
  a => Promise.reject('error ~ '),
  a => log('___'), // 에러 발생으로 실행 안됨
  a => a + 1000,
  log).catch(a => log('> error catch : ', a));

