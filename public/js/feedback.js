Vue.component('feedback-list', {
    props: ['feedback'],
    methods: {
        handleApproveFeedback(item) {
            this.$emit('approve', item);
        },
    },
    template: `
        <div class="comments">
         <ul class="d-flex">
            <li v-for="item in feedback">
                <h3>{{item.name}}</h3>
                <p>{{item.comment}}</p>
                 <button @click.prevent="handleApproveFeedback(item)">
                    Approve
                 </button>
                 <button>
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
        <div class="comments comments-approved">
        <h3>
            Reviews about our products
        </h3>
        <ul class="d-flex">
            <li v-for="item in approved">
                <h3>
                    {{item.name}}
                </h3>
                <p>
                    {{item.mail}}
                </p>
                <p>
                    {{item.comment}}
                </p>
            </li>
         </ul>
        </div>
    `,
});