const API_URL = 'http://localhost:3000';

Vue.component('search', {
    data() {
        return {
            searchQuery: ''
        }
    },
    template:`
        <form class="search">
           <input v-model="searchQuery" class="nav-left__input" type="text" placeholder="Search for Item...">
               <button class=" nav-left__search button" type="submit" @click.prevent="handleSearchClick">
                  <i class="fas fa-search"></i>
             </button>
        </form>
    `,
    methods: {
        handleSearchClick(){
            this.$emit('onsearch', this.searchQuery);
        }
    }
});


Vue.component('modal', {
props: ['users'],
    data() {
    return {
        name: '',
        login: '',
        password: '',
        mail: '',
        changePassword: '',
        showChangePassword: false,
    }
},
methods: {
    handleSignUp() {
        fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: this.login,
                password: this.password,
                name: this.name,
                mail: this.mail,
            })
        })
            .then((response) => response.json())
            .then((item) => {
                this.users.push(item);
            });
    },
    handleSignIn() {
        const userReg = this.users.find((user) => user.login === this.login && user.password === this.password);
        if (userReg === undefined) {
            localStorage.clear();
            console.log('Error');
        } else {
            localStorage.setItem('user', userReg.login);
            localStorage.setItem('userId', userReg.id);
        }
        window.location.reload();
    },
    handleLogOut() {
        localStorage.clear();
        window.location.reload();
    },
    handleChangePassword() {
        const id = localStorage.getItem('userId');
        fetch(`${API_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password: this.changePassword}),
        })
            .then((response) => response.json())
            .then((item) => {
                const itemIdx = this.users.findIndex((entry) => entry.id === item.id);
                Vue.set(this.users, itemIdx, item);
            });
    },
},
template: `
           <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div v-if="localStorage.getItem('user') === null" class="tabs">
                        <input type="radio" name="tab" id="sign-in" class="tab-input" checked>
                        <label for="sign-in" class="tab">Sign-in</label>
                        <input type="radio" name="tab" class="tab-input" id="sign-up" >
                        <label for="sign-up" class="tab">Sign-up</label>
                        <div class="content">
                            <button class="modal-button button-close" type="button" @click="$emit('close')">
                            <i class="far fa-times-circle"></i>
                            </button>
                            <div class="sign-in">
                                <h3>
                                    Already Register? Login Now!
                                </h3>
                                <form action="#" class="reg">
                                    <label>
                                        <input type="text" name="login" placeholder="Enter Your Login" class="reg__input" v-model="login">
                                    </label>
                                    <label>
                                        <input type="password" name="password" placeholder="Enter Your Password" class="reg__input" v-model="password">
                                    </label>
                                    <button type="submit" class="button cart-btn" @click.prevent="handleSignIn()">
                                        Login
                                    </button>
                                </form>
                            </div>
                            <div class="sign-up">
                                <h3>
                                    Register Now!
                                </h3>
                                <form action="#" class="reg">
                                    <label>
                                        <input type="text" name="name" placeholder="Enter Your Name" class="reg__input" v-model="name">
                                    </label>
                                    <label>
                                        <input type="text" name="login" placeholder="Enter Your Login" class="reg__input" v-model="login">
                                    </label>
                                    <label>
                                        <input type="email" name="email" placeholder="Enter Your Email" class="reg__input" v-model="mail">
                                    </label>
                                    <label>
                                        <input type="password" name="password" placeholder="Enter Your Password" class="reg__input" v-model="password">
                                    </label>
                                    <button class="button cart-btn" type="submit" @click.prevent="handleSignUp()">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div v-else class="content">
                         <button class="modal-button button-close" type="button" @click="$emit('close')">
                            <i class="far fa-times-circle"></i>
                         </button>
                         <ul class="reg reg-private">
                         <li>
                            <a v-if="showChangePassword === false" href="shopping_cart.html" class="button cart-btn">
                                My orders
                            </a>
                         </li>
                         <li>
                            <button v-if="showChangePassword === false" class="button cart-btn change-pass" type="button" @click="showChangePassword = true">
                              Change password?
                            </button>
                        </li>  
                             <form v-if="showChangePassword" action="#" class="reg pass-form">
                                 <h3>
                                    Are You Sure?
                                 </h3>
                                 <label>
                                    <input type="password" name="password" placeholder="Enter New Password" class="reg__input" v-model="changePassword">
                                 </label>
                                 <button class="button cart-btn" type="submit" @click.prevent="handleChangePassword()">
                                        Change password
                                </button>
                             </form>
                          <li>
                            <button v-if="showChangePassword === false" class="button cart-btn" type="button" @click.prevent="handleLogOut()">
                                Log Out
                            </button>  
                          </li>
                         </ul>
                    </div>
                </div>
            </div>
        </div>
    </transition>    
    `
});

Vue.component('product-item', {
    props: ['item'],
    template: `
    <div :id="item.id" class="product-box__item">
        <a href="#" class="product-box__product">
            <img :src="item.image" alt="Product" class="product-box__img">
        </a>
        <div class="product-box__overlay d-flex">
            <button type="button" class="product-box__add-cart button" @click.prevent="handleBuyClick(item)">
                Add to Cart
            </button>
        </div>
        <div class="product-box__description">
            <p class="product-box__text">{{item.name}}</p>
            <p class="product-box__price">\${{item.price}}</p>
        </div>
    </div>        
  `,
    methods: {
        handleBuyClick(item) {
            this.$emit('onBuy', item);
        }
    }
});


Vue.component('products', {
    props: ['query'],
    methods: {
        handleBuyClick(item) {
            this.$emit('onbuy', item);
        },
    },
    data() {
        return {
            items: [],
        };
    },
    computed: {
        filteredItems() {
            if(this.query) {
                const regexp = new RegExp(this.query, 'i');
                return this.items.filter((item) => regexp.test(item.name));
            } else {
                return this.items;
            }
        }
    },
    mounted() {
        fetch(`${API_URL}/products`)
            .then(response => response.json())
            .then((items) => {
                this.items = items;
            });
    },
    template: `
    <div class="product-box d-flex space-btw">
      <product-item v-for="entry in filteredItems" :item="entry"  @onBuy="handleBuyClick"></product-item>
    </div>
  `,
});

Vue.component('cart', {
    props: ['cart'],
    methods: {
        handleDeleteClick(item) {
            this.$emit('ondelete', item);
        },
    },
    data() {
        return {
            cart: [],
        };
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        }
    },
    template: `
    <div class="drop-box-cart">
        <ul class="box-cart">
           <li v-for="item in cart" class="box-cart__item d-flex align-i-с">
               <div class="box-cart__img">
                    <img :src="item.image" alt="product_photo">
               </div>
              <div class="box-cart__wrap">
                    <p class="box-cart__title">
                        {{item.name}}
                    </p>
                 <div class="box-cart__stars">
                     <a href="#" class="box-cart__star">
                         <i class="fa fa-star" aria-hidden="true"></i>
                     </a>
                     <a href="#" class="box-cart__star">
                        <i class="fa fa-star" aria-hidden="true"></i>
                     </a>
                     <a href="#" class="box-cart__star">
                        <i class="fa fa-star" aria-hidden="true"></i>
                     </a>
                     <a href="#" class="box-cart__star">
                       <i class="fa fa-star" aria-hidden="true"></i>
                     </a>
                     <a href="#" class="box-cart__star">
                         <i class="fa fa-star" aria-hidden="true"></i>
                     </a>
                  </div>
                    <p class="box-cart__price">{{item.quantity}} x {{item.price}}</p>
               </div>
             <button type="button" class="box-cart__icon" @click="handleDeleteClick(item)">
                 <i class="fas fa-times-circle"></i>
             </button>
          </li>  
        </ul>
        <div class="box-cart__total d-flex space-btw">
            <p class="box-cart__text">TOTAL</p>
            <p class="box-cart__text">{{total}}</p>
        </div>
        <a href="../checkout.html" class="box-cart__btn button">
           Checkout
        </a>
        <a href="../shopping_cart.html" class="box-cart__btn button">
            Go to cart
        </a>   
    </div>
  `,
});

const app = new Vue({
    el: "#app",
    data: {
        items: [],
        cart: [],
        filterValue: '',
        searchQuery: '',
        feedback: [],
        approved: [],
        users: [],
        name: '',
        mail: '',
        comment: '',
        isVisibleCart: false,
        showModal: false
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });

        fetch(`${API_URL}/feedback`)
            .then((response) => response.json())
            .then((items) => {
                this.feedback = items;
            });

        fetch(`${API_URL}/feedback_approve`)
            .then((response) => response.json())
            .then((items) => {
                this.approved = items;
            });

        fetch(`${API_URL}/users`)
            .then((response) => response.json())
            .then((items) => {
                this.users = items;
            });
    },
    computed: {
        totalQuantity() {
            return this.cart.reduce((acc, item) => acc + item.quantity, 0);
        },
        total() {
            return this.cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        },
        getUser() {
            let loginReg = localStorage.getItem('user');
            if (loginReg === null) {
                return 'My Account';
            } else {
                return loginReg;
            }
        },
    },
    methods: {
        handleSearchClick(query) {
            this.filterValue = query;
        },
        handleBuyClick(item) {
            const cartItem = this.cart.find((entry) => entry.id === item.id);
            if (cartItem) {
                // товар в корзине уже есть, нужно увеличить количество
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                // товара в корзине еще нет, нужно добавить
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...item, quantity: 1 })
                })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                    });
            }
        },
        clearCart() {
            fetch(`${API_URL}/cart`, {
                method: 'DELETE',
            })
                .then(() => {
                    this.cart = [];
                });
        },
        handleDeleteClick(item) {
            if (item.quantity > 1) {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: item.quantity - 1 }),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'DELETE',
                })
                    .then(() => {
                        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
                    });
            }
        },
        handleAddFeedback() {
            fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.name,
                    mail: this.mail,
                    comment: this.comment
                })
            })
                .then((response) => response.json())
                .then((item) => {
                    this.feedback.push(item);
                });
        },
        handleApproveFeedback(item) {
            fetch(`${API_URL}/feedback_approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            })
                .then((response) => response.json())
                .then((item) => {
                    this.approved.push(item);
                });
            fetch(`${API_URL}/feedback/${item.id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    this.feedback = this.feedback.filter((comment) => comment.id !== item.id);
                });
        },
        handleDeleteFeedback(item) {
            fetch(`${API_URL}/feedback/${item.id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    this.feedback = this.feedback.filter((comment) => comment.id !== item.id);
                });
        },
    }
});
