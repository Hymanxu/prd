// 提交审核功能模块
class AdminSubmissions {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initCheckboxes();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    initCheckboxes() {
        // 提交审核全选
        const selectAllSubmissions = document.getElementById('selectAllSubmissions');
        if (selectAllSubmissions) {
            selectAllSubmissions.addEventListener('change', function () {
                const checkboxes = document.querySelectorAll('.submission-select');
                checkboxes.forEach(cb => cb.checked = this.checked);
            });
        }
    }

    reviewSubmission(id) {
        console.log('审核提交:', id);
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeReviewModal() {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    submitReview() {
        const result = document.getElementById('reviewResult').value;
        const comment = document.getElementById('reviewComment').value;

        console.log('提交审核结果:', { result, comment });
        alert('审核结果已提交！');
        this.closeReviewModal();
    }

    batchApproveSubmissions() {
        const selected = document.querySelectorAll('.submission-select:checked');
        if (selected.length === 0) {
            alert('请选择要审核的提交');
            return;
        }
        if (confirm(`确定要批量通过 ${selected.length} 个提交吗？`)) {
            console.log('批量通过提交:', selected.length);
            alert('批量审核完成！');
        }
    }

    viewSubmissionDetail(id) {
        console.log('查看提交详情:', id);
        const modal = document.getElementById('submissionDetailModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeSubmissionDetailModal() {
        const modal = document.getElementById('submissionDetailModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// 导出模块
window.AdminSubmissions = AdminSubmissions;