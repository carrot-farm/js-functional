// ===== 더미 제품들 파일
const products = [
  { name: "반팔티", price: 15000, quantity: 1, selected: true },
  { name: "긴팔티", price: 20000, quantity: 2, selected: false },
  { name: "핸프폰케이스", price: 15000, quantity: 3, selected: true },
  { name: "후드티", price: 30000, quantity: 4, selected: false },
  { name: "바지", price: 25000, quantity: 5, selected: false },
  { name: "반팔티", price: 15000, quantity: 1, selected: true },
  { name: "반팔티", price: 15000, quantity: 1, selected: true },
  { name: "긴팔티", price: 20000, quantity: 2, selected: false },
  { name: "핸프폰케이스", price: 15000, quantity: 3, selected: true },
  { name: "후드티", price: 30000, quantity: 4, selected: false },
  { name: "바지", price: 25000, quantity: 5, selected: false },
  { name: "긴팔티", price: 20000, quantity: 2, selected: false },
  { name: "핸프폰케이스", price: 15000, quantity: 3, selected: true },
  { name: "후드티", price: 30000, quantity: 4, selected: false },
  { name: "바지", price: 25000, quantity: 5, selected: false }
];

const Product = {};
// 제품 리스트를 리턴하는 함수. db내용을 조회하는 함수라고 친다.
Product.list = () => products;
