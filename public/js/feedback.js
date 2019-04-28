Vue.component('feedback-list', {
    props: ['feedback'],
    methods: {
        handleApproveFeedback(item) {
            this.$emit('approve', item);
        },
        handleDeleteFeedback(item) {
            this.$emit('delete', item);
        }
    },
    template: `
        <div class="comments">
         <ul class="d-flex">
            <li v-for="item in feedback">
                <h3 class="comments-name">
                    {{item.name}}
                </h3>
                <p class="comments-text">
                    {{item.comment}}
                </p>
                 <button @click.prevent="handleApproveFeedback(item)" class="button cart-btn comments-btn">
                    Approve
                 </button>
                 <button @click.prevent="handleDeleteFeedback(item)" class="button cart-btn comments-btn">
                    Delete
                 </button>
            </li>
          </ul>
        </div>
    `,
});

Vue.component('feedback-approved', {
    props: ['approved'],
    template: `
        <div class="comments">
            <h2>
                Consumer's reviews
            </h2>
            <ul class="d-flex">
                <li v-for="item in approved">
                    <h3 class="comments-name">
                        {{item.name}}
                    </h3>
                    <p class="comments-email">
                        {{item.mail}}
                    </p>
                    <p class="comments-text">
                        {{item.comment}}
                    </p>
                </li>
             </ul>
        </div>
    `,
});