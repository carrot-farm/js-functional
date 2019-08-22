const log = console.log;

// // ===== 기본 구조
// // ===== 리스트에서 홀수를 length 만큼 뽑아서 제곱한 후 모두 더하기.
// function f(list, length){
//   let i = 0; // 홀수의 누적 횟수를 파악할 변수.
//   let acc = 0; // 숫자를 누적할 변수
//   for(const a of list){
//     if(a % 2){ // 홀수일 경우만
//       acc = acc + a * a;
//       // length 와 같아졌을 경우 순회 중단.
//       if(++i === length){
//         break;
//       }
//     }
//   }
//   log(acc);
// }

// // ===== 실행 함수
// function main(){
//   f([1, 2, 3, 4, 5], 1);
//   f([1, 2, 3, 4, 5], 2);
//   f([1, 2, 3, 4, 5], 3);
// }

// // ===== 실행
// main();

// ===== 커링
// 인자가 2개 이상일 경우는 함수에 인자를 전부 넘기면서 실행을 하고
// 인자가 1개일 경우는 다음에 ...bs를 받는 함수를 리턴하면서
// 다음번에 실행되도록 한다.
/*
  사용법 add에 적용시. 실행한 결과에 연산이 가능하다.
  const add = curry((a, b) =>  a + b);
  usage) add(10)(5)
*/
const curry = f => (a, ...bs) =>
  bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs);

  // ===== 지연적으로 동작하는 함수에 네임 스페이스 적용.
const L = {};

// ===== 지정된 숫자 만큼 반복해서 실행한다.
// eg) [...L.range(5)] // [0, 1, 2, 3, 4, 5]
// 아래와 같이 하면 평가를 안하기 때문에 무한 수열을 평가가 가능 하다.
// var it =  L.range(Infinity);
// it.next(); // {value: 0, done: false}.
// 위와 같이 무한 수열이라도 브라우저를 죽이지않고 무한수를 처리 가능하다.
L.range = function *(stop) {
  let i = -1;
  while(++i < stop){
    yield i;
  }
};


// ===== 필터
// 제너레이터를 적용해 전체 순회를 하지 않고 지정된 횟수만 순회한다.
// 지연적 동작
// function* filter(f, iter){
//   for(const a of iter){
//     // 어떤 조건일 때 필터링을 할것인지 인자로 받은 함수에 위임한다.
//     if(f(a)){
//       yield a;
//     }
//   }
// > 커리 적용 후
L.filter = curry(function*(f, iter){
  for(const a of iter){
    // 어떤 조건일 때 필터링을 할것인지 인자로 받은 함수에 위임한다.
    if(f(a)) yield a;
  }
});

// ===== 리스트가 있다면 함수에 값을 넘겨 주면서 실행 시킨다.
// function* map(f, iter){
//   for(const a of iter){
//     yield f(a);
//   }
// }
// > 커리 적용 후
L.map = curry(function*(f, iter){
  for(const a of iter){
    yield f(a);
  }
});

// ===== 지정된만큼 값을 저장 후 리턴
// function take(length, iter){
//   let res = [];
//   for(const a of iter){
//     // 순회한 값을 배열에 집어 넣는다.
//     res.push(a);
//     // 지정된 length 와 length가 같을 경우에는 저장된 값을 리터
//     if(res.length === length){ return res; }
//   }
//   return res;
// };
// > 커리 적용 후
const take = curry(function (length, iter){
  let res = [];
  for(const a of iter){
    // 순회한 값을 배열에 집어 넣는다.
    res.push(a);
    // 지정된 length 와 length가 같을 경우에는 저장된 값을 리터
    if(res.length === length){ return res; }
  }
  return res;
})




// ===== 더하기
// const add = (a, b) =>  a + b;
// > 커리 적용 후
const add = curry((a, b) =>  a + b);

// ===== 값을 누적 처리 함수에게 위임 한다.
// function reduce(f, acc, iter) {
//   // 3번째가 아닌 2번째 파라메터가 이터레이터 일 경우 처리.
//   if(arguments.length === 2){
//     iter = acc[Symbol.iterator](); // acc의 iterator을 넘김.
//     acc = iter.next().value;
//   }
//   for(const a of iter){
//     // log('> a', a)
//     acc = f(acc, a);
//   }
//   return acc;
// }
// > 커리 적용 후
const reduce = curry(function(f, acc, iter) {
  // 3번째가 아닌 2번째 파라메터가 이터레이터 일 경우 처리.
  if(arguments.length === 2){
    iter = acc[Symbol.iterator](); // acc의 iterator을 넘김.
    acc = iter.next().value;
  }
  for(const a of iter){
    // log('> a', a)
    acc = f(acc, a);
  }
  return acc;
})

