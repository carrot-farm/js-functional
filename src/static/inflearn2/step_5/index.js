/** =======================================
 * Map, Set
 * . 이터러블로 다루기
 * . 이터러블을 지원하기 때문에 원하는 효과를 적용뒤 다시 해당 자료구조로 만들면된다.
======================================= */
// ===== Map
let m = new Map();
m.set('a', 1);
m.set('b', 2);
m.set('c', 3);

_.go(
  m,
  L.filter(([k, v]) => v % 2),
  _.takeAll,
  entries => new Map(entries), // 필터링 한것을 다시 Map으로 만든다.
  console.log
);

// ===== Set
let s = new Set();
s.add(10);
s.add(20);
s.add(30);

const add = (a, b) => a + b;
console.log(_.reduce(add, s)); // 축약
_.go(
  s,
  _.reduce(add),
  console.log
)




/** =======================================
 * 객체지향과 와 같이 사용하기
 * . 클래스에서 이터러블을 지원하게 정의하면 사용가능 하다.
======================================= */
console.clear();
// ===== Model 정의
class Model {
  constructor(attrs = {}){
    this._attrs = attrs;
  }
  get(k) {
    return this._attrs[k];
  }
  set(k, v) {
    this._attrs[k] = v;
    return this;
  }
}

// ===== Collection 정의
class Collection {
  constructor(models = []){
    this._models = models;
  }

  at(idx){
    return this._models[idx];
  }

  add(model){
    this._models.push(model);
    return this;
  }

  // # 이터러블 지원 1
  // *[Symbol.iterator](){
  //   // 다음과 같이 정의
  //   // for(const model of this._models){
  //   //   yield model;
  //   // }
  //   // 간단하게 정리
  //   yield *this._models;
  // }

  // # 이터러블 지원 2(models 가 배열이기 때문에 이터러블을 지원하고 있다.)
  [Symbol.iterator](){
    return this._models[Symbol.iterator]();
  }
}

// ===== 클래스 사용
// const coll = new Collection();
// coll.add(new Model({id: 1, name: 'AA'}));
// coll.add(new Model({id: 3, name: 'BB'}));
// coll.add(new Model({id: 5, name: 'CC'}));
// console.log(coll);
// console.log(coll.at(2).get('name')); // CC
// console.log(coll.at(1).get('id')); // 3

// // # 클래스에서 이터러블을 지원안할 때 객체 접근 방법
// _.go(
//   L.range(3), // 순회 회수 지정
//   L.map(i => coll.at(i)), // 0~2 까지의 Model 접근
//   L.map(m => m.get('name')), // model의 name 반환
//   _.each(console.log) // AA BB CC
// )

// // # 이터러블 지원시 접근 방법(class 내에서 model을 지원해야 한다.)
// _.go(
//   coll,
//   L.map(m => m.get('name')), // model의 name 반환
//   _.each(console.log) // AA BB CC
// )




/** =======================================
 * 이터러블을 구현한 클래스를 상속 받았을 때 사용법
======================================= */
console.clear();
class Product extends Model {}

class Products extends Collection {
  getPrices(){
    return L.map(p => p.get('price'), this);
  }

  // # 합계 금액을 구하는 메소드
  totalPrice(){
    // 일반적인 방법
    // let total = 0;
    // this._models.forEach(product => {
    //   total += product.get('price');
    // })
    // return total;

    // 이터러블을 이용한 방법
    return _.go(this,
      L.map(p => p.get('price')),
      _.reduce((a, b) => a + b)
    )
  }
}

const products = new Products();
products.add(new Product({id: 1, price: 10000}));
console.log(products.totalPrice());
products.add(new Product({id: 3, price: 25000}));
console.log(products.totalPrice());
products.add(new Product({id: 5, price: 35000}));
console.log(products.totalPrice());
console.log([...products.getPrices()]);

