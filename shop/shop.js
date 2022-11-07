let cart = {};
let goods= {};
const gallary = document.querySelector('.shop-field');

//function getting data from localStorage
function loadCartFromStorage(){
    if (localStorage.getItem('cart') != undefined){
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    console.log(cart);
}

loadCartFromStorage();

fetch(
    "https://opensheet.elk.sh/1kEEBOCBCuyBKXM3_q678qpDZg16HR8o6BRNo0ywYAvk/Test+Sheet"
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      gallary.innerHTML = showGoods(data);
      goods= arrayHelper(data);
      console.log(goods);
      showCart();
      data.forEach((row) => {
        // Do something with each row here.
      });
    });


function showGoods(data){
    
    let out = '';
    for(let i=0; i<data.length; i++){
      m = data[i]
      if (m['show'] != 0) {
      out += `<div class="col-lg-3 col-md-3 col-sm-2 text-center">`;
      out += `<div class="goods">`;
      out += `<h5>${m['name']}</h5>`;
      out += `<img src="${m['image']}" alt="">`;
      out += `<p class="cost">Цена:${m['cost']}</p>`;
      out += `<p class="cost">На складе:${m['kg']}кг</p>`;
      out += `<p class="cost"><button type="button" class="btn btn-success" name="add-to-card" data="${m['id']}">Купить</button></p>`;
      out += `</div>`;
      out += `</div>`;
      }


    }
    return out;
}

document.onclick = function(e){
    if (e.target.attributes.name != undefined){
        if (e.target.attributes.name.nodeValue == 'add-to-card'){
            addToCart(e.target.attributes.data.nodeValue);
        }
        else if (e.target.attributes.name.nodeValue == 'delete-goods'){
            delete cart[e.target.attributes.data.nodeValue];
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
        else if (e.target.attributes.name.nodeValue == 'plus-goods'){
            cart[e.target.attributes.data.nodeValue]++;
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
        else if (e.target.attributes.name.nodeValue == 'minus-goods'){
            if (cart[e.target.attributes.data.nodeValue] - 1 == 0){
                delete cart[e.target.attributes.data.nodeValue];
            }
            else {
                cart[e.target.attributes.data.nodeValue]--;
            }
            showCart();
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
        }
        else if (e.target.attributes.name.nodeValue == 'buy'){
            var data = {
                name : document.getElementById('customer-name').value,
                email : document.getElementById('customer-email').value,
                phone : document.getElementById('customer-phone').value,
                cart : cart,
            }
            fetch("php_mail/mail.php",
            {
                method: "POST",
                body: JSON.stringify(data)
            })
            .then(function(res){
                console.log(res);
                if (res){
                    alert('Ваш заказ отправлен!');
                }
                else {
                    alert('Ошибка заказа!');
                }
            })
        }
    }
    return false;
}

function addToCart(elem){
    if (cart[elem] !== undefined) {
        cart[elem]++;
    }
    else {
        cart[elem]=1;
    }
    console.log(cart);
    showCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function arrayHelper(arr){
    let out = {};
    for (let i=0; i<arr.length; i++){
        let temp = {}
        temp['vendorcode'] = arr[i]['vendorcode']
        temp['name'] = arr[i]['name']
        temp['cost'] = arr[i]['cost']
        temp['image'] = arr[i]['image']
        out[arr[i]['id']] = temp;
    }
    return out;
}

function showCart(){
    let ul = document.querySelector('.cart');
    ul.innerHTML = '';
    let sum = 0;
    for (let key in cart){
        let li = '<li>';
        li += goods[key]['name'] + ' ';
        li += ` <button name="minus-goods" data="${key}">-</button> `
        li += cart[key] + 'шт ';
        li += ` <button name="plus-goods" data="${key}">+</button> `
        li += goods[key]['cost']*cart[key] + ' $';
        li += ` <button name="delete-goods" data="${key}">x</button>`
        li += '</li>';
        sum += goods[key]['cost']*cart[key];
        ul.innerHTML += li;
    }
    ul.innerHTML += 'Итого: ' + sum + ' $';
}

