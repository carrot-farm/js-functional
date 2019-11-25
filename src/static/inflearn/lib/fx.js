const  {log, clear} = console;
const C = {}; // 병렬 실행

// ===== curry 정의
const curry = f =>
  (a, ..._) => _.length
    ? f(a, ..._) // 인자가 2개 이상이면 즉시 실행
    : (..._) => f(a, ..._); // 인자가 1개면 그동안의 인자를 모아서 함수를 리턴

// ===== go 실행 시 첫 데이터가 Promise일 경우 처리를 위함.
const go1 = (a, f) => a instanceof Promise ? a.then(f, ) : f(a);


// ===== reduce 의 Promise 처리
const reduceF = (acc, a, f) =>
a instanceof Promise
? a.then(a => f(acc, a), e => e === nop ? acc : Promise.reject(e)) // then() 의 2번재 인자로 nop 처리
: f(acc, a);

// ===== reduce 시 iterator의 첫번째 데이터만 뽑는 코드
const head = iter => go1(take(1, iter), ([h]) => h);


// ===== iterable 프로토콜을 따르는 reduce
/** 누적되는 값을 함수에 위임한다. */
const reduce = curry((f, acc, iter ) => {
  // # 코드 정리
  if(!iter){
    return reduce(f,  head(iter = acc[Symbol.iterator]()), iter);
  }
  iter = iter[Symbol.iterator]();
  // # 초기값이 없고 2개의 함수와 iter만 넘어 왔을 때 초기값 설정
  // if(!iter){
  //   iter = acc[Symbol.iterator](); // 2번째가 iterator이니 iter를 iterator로 만든다.
  //   acc = iter.next().value; // 첫번째를 실행 시키고 그 값을 초기값으로 삼는다.
  // } else {
  //   iter = iter[Symbol.iterator]();
  // }

  // # 누적(Symbol['nop'] 처리)
  return go1(acc, function recur(acc){
    let cur;
    while(!(cur = iter.next()).done){
      acc = reduceF(acc, cur.value, f); // Symbol['nop'] 처리.
      if(acc instanceof Promise){
        return acc.then(recur);
      }
    }
    return acc; // 누적된 결과값을 리턴
  });

  // # 누적(비동기 상황을 고려한 코드)
  // return go1(acc, function recur(acc){
  //   let cur;
  //   while(!(cur = iter.next()).done){
  //     const a = cur.value;
  //     acc = f(acc, a); // 누적값을 함수에게 위임.
  //     // 비동기일 경우 처리 후 재귀
  //     if(acc instanceof Promise){
  //       return acc.then(recur);
  //     }
  //   }
  //   return acc; // 누적된 결과값을 리턴
  // });

  // # 누적(비동기 상황을 고려 안한 코드)
  // let cur;
  // while(!(cur = iter.next()).done){
  //   const a = cur.value;
  //   acc = f(acc, a); // 누적값을 함수에게 위임.
  // }
  // return acc; // 누적된 결과값을 리턴
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
  // # Promise 처리 적용 전 코드
  // let cur;
  // while (!(cur = iter.next()).done) {
  //   const a = cur.value;
  //   res.push(a);
  //   if(res.length === l){ return res; }
  // }
  // return res;

  // # Promise 처리 적용
  return function recur(){
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if(a instanceof Promise){ // Promise일 경우 처리
        return a
        .then(a => (res.push(a), res).length === l ? res: recur())
        .catch(e => e === nop ? recur() : Promise.reject(e)); // catch 가 아무것도 하지 않기 위한 nop symbol이면 다시 recur() 실행.
      }
      res.push(a);
      if(res.length === l){ return res; }
    }
    return res;
  }();
});



/** =======================================
 Array.prototype.join 보다 다형성이 높은 join
 ======================================= */
const join = curry((sep = ',', iter) =>
   reduce((a, b) => `${a}${sep}${b}`, iter));



/** =======================================
 *  find
 * . take를 이용해서 결론을 만드는 함수.
 * . 조건에 해당하는 모든 값을 꺼내는 것이 아니라 처음 만난 하나의 값만 꺼냄
======================================= */
const find = curry((f, iter) => go(
  iter,
  filter(f),
  take(1),
  ([a]) => a));



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
  for(const a of iter){
    yield go1(a, f);
  }
});

// # iterable 적용
// L.map = curry(function *(f, iter) {
//   iter = iter[Symbol.iterator]();
//   let cur;
//   while(!(cur = iter.next()).done){
//     const a = cur.value;
//     yield f(a);
//   }
// });


/** =======================================
 *   nop
 * . reject 시 다음 함수합성에 아무것도 값을 전달하지 않기 위한
 * reject인지 에러로 인한 reject인지 구분하기 위한 심볼
 ======================================= */
const nop = Symbol('nop');


/** =======================================
 *  L.filter
 ======================================= */
// # Kleisli Composition 적용
L.filter = curry(function *(f, iter){
  for( const a of iter){
    const b = go1(a, f);
    if ( b instanceof Promise) { // 비동기 처리.
      // reject을 하면 다음에 함수가 대기를 해도 들어가지 않게 된다.
      yield b.then(b => b ? a : Promise.reject(nop));
    } else if(b) { // 동기 처리
      yield a;
    }
  }
});
// # 단순화
// L.filter = curry(function *(f, iter){
//   for( const a of iter){
//     if(f(a)) { yield a; }
//   }
// });
// # iterable 적용
// L.filter = curry(function *(f, iter){
//   iter = iter[Symbol.iterator]();
//   let cur;
//   while(!(cur = iter.next()).done){
//     const a = cur.value;
//     if(f(a)){
//       yield a;
//     }
//   }
// });



