/** =======================================
 *  기존과 달라진 ES6에서의 리스트 순회
 ======================================= */
const log = console.log;

// ===== 기존방식
// # 기존 방식
const list = [1, 2, 3];
for(var i = 0 ; i < list.length ; i++){
  log(list[i]);
}
// # 기존방식: 유사배열
const str = 'abc';
for(var i = 0 ; i < str.length ; i++){
  log(str[i]);
}

// # es6
for(const a of list){
  log(a);
}
// # es6: 유사배열
for(const a of str){
  log(a);
}


/** =======================================
 * Array, Set, Map을 통해 알아보는 이터러블/이터레이터 프로토콜
 * # for...of
 *  - `for...of` 는 내부에 숫자키를 가지고 조회하는 것이 아니다.
 *  - `for...of` 문은 `Symbol.iterator`으로 순회를 한다.
 * # 이터러블 / 이터레이터 프로토콜
 *  - 이터러블: 이터레이터를 리턴하는 `...[Symbol.iterator]()` 를 가진 값. 실행 시 이터레이터 리턴.
 *  - 이터레이터: `{ value, done }` 객체를 리턴하는 `next()` 를 가진 값
 *  - 이터러블/이터레이터 프로토콜: 이터러블을 `for...of, 전개연산자` 등과 함께 동작하도록 규약
 ======================================= */
// ===== Array
log('Arr ---------------------');
const arr = [1, 2, 3];
const iter1 = arr[Symbol.iterator](); // `이터레이터`를 반환한다.
iter1.next(); // next 를 한번 실행한다.
for(const a of iter1){log(a)}; // 2 3
log('> arr Symbol 확인: ', arr[Symbol.iterator]);
arr[Symbol.iterator] = null;
log('> arr Symbol 삭제 후 확인: ', arr[Symbol.iterator]); // null(for...of 문으로는 순회를 못한다.)

// ===== Set
log('Set ---------------------');
const set = new Set([1, 2, 3]);
for(const a of set){log(a)};
log('> set 접근 : ', set[0]); // undefined(예전 for 문과는 동작 방식이 달라서 접근이 안된다.)

// ===== Map
log('Map ---------------------');
const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
// for(const a of map){log(a)};
for(const a of map.keys()){log(a)}; // a b c (키만 출력 가능 하다.)
for(const a of map.values()){log(a)}; // 1 2 3 (값만 출력 가능 하다.)
for(const a of map.entries()){log(a)}; //  (엔트리를 출력 가능 한다.)
let mapIter = map.keys(); // MapIteraotr 객체를 리턴한다.
log('> map.keys : ', mapIter.next()); // {value: "a", done: false}



/** =======================================
 *  사용자 정의 이터러블
 * # 이터레이터를 직접 구현.
 ======================================= */
console.clear();
// ===== 이터러블 프로토콜을 만족하는 객체
const iterable = {
  // # iterator 객체 정의
  [Symbol.iterator](){
    let i = 3; // 임의의 수
    // # 반환할 iterator
    return {
      // # next 메소드 반환
      next(){
        return i=== 0 ? {done: true} : {value: i--, done: false}
      },
      // # 반환된 iterator 실행시 자기자신을 반환.(순회를 위해서 계속 자신을 반환)
      [Symbol.iterator]() {
        return this;
      }
    }
  }
};

// ===== 이터레이터 반환
let iterator = iterable[Symbol.iterator]();
// log(iterator.next()); // {value: 3, done: false}
// log(iterator.next()); // {value: 2, done: false}
// log(iterator.next()); // {value: 1, done: false}
// log(iterator.next()); // {done: true}
for(const a of iterable) { log(a); }

// const arr2 = [1, 2, 3];
// let iter2 = arr2[Symbol.iterator]();
// iter2.next();

// ===== iterable 적용 예
// # 배열이라서가 아니라 이터러블 프로토콜을
for( const a of document.querySelectorAll('*')) { log(a); }
const all = document.querySelectorAll('*');
let iter3 = all[Symbol.iterator]();
log(iter3.next()); // {value: html, done: false};


/** =======================================
 *  전개 연산자
 * . iterable 프로토콜을 따른다.
 ======================================= */
 console.clear();
 const a = [1, 2];
 log([...a, ...[3, 4], ...set, ...map.keys()]); // [1, 2, 3, 4]