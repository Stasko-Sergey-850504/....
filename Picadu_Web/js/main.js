// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию 
menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
  event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
  menu.classList.toggle('visible');
})

const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const loginExit = document.querySelector('.exit');

const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');


const listUsers = [
  {
    email: 'maks@mail.com',
    password: '123',
    displayName: 'MaksJS',
  },
  {
    email: 'kate@mail.com',
    password: '12345',
    displayName: 'KateKillMaks',
  }
];

const setUsers = {
  user: null,
  logIn(email, password, handler) {
    const user = this.getUser(email);
    if(this.validateEmail(email)) {
      if (user && user.password === password) {
        this.autorizedUser(user);
        handler();
      } else {
        alert('Пользователь с такими данными не существует');
      }
    } else {
      alert('Неверный формат email')
    }
  },
  logOut() {
    loginElem.style.display = '';
    userElem.style.display = 'none';
  },
  signUp(email, password, handler) {
    if (!this.getUser(email)) {
      const user = {email, password, displayName: email.split('@')[0]};
      listUsers.push(user);
      this.autorizedUser(user)
      handler();
    } else {
      allert('Пользователь с таким email зарегистрирован');
    }
  },
  getUser(email) {
    return listUsers.find(item => item.email === email);
  },
  autorizedUser(user) {
    this.user = user;
  },
  validateEmail(email) {
    const regularEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularEmail.test(email);
  }
};

const toggleAuthDom = () => {
  const user = setUsers.user;
  
  if(user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
  }
}


loginForm.addEventListener('submit', event => {
  event.preventDefault();
  
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value 
  
  setUsers.logIn(emailValue, passwordValue, toggleAuthDom);
});

loginSignup.addEventListener('click', event => {
  event.preventDefault();
    
  const emailValue = emailInput.value;
  const passwordValue = passwordlInput.value 
  
  setUsers.signUp(emailValue, passwordValue, toggleAuthDom);
});

loginExit.addEventListener('click', event => {
  event.preventDefault();
  setUsers.logOut();
})

toggleAuthDom();
