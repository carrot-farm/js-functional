/** =======================================
 *  제네레이터와 이터레이터
 * . 제네레이터 : 이터레이터이자 이터러블을 생성하는 함수.
 ======================================= */
const log = console.log;

// ===== 이터레이터를 쉽게 사용하게 해준다.
function *gen(){
  yield 1;
  // if(false){ yield 2; } // 순회를 조절할 수 있다.
  yield 2;
  yield 3;
  return 100; // 리턴 값은 `done: true` 일때 리턴한다.
}
let iter = gen();
log(iter[Symbol.iterator]() === iter); // true (자기 자신을 리턴하는 이터레이터)
log(iter.next()); // {value: 1, done: false}
log(iter.next()); // {value: 2, done: false}
log(iter.next()); // {value: 3, done: false}
log(iter.next()); // {value: 100, done: true}

// ===== 제네레이터는 이터레이터이기 때문에 순회가 가능하다.
for(const a of gen()){log(a)} // 1 2 3 (done:true 일때는 안찍힌다.)


/** =======================================
 *  ODD
 ======================================= */
console.clear();
// ===== 무한히 수를 생성하는 함수. 컨트롤 가능하다.
function *infinity(i = 0){
  while(true) { yield i++; }
}

// ===== 제한을 만드는 함수
function *limit(l, iter){
  for(const a of iter){
    yield a;
    if(a === l){ return; }
  }
}

// ===== 홀수만 발생
function *odds(l){
  // // # 일반적인 방법
  // for(let i = 0; i < l ; i++){
  //   if(i % 2){yield i;}
  // }
  // # 무한평가를 이용한 방법
  // for(const i of infinity(1)){
  //   if(i % 2){yield i;} // 홀수만 발생
  //   if(i === l){ return; } // 제한값을 넘기면 멈춤.
  // }
  // # 무한평가와 limit을 이용한 방법
  for(const i of limit(l, infinity(1))){
    if(i % 2){yield i;} // 홀수만 발생
  }
}

let iter2 = odds(10); // limit 값을 정해줌.
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// log(iter2.next());
// for(const a of iter2){ log(a); }

// ===== limit을 이용한 평가
// let iter4 = limit(4, [1, 2, 3, 4, 5, 6]);
// for(const a of iter4){ log(a); }

// ===== infinity와 limit을 이용한 평가
for(const a of odds(15)){ log(a); }


/** =======================================
 *  for...of, 전개 연산자, 구조분해, 나머지 연산자
 ======================================= */
console.clear();
 // ===== 전개 연산자
log(...odds(10));
log([...odds(10), ...odds(20)]);

// ===== 구조분해1
const [head, ...tail] = odds(5); // 첫번째와 나머지로 나눌 수 있다.
log(head); // 1
log(tail); // [3, 5]

// ===== 구조분해2
const [a, b, ...rest] = odds(10);
log(a); // 1
log(b); // 3
log(rest); // [5, 7, 9]



/** =======================================
 *  map
 ======================================= */
console.clear();
const products = [
  { name: '반팔티', price: 15000 },
  { name: '긴팔티', price: 20000 },
  { name: '핸드폰케이스', price: 15000 },
  { name: '후드티', price: 30000 },
  { name: '바지', price: 25000 },
];

// ===== 기존의 배열의 특정 값을 담는 코드
// # 배열의 특정 값을 담는 코드1
let names = [];
for(const p of products){
  names.push(p.name);
}
log(names); // [ '반팔티', '긴팔티', '핸드폰케이스', '후드티', '바지' ]
// # 배열의 특정 값을 담는 코드2
let prices = [];
for(const p of products){
  prices.push(p.price);
}
log(prices); // [ 15000, 20000, 15000, 30000, 25000 ]

// ===== iterable 프로토콜을 따르는 map 함수 정의
// # 배열에 담을 값을 함수에 위임한다.
const map = (f, iter) => {
  let res = [];
  for(const a of iter){
    res.push(f(a)); // 인자로 받은 함수가 누적 값을 결정.
  }
  return res;
};
// # map을 활용한 배열의 특정 값을 담는 코드
log(map(p => p.name, products)); // [ '반팔티', '긴팔티', '핸드폰케이스', '후드티', '바지' ]
log(map(p => p.price, products)); // [ 15000, 20000, 15000, 30000, 25000 ]



