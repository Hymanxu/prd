// 赛事结算功能模块
class AdminScoring {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    exportScoring() {
        console.log('导出赛事结算数据');
        alert('赛事结算数据导出中，请稍候...');
    }

    viewScoreDetail(id) {
        console.log('查看积分详情:', id);
        const modal = document.getElementById('scoreDetailModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeScoreDetailModal() {
        const modal = document.getElementById('scoreDetailModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    adjustScore(id) {
        console.log('调整积分:', id);
        // 填充当前数据
        document.getElementById('adjustUserName').value = '张三';
        document.getElementById('adjustCurrentScore').value = '1,250';
        const modal = document.getElementById('scoreAdjustModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeScoreAdjustModal() {
        const modal = document.getElementById('scoreAdjustModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('scoreAdjustForm');
            if (form) {
                form.reset();
            }
        }
    }

    submitScoreAdjust() {
        const form = document.getElementById('scoreAdjustForm');
        const formData = new FormData(form);

        console.log('提交积分调整:', Object.fromEntries(formData));
        alert('积分调整成功！');
        this.closeScoreAdjustModal();
    }
}

// 导出模块
window.AdminScoring = AdminScoring;