/** =======================================
 * 지연평가 + Promise - L.map, map, take
======================================= */
// ===== 일반적인 평가
go(
  [1, 2, 3],
  L.map(a => a + 10),
  take(2),
  log // [11, 12]
);

// ===== 비동기 상활일 때의 동작
/**
 * . 동작하기 위해 L.map() 에 go1() 적용
 * . take 적용
 */
go(
  [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)],
  L.map(a => a + 10),
  take(2),
  // log
  );



/** =======================================
 * Kleisli Composition - L.filter, filter, nop, take
======================================= */
clear();
go(
  [Promise.resolve(5), 1, 2, 3, 4],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => a % 2 === 1),
  L.map(a => a * a),
  takeAll,
  // log
)


/** =======================================
 * reduce 에서 nop 지원.
======================================= */
clear();
go([Promise.resolve(2), 2, 3, 4],
  L.map(a => Promise.resolve(a * a)),
  L.filter(a => Promise.resolve(a % 2)),
  reduce(add),
  // log
  );



/** =======================================
 * 지연평가 + Promise 의 효율성
======================================= */
// ===== 오랜 시간이 걸리는 것도 해당 지연 시간에 따라 처리된다.
go([Promise.resolve(2), 2, 3, 4],
  L.map(a => new Promise(resolve => setTimeout(() =>resolve(a * a), 1000))),
  L.filter(a => Promise.resolve(a % 2)),
  take(2), // 2개의 Promise만 평가하고 나머지는 평가 안한다.
  // log
);



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
const C = {}; // 병렬 실행
// # symbol['nop'] 처리
C.reduce = curry((f, acc, iter) => {
  // 동시 평가.
  const iter2 = catchNoop(iter ? [...iter] : [...acc]);
  return iter ?
    reduce(f, acc, iter2) :
    reduce(f, iter2)
});

// # 비동기가 일어나는 것을 기다리지 않고 동시 실행
// C.reduce = curry((f, acc, iter) => iter ?
//   reduce(f, acc, [...iter]) :
//   reduce(f, [...acc]));

// ===== 병렬적 동시 실행 후 지정된 수량만 가져오기.
C.take = curry((l, iter) => take(l, catchNoop([...iter])));

const delay500 = a => new Promise(resolve =>
  setTimeout(() => resolve(a), 500));

const delay1000 = a => new Promise(resolve =>
  setTimeout(() => resolve(a), 1000));

// ===== 비동기를 순차 실행 후 누적. 오래걸림
go([1, 2, 3, 4, 5],
  L.map(a => delay500(a * a)),
  L.filter(a => a % 2),
  reduce(add),
  log
  );

// ===== 비동기를 동시 실행 후 누적
go([1, 2, 3, 4, 5],
  L.map(a => delay1000(a * a)),
  L.filter(a => delay500(a % 2)),
  L.map(a => delay1000(a * a)),
  C.reduce(add), // 이곳에서 한번에 실행 시킨다.
  log
  );

// ===== 비동기를 제한된 숫자 동시 실행 후 평가
go([1, 2, 3, 4, 5], // 전부 실행
  L.map(a => (log('> L.map : ', a), delay1000(a * a))), // 전부 실행
  L.filter(a => (log('> L.filter : ', a), delay500(a % 2))), // 전부 실행
  L.map(a => delay1000(a * a)), // 전부 실행
  C.take(2), // 병렬적으로 모두 실행 시킨뒤 2개의 값만 꺼낸다.
  log
  );