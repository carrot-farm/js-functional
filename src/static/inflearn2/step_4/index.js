/** =======================================
 * values
 * . object의 value 만을 가져온다.
 * . 지연된 values
======================================= */
const obj1 = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
};

// ====== L.values 정의 (오브 젝트도 iterable을 이용해 지연 평가 가능.)
L.values = function *(obj){
  for (const k in obj) { yield obj[k]; }
}

// ===== 즉시 평가됨
_.go(
  obj1,
  Object.values, //  즉시 평가됨
  _.map(a => a + 10),
  _.reduce((a, b) => a + b),
  console.log // 50
)

// ===== 지연 평가 가능.
_.go(
  obj1,
  L.values,
  // L.map(a => a + 10),
  L.take(2),
  // _.reduce((a, b) => a + b),
  console.log // 23
)



/** =======================================
 * keys
 * . object의 key 만을 가져온다.
 * . 지연된 keys
======================================= */
console.clear();
// ===== keys 제네레이터
L.keys = function *(obj){
  for(const k in obj){
    yield k;
  }
}

// ===== 사용 예
_.go(
  obj1,
  L.keys,
  _.each(console.log) // a b c d
)


/** =======================================
 * entries
 * . 지연된 entries
======================================= */
console.clear();
// ===== 지연된 entries 정의
L.entries = function *(obj){
  for (const k in obj){
    yield [k, obj[k]];
  }
}

_.go(
  obj1,
  L.entries,
  L.filter(([_, v]) => v % 2),
  L.map(([k, v]) => ({[k]: v})),
  _.reduce(Object.assign),
  // console.log // {a: 1, c: 3}
)


/** =======================================
 * 어떠한 값이든 이터러블 프로그래밍으로 다루기
======================================= */
const g1 = function *(stop){
  let i = -1;
  while(++i < stop){
    yield 10;
    if (false) {yield 20 +30}
    yield 30;
  }
};
console.log([...g1(3)]); // 6번 실행됨.
console.log([...L.take(2, g1(3))]); // 2번만 실행됨
_.each(console.log, g1(3)) // 실행되는 것 확인.
_.go( // 값을 누적
  g1(10),
  _.reduce((a, b) => a + b),
  console.log
)



/** =======================================
 * Object
 * . 이터러블을 지원하는 것을 object로 변형.(Map, entries 형태 등.)
======================================= */
console.clear();
const a = [['a', 1], ['b', 2], ['c', 3]];
const b = {a: 1, b: 2, c: 3};

// ===== object 함수 정의
// # 기본
const object1 = entries => _.go(
  entries,
  L.map(([k, v]) => ({[k]: v})),
  _.reduce(Object.assign)
);

// # reduce 하나로 만들기
const object2 = entries =>
  _.reduce((obj, [k, v]) => (obj[k] = v, obj), {}, entries);

// # 활용 예
// console.log(object1(a)); // {a: 1, b: 2, c: 3}
// console.log(object2(a)); // {a: 1, b: 2, c: 3}
// console.log(_.object(a)); // {a: 1, b: 2, c: 3}

// ===== Map을 json으로 만들기.
/** Map도 iterable을 지원한다. */
let m = new Map();
m.set('a', 10);
m.set('b', 20);
m.set('c', 30);
console.log(object1(m)); // {a: 1, b: 2, c: 3}
console.log([...m.entries()]);
console.log([...m.keys()]);
console.log([...m.values()]);



/** =======================================
 * mapObject
 * . 오브젝트를 순회한 뒤 수정.
 * . _.map의 오브젝트 판이라고 보면 된다.
======================================= */
console.clear();
var dd = {a: 1, b: 2, c: 3};
// ===== 함수 정의
const mapObject = (f, obj) => _.go(
  obj,
  L.entries, // entries 적용. [["a": 1], ["b": 2], ["c": 3]]
  L.map(([k, v]) => [k, f(v)]), // 값 변환. [["a": 11], ["b": 12], ["c": 13]]
  _.object // object 변환. {a: 11, b: 12, c: 13}
)
console.log( mapObject(a => a + 10 , {a: 1, b: 2, c: 3}));




/** =======================================
 * pick
 * . 지정된 key의 key:value 만을 반환하는 함수.
======================================= */
console.clear();
const obj2 = {a: 1, b: 2, c: 3, d: 4, e: 5};

// ===== 함수 정의
// # go 사용. undefined 허용
const pick = (ks, obj) => _.go(
  ks, // key를 기준으로 순회
  L.map(k => [k, obj[k]]),
  _.object
);

// # undefined 허용 안함
const pick3 = (ks, obj) => _.go(
  ks, // key를 기준으로 순회
  L.map(k => [k, obj[k]]),
  L.reject(([k, v]) => v === undefined), // 제외 조건
  _.object
);

// # go 사용안함.
const pick2 = (ks, obj) => _.object(_.map(k => [k, obj[k]], ks));

// ===== 사용 예
console.log(pick(['b', 'c'], obj2)); // {b: 2, c: 3}
console.log(pick2(['b', 'c'], obj2)); // {b: 2, c: 3}
console.log(pick(['b', 'c', 'z'], obj2)); // {b: 2, c: 3, z: undefined} 없는 값이 나올 경우. (undefiend는 지양하자. 서버에 전송하거나 값으로 다룰 수 없다.)
console.log(pick3(['b', 'c', 'z'], obj2)); // {b: 2, c: 3}




/** =======================================
 * indexBy
 * . json 배열 형태를 key/value 형태로 만들어 조회 비용을 줄인다.
 * . [{a: 1}, {b: 2}, {c: 3}] -> {1: {a: 1}, 2: {b: 2}, 3: {c: 3}}
======================================= */
console.clear();
const users = [
  {id: 5, name: 'AA', age: 35},
  {id: 10, name: 'BB', age: 26},
  {id: 19, name: 'CC', age: 28},
  {id: 23, name: 'CC', age: 34},
  {id: 24, name: 'EE', age: 23},
];

// ===== 함수정의
const indexBy = (f, iter) => _.reduce((obj, a) => (obj[f(a)] = a, obj), {}, iter);

// ===== 사용 예
console.log(_.indexBy(u => u.id, users)); // key/value 오브젝트로 만든다.

// ===== indexBy 된 값을 filter 하기
/** 일반적인 filter는 key/value 이기 때문에 되지 않는다. */
const users2 = _.indexBy(u => u.id, users);
// # filtering
_.go(
  users2,
  L.entries,
  L.filter(([_, {age}]) => age < 30),
  _.object,
  console.log
)
console.log(users2);


