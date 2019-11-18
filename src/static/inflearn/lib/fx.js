const  {log, clear} = console;

// ===== curry 정의
const curry = f =>
  (a, ..._) => _.length
    ? f(a, ..._) // 인자가 2개 이상이면 즉시 실행
    : (..._) => f(a, ..._); // 인자가 1개면 그동안의 인자를 모아서 함수를 리턴



// ===== iterable 프로토콜을 따르는 reduce
// # 누적되는 값을 함수에 위임한다.
const reduce = curry((f, acc, iter ) => {
  // # 초기값이 없고 2개의 함수와 iter만 넘어 왔을 때 초기값 설정
  if(!iter){
    iter = acc[Symbol.iterator](); // 2번째가 iterator이니 iter를 iterator로 만든다.
    acc = iter.next().value; // 첫번째를 실행 시키고 그 값을 초기값으로 삼는다.
  } else {
    iter = iter[Symbol.iterator]();
  }
  // # 누적
  let cur;
  while(!(cur = iter.next()).done){
    const a = cur.value;
    acc = f(acc, a); // 누적값을 함수에게 위임.
  }
  return acc; // 누적된 결과값을 리턴
});



// ===== reduce를 이용해 값을 축약 해서 보기좋게 변환.
const go = (...args) => reduce((a, f) => f(a), args);

// ===== 함수들을 축약해 하나의 함수로 만든다.
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

// ===== 합산
const add = (a, b) => a + b;

// # curry 적용 후
const sum = curry((f, iter) => go(
  iter,
  map(f),
  reduce(add)));




/** =======================================
 *  map
 * . iterable 프로토콜을 따르는 map 함수 정의
 * . 배열에 담을 값을 함수에 위임한다.
 ======================================= */
const map = curry((f, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done){
    const a = cur.value;
    res.push(f(a))
  }
  // # 수정 전 코드
  // for(const a of iter){
  //   res.push(f(a)); // 인자로 받은 함수가 누적 값을 결정.
  // }
  return res;
});



/** =======================================
 *  filter
 * . iterable 프로토콜을 따르는 filter
 * . 필터링의 조건을 함수에 위임
 ======================================= */
const filter = curry((f,iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done){
    const a = cur.value;
    if(f(a)){res.push(a);}
  }
  // # 수정전 코드
  // for(const a of iter){
  //   if(f(a)){res.push(a);}
  // }
  return res;
});



/** =======================================
 *  range
 * . 파라메터로 받은 숫자 만큼의 수가 증가하는 배열을 만드는 함수
 * . reduce에서 배열을 iterator 로 만드는 과정을 한번더 거친다.
 * . 한번에 지정된 만큼의 배열을 만든다.
 ======================================= */
const range = l => {
  let i = -1;
  let res = [];
  while(++i < l){
    res.push(i);
  }
  return res;
};



/** =======================================
 *  take
 * . 많은 수의 iterator을 받고 지정된 배열 만큼 잘라준다.
 * . 배열및 이터레이터 양쪽 모두 평가 가능하다.
 * . 이터레이터를 평가해서 자를 경우는 모두 만드는 것이 아니라 지정된
 * 수만큰만 평가한다.
 ======================================= */
const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value
    res.push(a);
    if(res.length === l){return res;}
  }
  return res;
});



/** =======================================
 지연성
 ======================================= */
const L = {};



/** =======================================
 *  L.range
 * . iterable 프로토콜을 활용해 위와 같이 수가 증가하는 이터레이터를 만든다.
 * . 평가를 나중으로 미루고 필요할 때만 평가할 수 있다.
 * . range와 같이 배열을 iterator 로 만드는 과정을 거치지 않기 때문에 효율적.
 ======================================= */
L.range = function *(l) {
  let i = -1;
  while(++i < l){
    yield i;
  }
};



/** =======================================
 *  L.map
 ======================================= */
L.map = curry(function *(f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done){
    const a = cur.value;
    yield f(a);
  }
});


/** =======================================
 *  L.filter
 ======================================= */
L.filter = curry(function *(f, iter){
  iter = iter[Symbol.iterator]();
  let cur;
  while(!(cur = iter.next()).done){
    const a = cur.value;
    if(f(a)){
      yield a;
    }
  }
});