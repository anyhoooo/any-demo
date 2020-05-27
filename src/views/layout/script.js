export default {
    name: 'Layout',
    data() {
        return {
            currentRoute: this.$router.currentRoute, // 当前路由
            logoUrl: '',
            topbarDisplay: {
                eName: '',
                name: '',
            },
            collapsed: false,
            subNavStyle: {},
        }
    }
}