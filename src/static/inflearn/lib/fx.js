/** =======================================
 *  map + filter + reduce
 =======const================================ */
const  {log, clear} = console;

// ===== curry 정의
const curry = f =>
  (a, ..._) => _.length
    ? f(a, ..._) // 인자가 2개 이상이면 즉시 실행
    : (..._) => f(a, ..._); // 인자가 1개면 그동안의 인자를 모아서 함수를 리턴



// ===== iterable 프로토콜을 따르는 map 함수 정의
// # 배열에 담을 값을 함수에 위임한다.
const map = curry((f, iter) => {
  let res = [];
  for(const a of iter){
    res.push(f(a)); // 인자로 받은 함수가 누적 값을 결정.
  }
  return res;
});


// ===== iterable 프로토콜을 따르는 filter
// # 필터링의 조건을 함수에 위임
const filter = curry((f,iter) => {
  let res = [];
  for(const a of iter){
    if(f(a)){res.push(a);}
  }
  return res;
});


// ===== iterable 프로토콜을 따르는 reduce
// # 누적되는 값을 함수에 위임한다.
const reduce = curry((f, acc, iter ) => {
  // # 초기값이 없고 2개의 함수와 iter만 넘어 왔을 때 초기값 설정
  if(!iter){
    iter = acc[Symbol.iterator](); // 2번째가 iterator이니 iter를 iterator로 만든다.
    acc = iter.next().value; // 첫번째를 실행 시키고 그 값을 초기값으로 삼는다.
  }
  // # 누적
  for(const a of iter){
    acc = f(acc, a); // 누적값을 함수에게 위임.
  }
  return acc; // 누적된 결과값을 리턴
});


// ===== reduce를 이용해 값을 축약 해서 보기좋게 변환.
const go = (...args) => reduce((a, f) => f(a), args);

// ===== 함수들을 축약해 하나의 함수로 만든다.
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

