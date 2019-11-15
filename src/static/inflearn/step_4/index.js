/** =======================================
 *  map + filter + reduce 를 중첩해서 다루기
 ======================================= */
const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

const add = (a, b) => a + b;

// ===== 기본형
log(
  reduce(
    add,
    [10, 20, 30, 40]));

// ===== 함수의 합성
log(
  reduce(
    add,
    map(p => p.price ,
      filter(p => p.price < 20000, products))));

// ===== 위와 같다.
log(
  reduce(
    add,
    filter(n => n < 20000,
      map(p => p.price , products))));



/** =======================================
 *  go
 * . 표현력을 높여서 읽기 좋게 한다.
 * . 즉시 값을 평가한다.
 ======================================= */
clear();
// ===== reduce를 이용해 값을 축약 해서 사용한다.
const go = (...args) => reduce((a, f) => f(a), args);


// ===== 인자들을 통해서 하나의 값으로 축약
go(
  0,
  // add(0, 2), // 시작시 인자가 2개 필요할 때는 이런방식으로 만든다.
  a => a + 1,
  a => a + 10,
  a => a + 100,
  log
); // 111



/** =======================================
 *  pipe
 * . 함수들이 나열되어 있는 합성된 함수를 만듦
 * . 함수를 리턴.
 * . go 함수가 값을 바로 평가하는 거라면 pipe는 그 함수들을 만드는 역활.
 * . 첫 번째 함수는 인자를 2개 이상 받을 수 있게 구성.
 ======================================= */
clear();

// ===== 함수들을 축약해 하나의 함수로 만든다.
const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);


// ===== 함수들을 축약해 하나의 함수로 만든다.
const f = pipe(
  (a, b) => a + b,
  a => a + 10,
  a => a + 100,
);

log(f(0, 1)) // 111


/** =======================================
 *  go를 이용해 보기 좋게 코드 변경
 * . 오른쪽에서 왼쪽으로 읽어야 하는 코드를 보기 좋게 변경한다.
 * . 처음에 만든 product 코드를 수정
 ======================================= */
clear();

go(
  products,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price , products),
  prices => reduce(add, prices),
  log); // 30000



/** =======================================
*  curry
* . 인자가 2개 이상이 라면 즉시 실행 하고 하나라면
* 그 이후에 받은 인자들을 합쳐서 함수를 리턴
======================================= */
clear();
// ===== curry 정의
// const curry = f =>
//   (a, ..._) => _.length
//     ? f(a, ..._) // 인자가 2개 이상이면 정의한 f 함수 즉시 실행
//     : (..._) => f(a, ..._); // 인자가 1개면 처음에 정의한 함수 f 에 모은 인자들을 넘기면서 실행

const mult = curry((a, b) => a * b); // 함수를 정의.
log(mult(3)); // `(..._)=>f(a,..._)` 인자가 하나면 함수를 리턴
log(mult(3)(5)); // `15` 리턴 받은 함수에 2번째 인자를 넣으며 실행
log(mult(3, 5)); // `15` 인자가 2개이상 이므로 mult정의시 정의한 함수 실행

const mult2 = mult(3); // `(..._)=>f(a,..._)` 을 리턴
log(mult2(5)); // `15` 다음과 동일 하다 `mult(3)(5)`
log(mult2(5, 8)); // `15` 다음과 동일 `mult(3, 5, 8)`



/** =======================================
 *  curry 와 go를 이용해 코드를 보기 좋게 변경.
 ======================================= */
clear();
// ===== 적용전
go(
  products,
  products => filter(p => p.price < 20000, products),
  products => map(p => p.price , products),
  prices => reduce(add, prices),
  log); // 30000

// ===== 위의 코드와 동일하다.
go(
  products,
  products => filter(p => p.price < 20000)(products),
  products => map(p => p.price)(products),
  prices => reduce(add)(prices),
  log); // 30000

// ===== 더 간단하게 변경.
go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price),
  reduce(add),
  log); // 30000



/** =======================================
 *  함수 조합으로 함수 만들기
 ======================================= */
clear();

// ===== 다음과 같은 2개의 함수가 있을 때 중복된 부분을 제거 할 수 있다.
go(
  products,
  filter(p => p.price < 20000),
  map(p => p.price), // 중복
  reduce(add), // 중복
  log); // 30000

go(
  products,
  filter(p => p.price >= 20000),
  map(p => p.price), // 중복
  reduce(add), // 중복
  log); // 75000

// ===== 중복 제거
// # 반복되는 부분 제거
const total_pipe = pipe(
  map(p => p.price),
  reduce(add));

// # 필터링 되는 부분 단순화(평가되는 함수를 인자로 받는다.)
const base_total_price = predi => pipe(
  filter(predi),
  total_pipe);

go(
  products,
  base_total_price(p => p.price < 20000),
  log); // 30000

go(
  products,
  base_total_price(p => p.price >= 20000),
  log); // 75000
