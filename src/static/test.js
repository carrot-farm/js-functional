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

// ===== 제품 관련 모듈화
const Product = {};

// ===== name space 로 모듈화 products를 리턴하는 함수.
// db의 값을 가져온다고 가정.
Product.list = () => products;
Product.list.tmpl = products => `
<table>
    <tr>
    <td>이름</td>
    <td>이름</td>
    <td>이름</td>
    <td>이름</td>
    </tr>
    ${products
      .map(
        p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>${p.price * p.quantity}</td>
        </tr>
    `
      )
      .join("")}
    
</table>
`;

// ===== 텍스트를 엘리먼트로 변경
const el = html => {
  // 엘리먼트를 생성
  const wrap = document.createElement("div");
  // 엘리먼트내에 텍스트 삽입
  wrap.innerHTML = html;
  // 변환된 엘리먼트 반환
  return wrap.children[0];
};

// ===== 엘리먼트 쿼리 셀렉터
const $ = (selector, parent = document) => document.querySelector(selector);

// ===== append child
const append = (parent, child) => parent.appendChild(child);

// ===== 페이지 내 데이터 삽입 함수
const openPage = (title, dataFn, tmplFn) =>
  append(
    $("body"),
    el(`
        <div class="page">
            <h2 class="title">${title}</h2>
            <div class="content">${tmplFn(dataFn())}</div>
        </div>
    `)
  );

// ===== body 내에 리스트 삽입
document.addEventListener("click", () =>
  openPage("상품 목록", Product.list, Product.list.tmpl)
);
// append($("body"), el(Product.list.tmpl(Product.list())));

// document
//   .querySelector("body")
//   .appendChild(el(Product.list.tmpl(Product.list())));

// console.log(el(Product.list.tmpl(Product.list())));
