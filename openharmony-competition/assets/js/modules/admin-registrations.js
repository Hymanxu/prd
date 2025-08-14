// 报名管理功能模块
class AdminRegistrations {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    exportRegistrations() {
        console.log('导出报名信息');
        alert('报名信息导出中，请稍候...');
    }

    removeRegistration(id) {
        if (confirm('确定要移除这个参赛者吗？')) {
            console.log('移除参赛者:', id);
            alert('参赛者已移除！');
        }
    }

    viewRegistrationDetail(id) {
        console.log('查看报名详情:', id);
        const modal = document.getElementById('registrationDetailModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeRegistrationDetailModal() {
        const modal = document.getElementById('registrationDetailModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// 导出模块
window.AdminRegistrations = AdminRegistrations;