const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total')

const getGoods = async function() {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Error:' + result.status;
	}
	return result.json();
}

const cart = {
	cartGoods: [],
	renderCard() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr');
			trGood.className ='cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price*count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + (item.price * item.count);
		}, 0);

		cardTableTotal.textContent = totalPrice + '$';
	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCard();

	},
	minusGood(id) {
		for( const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
				
			}
		}
		this.renderCard();
	},
	plusGood(id) {
		for( const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCard();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem ) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price, count}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1,  
					});
				});
		}
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart'); 
	if (addToCart) {
		console.log("Received");
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if(target.classList.contains('cart-btn-delete')) {
		const parent = target.closest('.cart-item');
		cart.deleteGood(parent.dataset.id);
	} 
	if(target.classList.contains('cart-btn-plus')) {
		const parent = target.closest('.cart-item');
		cart.plusGood(parent.dataset.id);
	}
	if(target.classList.contains('cart-btn-minus')) {
		const parent = target.closest('.cart-item');
		cart.minusGood(parent.dataset.id);
	}
})

const openModal = function() {
	cart.renderCard();
	modalCart.classList.add('show');
}

const closeModal = function() {
	modalCart.classList.remove('show');
}

modalCart.onclick = function(event) {
	let target = event.target; 
	if (target.tagName != 'DIV') return; 
	closeModal(); 
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);


// scroll smooth

const scrollLinks = document.querySelectorAll('a.scroll-link');

(function() {
	for(const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function(event) {
			event.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		});
	}
})()


//goods

const buttonMore = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const createCard = function (objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	
	card.innerHTML = `
		<div class="goods-card">
			${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
			
			<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">$${objCard.price}</span>
			</button>
		</div>`;

	return card;
};

const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);

	document.body.classList.add('show-goods');
};

buttonMore.addEventListener('click', function(event) {
	event.preventDefault();
	getGoods().then(renderCards);
})

const filterCards = function (field, value) {
	getGoods()
		.then(function (data) {
			const filteredGoods = data.filter( function (good) {
				return good[field] === value
			})
			return filteredGoods;
		})
		.then(renderCards);
}

navigationLink.forEach(function(link) {
	link.addEventListener('click', function(event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
})

// ALL link

const allLink = document.querySelector("#all-link");

allLink.addEventListener('click', event => {
	event.preventDefault();
	getGoods().then(renderCards);	
})


const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

modalForm.addEventListener('submit', event => {
	event.preventDefault();

	const formData = new FormData(modalForm);
	formData.append('cart', JSON.stringify(cart.cartGoods));

	postData(formData)
		.then(response => {
			if(!response.ok) {
				throw new Error(response.status)
			}
			alert('Your order succsessfully sent');
		})
		.catch(err => {
			alert('Error on server');
			console.error(err)
		})
		.finally(() => {
			closeModal();
			modalForm.reset();
			cart.cartGoods.length = 0;
		});
})

