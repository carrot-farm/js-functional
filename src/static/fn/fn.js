const log = console.log;

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

// ===== 필터
function* filter(f, iter){
  for(const a of iter){
    // 어떤 조건일 때 필터링을 할것인지 인자로 받은 함수에 위임한다.
    if(f(a)){
      yield a;
    }
  }
}

// ===== 리스트가 있다면 함수에 값을 넘겨 주면서 실행 시킨다.
function* map(f, iter){
  for(const a of iter){
    yield f(a);
  }
}

// ===== 지정된만큼 값을 저장 후 리턴
function take(length, iter){
  let res = [];
  for(const a of iter){
    // 순회한 값을 배열에 집어 넣는다.
    res.push(a);
    // 지정된 length 와 length가 같을 경우에는 저장된 값을 리터
    if(res.length === length){ return res; }
  }
  return res;
}

// ===== 더하기
const add = (a, b) => {
  return a + b;
}

// ===== 값을 누적 처리 함수에게 위임 한다.
function reduce(f, acc, iter) {
  if(arguments.length === 2){
    iter = acc[Symbol.iterator](); // acc의 iterator을 넘김.
    acc = iter.next().value;
  }
  for(const a of iter){
    log('> a', a)
    acc = f(acc, a);
  }
  return acc;
}

// ===== 함수 자체를 축약.
// a로 시작해서 함수가 들어올 경우 a로 시작해서 함수로 누적해 나간다.
const go = (a, ...fs) => reduce((a, f) =>f(a), a, fs);

// ===== 리스트에서 홀수를 length 만큼 뽑아서 제곱한 후 모두 더하기.
const  f = (list, length) =>
   reduce( add, 0,
    take(length,
      map(a => a * a,
        filter( a => a % 2, list))));

// ===== 실행 함수
function main(){
  // log(f([1, 2, 3, 4, 5], 1));
  // log(f([1, 2, 3, 4, 5], 2));
  // log(f([1, 2, 3, 4, 5], 3));
}

// ===== 실행
main();