/** =======================================
 *  지연성을 가진 entries
 * . { limit: 10, offset: 10, type: 'notice' }
 * -> [["limit": 10], ["offset": 10], ["type": "notice"]]
 ======================================= */
 L.entries = function* (obj){
   for(const k in obj){
     yield [k, obj[k]];
    }
  };

/** =======================================
 *  take Infinity
 ======================================= */
const takeAll = take(Infinity);


/** =======================================
 *  map
 * . iterable 프로토콜을 따르는 map 함수 정의
 * . 배열에 담을 값을 함수에 위임한다.
 ======================================= */
// # L.map 적용 코드
const map = curry(pipe(L.map, takeAll));

// # iterable 적용 코드
// const map = curry((f, iter) => {
//   let res = [];
//   iter = iter[Symbol.iterator]();
//   let cur;
//   while(!(cur = iter.next()).done){
//     const a = cur.value;
//     res.push(f(a))
//   }
//   // # 수정 전 코드
//   // for(const a of iter){
//   //   res.push(f(a)); // 인자로 받은 함수가 누적 값을 결정.
//   // }
//   return res;
// });



/** =======================================
 *  filter
 * . iterable 프로토콜을 따르는 filter
 * . 필터링의 조건을 함수에 위임
 ======================================= */
// # L.filter 적용.
const filter = curry(pipe(L.filter, takeAll));

// # iterable 적용 코드
// const filter = curry((f,iter) => {
//   let res = [];
//   iter = iter[Symbol.iterator]();
//   let cur;
//   while(!(cur = iter.next()).done){
//     const a = cur.value;
//     if(f(a)){res.push(a);}
//   }
//   // # 수정전 코드
//   // for(const a of iter){
//   //   if(f(a)){res.push(a);}
//   // }
//   return res;
// });



/** =======================================
*  isIterable
* . isIterable 객체인지 확인
======================================= */
const isIterable = a => a && a[Symbol.iterator];



/** =======================================
 *  L.flatten, faltten
 * . 내부 배열을 펼처서 하나의 배열로 만드는 역활.
 *   - eg) [...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]]
======================================= */
clear();
// # yield * 적용
L.flatten = function *(iter) {
  for (const a of iter){
    if(isIterable(a)){ // 이터러블일 경우 한번더 들어간다.
      yield *a; // 즉시 순회 후 평가
    }else{
      yield a;
    }
  }
};
// # 기본
// L.flatten = function *(iter) {
//   for (const a of iter){
//     if(isIterable(a)){ // 이터러블일 경우 한번더 들어간다.
//       for(const b of a){
//         yield a;
//       }
//     }else{
//       yield a;
//     }
//   }
// };

/** =======================================
 *  flatten
 * . 내부 배열을 펼처서 하나의 배열로 만드는 역활.
======================================= */
// # 즉시 평가 함수.
const flatten = pipe(L.flatten, takeAll);




/** =======================================
 *  L.deepFlat
 * . 깊은 iterable 을 모두 펼쳐준다.
======================================= */
L.deepFlat = function *f(iter){
  for(const a of iter){
    if(isIterable(a)) {
      yield *f(a); // 재귀 호출
    }else{
      yield a;
    }
  }
}




/** =======================================
 *  L.flatMap / flatMap
 * . flatten과 map 동시 적용.
 * . flatten과의 차이점은 함수를 이용해 변화를 줄 수 있다.
======================================= */
// ===== 지연 적인 flatmap
L.flatMap = curry(pipe(L.map, L.flatten));

// ===== 전체 평가
const flatMap = pipe(L.map, flatten);



/** =======================================
 * 지연된 함수열의 병렬적으로 평가하기
 * . C.reduce, C.take
 * . Promise는 미리 catch를 처리 해 놓으면 error를 뿜지 않는다. 대신 명시적으로 catch를 달면 잘 작동된다.
 *   - var a = Promise.reject('hi);
 *     a.catch(a => a); // 에러를 뿜지 않는다.
 *     a.catch(a => log(a, 'c')); // 나중에 catch 할 수 있다.
======================================= */
// ===== 아무것도 처리하지 않는 함수
function noop() { }
// ===== Promise일 경우 미리 먼저 catch를 해주고 아닐경우 아무것도 안한뒤 리턴한다.
const catchNoop = arr =>
  (arr.forEach(a => a instanceof Promise ? a.catch(noop) : a), arr);
// # 코드 정리
C.reduce = curry((f, acc, iter) => iter ?
  reduce(f, acc, catchNoop([...iter])) :
  reduce(f, catchNoop([...acc])));
// # symbol['nop'] 처리
// C.reduce = curry((f, acc, iter) => {
//   // 동시 평가.
//   const iter2 = catchNoop(iter ? [...iter] : [...acc]);
//   return iter ?
//     reduce(f, acc, iter2) :
//     reduce(f, iter2)
// });
// # 비동기가 일어나는 것을 기다리지 않고 동시 실행
// C.reduce = curry((f, acc, iter) => iter ?
//   reduce(f, acc, [...iter]) :
//   reduce(f, [...acc]));



/** =======================================
 * C.take
 * . 병렬적 동시 실행 후 지정된 수량만 가져오기.
======================================= */
C.take = curry((l, iter) => take(l, catchNoop([...iter])));
C.takeAll = C.take(Infinity);



/** =======================================
 * C.map
======================================= */
C.map = curry(pipe(L.map, C.takeAll));



/** =======================================
 * C.filter
======================================= */
C.filter = curry(pipe(L.filter, C.takeAll));