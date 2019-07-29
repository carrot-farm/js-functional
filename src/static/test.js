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

// fltmxm템플릿
Product.list.tmpl = products =>
  `<table>
    <tr>
      <td>이름</td>
      <td>가격</td>
      <td>수량</td>
      <td>합계</td>
    </tr>
    ${products
      .map(
        p =>
          `<tr>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td>${p.quantity}</td>
            <td>${p.price * p.quantity}</td>
          </tr>`
      )
      .join("")}
  </table>`;

// ===== 텍스트를 엘리먼트로 만들어 넣는다.
const el = html => {
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  return wrap.children[0];
};

// ===== !리스트 출력 1.
// // flow: 리스트 객체 -> 템플릿 문자열 -> 엘리먼트에 집어 넣기
// document
//   .querySelector("body")
//   .appendChild(
//     el(Product.list.tmpl(Product.list()))
//   );

// ===== 셀렉터를 절차형에 함수형으로
const $ = (selector, parent = document) => parent.querySelector(selector);

// ===== append를 함수형으로
const append = (parent, child) => parent.appendChild(child);

// ===== remove class. el에서 remove class 한뒤 el을 다시 리턴.
const removeClass = (name, el) => (el.classList.remove(name), el);

// ===== hide 클래스를 삭제 후 엘리먼트 리턴.
// 애니메이션을 위해서는 비동기로 처리해야 한다.
const show = el => setTimeout(() => removeClass('hide', el), 1);

// ===== !리스트 출력 2. flow를 함수형으로 다시 작성.
// append($("body"), el(Product.list.tmpl(Product.list())));

// ===== !리스트 출력 3.
const openPage = (title, dataFn, tmplFn) =>
  show(
    append(
      $("body"),
      el(
        `<div class="page hide">
        <h2 class="title">${title}</h2>
        <div class="content">${tmplFn(dataFn())}</div>
      </div>`
      )
    )
  );

document.addEventListener('click', () =>
  openPage(
    "상품목록",
    Product.list,
    Product.list.tmpl));