// ===== 함수 자체를 축약.
// a로 시작해서 함수가 들어올 함수로 누적해 나간다.
// 실행되면 다음과 같은형태로 동작한다. eg) add(add(1, 2), 3)
// const go = (a, ...fs) => reduce((a, f) =>f(a), a, fs);
// > 발전형
const go = (...as) => reduce((a, f) => f(a), as);

// ===== 리스트에서 홀수를 length 만큼 뽑아서 제곱한 후 모두 더하기.
// 위의 기본 절차형 프로그래밍을 함수형으로 작성 한것이다.
const  f = (list, length) =>
   reduce( add, 0,
    take(length,
      L.map(a => a * a,
        L.filter( a => a % 2, list))));

// ===== go를 사용해 위의 f를 더욱 읽기 좋게 만든다.
// 위에서 아래로, 왼쪽에서 오른쪽으로 읽혀서 명령형과 비슷하다.
// > 커리 적용 전
// const f2 = (list, length) => go(
//   list,
//   list => filter(a  => a % 2 list),
//   list => map(a => a * a, list),
//   list => take(length, list),
//   list => reduce(add, 0, list),
// );

// > 커리 적용 후 1
// const f2 = (list, length) => go(
//   list,
//   list => filter(a  => a % 2)(list),
//   list => map(a => a * a)(list),
//   list => take(length)(list),
//   list => reduce(add)(list),
// );

// > 커리 적용 후 2
// 커리 적용 하면 다음과 같이 전달하는 부분을 없애도 된다.
const f2 = (list, length) => go(
  list,
  L.filter(a  => a % 2), // 홀수만 남기고
  L.map(a => a * a), // 전부 제곱을 한다음
  take(length), // 몇개를 뽑은 뒤
  reduce(add)); // 모두 더하라

// ===== 실행 함수
function main(){
  // log(f2([1, 2, 3, 4, 5], 1));
  log(f2([1, 2, 3, 4, 5], 2));
  // log(f2([1, 2, 3, 4, 5], 3));
  log(f2(L.range(Infinity), 200)); // 무한대에서 200개  만큼의 값을 꺼낸다.
}

// ===== 실행
main();

console.clear();
// ## 2차원 배열.
const arr = [
  [1, 2],
  3, 4, 5,
  [6, 7, 8],
  [9, 10]
];

// ===== 이터러블 객체를 받아서 이터러블 객체가 맞다면 for문을 더 돌린다.
// [...L.flat(arr)] // [1,2,3,4,5,6,7,8,9,10]
// > 2차원 배열만 처리
L.flat = function* (iter){
  for( const a of iter){
    // a가 이터러블 객체가 맞다면 한번더 for문을 돌린다.
    if(a && a[Symbol.iterator]){
      yield* a;
    }else{
      yield a;
    }
  }
};

// ===== 플랫 사용 예제
go(arr, // 2차원 배열을
  L.flat, // flat 하면서
  L.filter(a => a % 2), // 홀수만
  L.map(a => a * a), // 제곱 한 후
  take(2), // 3개만 처리 한다. (위의 배열 1,2,3 까지 처리)
  reduce(add), // 누적 합산을 한다.
  log
);

// ## 유저 목록
console.clear();
const users = [
  {
    name: 'a', age: 21, family: [
      {name: 'a1', age: 53}, {name: 'a2', age: 47},
      {name: 'a3', age: 16}, {name: 'a4', age: 14},
    ]
  },
  {
    name: 'b', age: 24, family: [
      {name: 'b1', age: 58}, {name: 'b2', age: 51},
      {name: 'b3', age: 10}, {name: 'b4', age: 22},
    ]
  },
  {
    name: 'c', age: 31, family: [
      {name: 'c1', age: 63}, {name: 'c2', age: 62},
    ]
  },
  {
    name: 'd', age: 20, family: [
      {name: 'd1', age: 42}, {name: 'd2', age: 42},
      {name: 'd3', age: 11}, {name: 'd4', age: 7},
    ]
  },
];

// family중 20대 미만을 대상으로 2명의 나이를 합산한다.
go(users,
  L.map(u => u.family), // family만을 대상으로 한 2차원 배열로 전환
  L.flat, // flat 하면서
  L.filter(u => u.age < 20), // age가 20미만인 대상만 필터링
  L.map(u => u.age), // 나이 데이터만 뽑음.
  take(2), // 2명만 뽑음.
  reduce(add), // 누적 합산을 한다.
  // _ => [..._], // 전개연산자로 배열 전체 평가
  log
);


