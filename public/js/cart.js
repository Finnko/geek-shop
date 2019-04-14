Vue.component('main-cart', {
    props: ['cart'],
    data() {
        return {
            cart: [],
        };
    },
    methods: {
        handleDeleteClick(item) {
            this.$emit('ondelete', item);
        },
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
        }
    },
    template: `
            <div class="line" v-for="item in cart">
                <div class="column-wide">
                    <figure class="cart-item d-flex">
                        <a href="../single_page.html"  class="cart-item__img">
                            <img :src="item.image" alt="Product">
                        </a>
                        <figcaption>
                            <h3 class="cart-item__title">
                                {{item.name}}
                            </h3>
                            <p class="cart-item__text">
                                Color:
                                <span>
                                Red
                            </span>
                            </p>
                            <p class="cart-item__text">
                                Size:
                                <span>
                                Xll
                            </span>
                            </p>
                        </figcaption>
                    </figure>
                </div>
                <div class="column-short">
                    <p class="cart-text">
                        \${{item.price}}
                    </p>
                </div>
                <div class="column-short">
                    <label>
                        <input type="number" min="1" max="20" class="cart-quantity" v-model="item.quantity">
                    </label>
                </div>
                <div class="column-short">
                    <p class="cart-text">
                        FREE
                    </p>
                </div>
                <div class="column-short">
                    <p class="cart-text">
                        \${{item.price * item.quantity}}
                    </p>
                </div>
                <div class="column-short">
                    <button type="button" class="cart-icon" @click="handleDeleteClick(item)">
                        <i class="far fa-times-circle"></i>
                    </button>
                </div>
            </div>
            `,
});