/** =======================================
 *  이터러블 프로토콜을 따른 map 함수
 * . querySelectAll처럼 유사 배열에서는 배열의 메소드를 사용할 수 없는데
 * 이터러블 프로토콜을 따르는 map을 이용하면 순회가 가능하다.
 ======================================= */
console.clear();
// ===== 기존의 유사배열을 순회하는 방법
function argEach(){
  // # 배열이 아니라 배열 메소드를 사용할 수 없어 에러가 난다.
  // arguments.map(i => log(i));
  // # 기존의 방식은 bind, call등을 사용해 Array.prototype을 연결한다.
  // Array.prototype.map.bind(arguments)(i => log(i))
  // # 이터러블 프로토콜을 따르는 map을 사용하면 더 간편하다.
  map(i => log(i), arguments);
}
argEach(1, 2, 3, 4);

// ===== map을 사용한 nodeList 순회
log(map(el => el.nodeName, document.querySelectorAll('*')));
const it = document.querySelectorAll('*')[Symbol.iterator](); // 이터레이터 반환
log(it.next()); // {value: html, done: false}

// ===== key, value 형태의 Map 객체를 구조분해 해서 사용하기.
let m = new Map();
m.set('a', 10);
m.set('b', 20);
// # 원본
const it2 = m[Symbol.iterator]();
log(it2.next()); // {value: ['a', 10], done: false}
log(it2.next()); // {value: ['b', 20], done: false}
log(it2.next()); // {value: undefined, done: true}
// # map을 이용해 [key, value] 구조 분해해서 사용.
log(new Map(map(([k, a]) => [k, a * 2], m))); // Map[{key: 'a', value: 20}, {key: 'b', value: 40}]



/** =======================================
 *  filter
 * . iterable 프로토콜을 따르는 filter
 ======================================= */
 console.clear();
// ===== 일반적인 필터링 방법
// # 20000 미만 필터링
let under20000 = [];
for(const p of products){
  if(p.price < 20000){under20000.push(p);}
}
log(...under20000);
// # 20000 이상 필터링
let over20000 = [];
for(const p of products){
  if(p.price >= 20000){over20000.push(p);}
}
log(...over20000);

// ===== iterable 프로토콜을 따르는 filter
// # 필터링의 조건을 함수에 위임
const filter = (f,iter) => {
  let res = [];
  for(const a of iter){
    if(f(a)){res.push(a);}
  }
  return res;
};
// # filter를 함수를 사용한 필터링.
log(...filter(p => p.price < 20000, products)); // 20000 미만
log(...filter(p => p.price >= 20000, products)); // 20000 이상
// # 이터레이터 이기에 할 수 있는 것.
log(filter(n => n % 2, [1, 2, 3, 4]));
log(filter(n => n % 2, function *(){
  yield 1;
  yield 2;
  yield 3;
  yield 4;
}()));



/** =======================================
 *  reduce
 * . iterable 프로토콜을 따르는 reduce
 * . 여러 값을 하나로 축약.
 ======================================= */
console.clear();
const nums = [1, 2, 3, 4, 5];

// ===== 기존 방식
// # 값을 합산
let total = 0;
for(const n of nums){
  total = total + n;
}
log(total); // 15

// ===== iterable 프로토콜을 따르는 reduce
const reduce = (f, acc, iter ) => {
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
};

const add = (a, b) => a + b;

log(reduce((acc, cur) => acc + cur, 0, [1, 2, 3, 4, 5])); // 15
// # 동작 풀이(초기값에서 연속적으로 재귀 함수 실행)
log(reduce(add, 0, [1, 2, 3, 4, 5])); // 15
log(add(add(add(add(add(0, 1), 2), 3), 4), 5)); // 15

// ===== acc 값을 제외했을 경우에도 작동하는 reduce
// # acc 제외시 동작 풀이
log(reduce(add, [1, 2, 3, 4, 5])); // 이와 같이 입력하면
log(reduce(add, 1, [2, 3, 4, 5])); // 첫번째 값을 꺼내 기본값으로 설정한다.

// ===== 함수에 누적할것을 위임하기 때문에 숫자 만이 아니라 객체등을 처리 가능
// # products의 모든 값을 더하는 reduce
log(reduce((total_price, product)=> total_price + product.price,
  0,
  products));