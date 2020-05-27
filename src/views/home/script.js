export default {
    name: "Home",
    data() {
        return {
            mes: "我是home-router",
        };
    },
    methods: {
        goto() {
            this.$router.push('/student')
        }
    }
};