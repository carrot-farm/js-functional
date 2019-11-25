/** =======================================
 * async : await
======================================= */

// ===== 기본 사용법
// # Promise를 사용해 비동기 함수 작성
function delay(time){
  return new Promise(resolve => setTimeout(() => resolve(), time));
}
// # 딜레이 후 실행되는 함수 작성.
async function delayIdentity(a) {
  await delay(1000);
  return a;
}
// # async/await 를 사용해 비동기 함수를 동기처럼 사용.
/** async를 사용하는 함수는 Promise를 리턴한다. */
async function f1(){
  const a = await delayIdentity(10);
  const b = await delayIdentity(5);

  return a + b; // Promise를 리턴 한다.
}

// f1(); // <Promise>
// f1().then(log); // 15
// go(f1(), log); // 15
// (async () => {
//   log(await f1());
// })();

// const pa = Promise.resolve(10);
const pa = f1();
// (async () => {
//   log(await pa);
// })();



/** =======================================
 * [Q] Array.prototype.map이 있는데 애 FxJS의
 * map 함수가 필요한지?
 * [A] 비동기 제어를 간단하게 하고 array 타입외에도
 * iterable은 전부 지원하기 때문
======================================= */
async function delayI(a){
  return new Promise(resolve => setTimeout(() => resolve(a), 100));
}
// ===== 비동기 제어가 어려운 예
/**  */
async function f2(){
  const list = [1, 2, 3, 4];
  const res = await list.map(async a => await delayI(a * a));
  log(res);
}
// f2();

// ===== 비동기 제어가 쉬움
async function f3(){
  const list = [1, 2, 3, 4];
  const res = await map( a =>  delayI(a * a), list);
  log(res);
}
// f3();

// ===== 비동기 처리 값을 외부로 처리 하지 못하는 예
async function f4(){
  const list = [1, 2, 3, 4];
  const res = await map( a =>  delayI(a * a), list);
  log(res); // [1, 4, 9, 16]
  return res
}
// log(f4()); // <Promise>
// f4().then(log); // [1, 4, 9, 16]


/** =======================================
 * [Q] 이제 비동기는 async/await로 제어할 수 있는데
 * 왜 파이프라인이 필요한지?
 * [A] async/await 의 사용처는 비동기 상황을 문장형으로
 * 풀어놓기 위한것.
 * 파이프 라인은 함수를 합성하는 것이 목적.
======================================= */
function f5(){
  return go([1, 2, 3, 4, 5, 6, 7, 8],
    L.map(a => delayI(a * a)),
    L.filter(a => delayI(a % 2)),
    L.map(a => delayI(a + 1)),
    take(3),
    reduce((a, b) => delayI(a + b))
  );
}

// go(f5(), log);

// ===== 위와 같은 결과를 async / await 로 해결
async function f6(){
  let temp = [];
  const list = [1, 2, 3, 4, 5, 6, 7, 8];
  for(const a of list){
    const b = await delayI(a * a);
    if(await delayI(b % 2)){
      const c = await delayI(b + 1);
      log(c)
      temp.push(c);
      if(temp.length === 3) break;
    }
  }
  let res = temp[0], i = 0;
  while(++i < temp.length){
    res = await delayI(res + temp[i]);
  }
  return res;
}
// go(f6(), log);



/** =======================================
 * [Q] async / await 와 파이프라인을 같이 사용하기도 하는지?
 * [A] 같이 사용할수도 있다.
======================================= */
async function f52(list){
  const r1 = await go(list,
    L.map(a => delayI(a * a)),
    L.filter(a => delayI(a % 2)),
    L.map(a => delayI(a + 1)),
    C.take(3),
    reduce((a, b) => delayI(a + b))
    )
  const r2 = await go(list,
    L.map(a => delayI(a * a)),
    L.filter(a => delayI(a % 2)),
    reduce((a, b) => delayI(a + b))
    )
  const r3 = await delayI(r1 + r2);

  return r3 + 10;
}
// go(f52([1, 2, 3, 4, 5, 6, 7, 8]), a => log(a, 'f52'));



/** =======================================
 * [Q] 동기 상황에서 에러 핸들링은 어떻게 해야 하는지?
 * [A] 다음과 같이 try...catch 사용.
======================================= */
function f7(list){
  try{
    return list
      .map(a => a + 10)
      .filter(a => a % 2)
      .slice(0, 2);
  }catch(e){
    return [];
  }
}
// log(f7([1, 2, 3]));
// log(f7([null]));



/** =======================================
 * [Q] 비동기 상황에서 에러 핸들링은 어떻게 해야 하는지?
 * [A] 파이프라인을 통해서 에러 핸들링을 하면 된다.
======================================= */
// ===== 비동기 에러 핸들링은 어렵다.
function f8(list){
  try{
    return list
      .map(a => new Promise(resolve => {
        resolve(JSON.parse(a));
      }))
      .filter(a => a % 2)
      .slice(0, 2);
  }catch(e){
    log('> Error : ', e); // 이쪽으로 로그가 찍히지 않는다.
    return [];
  }
}
// log(f8([1, 2, 3, '{']));
// f8([1, 2, 3, '{']).then(log).catch(_ => (log('> error : ', _))); // 여기도 안찍힌다.


// ===== 파이프 라인으로 에러 핸들링
// # 외부에서 에러 핸들링
function f9(list){
  try{
    return go(
      list,
      map(a => new Promise(resolve => {
        resolve(JSON.parse(a));
      })),
      filter(a => a % 2),
      take(2))

  }catch(e){
    log('> ________________ ', e); // 여기는 찍히지 않는다.
    return [];
  }
}
// f9([1, 2, 3, '{']).then(log).catch(_ => (log('> 에러 핸들링 : ', _))); // 여기서 에러 핸들링 된다.

// # 외부에서 핸들링하는 경우2
function f10(list){
  try{
    return Promise.reject('> ~~~~~~ : ');
  }catch(e){
    log('> ________________ ', e); // 여전히 안찍힌다.
    return [];
  }
}
// f10([1, 2, 3, '{']).then(log).catch(_ => (log('> 에러 핸들링 : ', _))); // 이곳은 에러 찍힘

// # 내부에서 에러 핸들링을 하기 위해서는 내부에 reject가 찍혀 있고 async await 처리가 되어 있어야 한다.
async function f11(list){
  try{
    return await Promise.reject('> ~~~~~~ : ');
  }catch(e){
    log('> 내부 에러 로그 ', e); // 드디어 찍힌다.
    return [];
  }
}
// f11([1, 2, 3, '{']).then(log).catch(_ => (log('> 에러 핸들링 : ', _))); // 여기는 안찍힘.

// # 파이프 라인 + 내부 에러 핸들링.
async function f12(list){
  try{
    // 리턴값이 Promise여야 한다.
    return await go(
      list,
      map(a => new Promise(resolve => {
        resolve(JSON.parse(a));
      })),
      filter(a => a % 2),
      take(2)
    );
  }catch(e){
    log('> 내부 에러 로그 ', e); // 찍힘
    return [];
  }
}
f12([1, 2, 3, '{']).then(log).catch(_ => (log('> 에러 핸들링 : ', _))); // 여기는 안찍힘.