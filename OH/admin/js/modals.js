// 模态框管理模块
class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        // 点击模态框背景关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    openModal.classList.remove('show');
                }
            }
        });
    }

    // 通用模态框操作方法
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 竞赛编辑模态框
    openEventModal() {
        this.openModal('eventModal');
    }

    closeEventModal() {
        this.closeModal('eventModal');
        const form = document.getElementById('eventForm');
        if (form) form.reset();
    }

    // 赛题编辑模态框
    openProblemModal() {
        this.openModal('problemModal');
    }

    closeProblemModal() {
        this.closeModal('problemModal');
        const form = document.getElementById('problemForm');
        if (form) form.reset();
    }

    // 提交审核模态框
    openReviewModal() {
        this.openModal('reviewModal');
    }

    closeReviewModal() {
        this.closeModal('reviewModal');
    }

    // 提交详情模态框
    openSubmissionDetailModal() {
        this.openModal('submissionDetailModal');
    }

    closeSubmissionDetailModal() {
        this.closeModal('submissionDetailModal');
    }

    // 证书发放规则模态框
    openCertificateRuleModal() {
        this.openModal('certificateRuleModal');
    }

    closeCertificateRuleModal() {
        this.closeModal('certificateRuleModal');
        const form = document.getElementById('certificateRuleForm');
        if (form) form.reset();
        // 隐藏所有条件输入框
        const conditions = ['rankCondition', 'scoreCondition', 'completionCondition'];
        conditions.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'none';
        });
    }

    // 证书发放记录模态框
    openCertificateHistoryModal() {
        this.openModal('certificateHistoryModal');
    }

    closeCertificateHistoryModal() {
        this.closeModal('certificateHistoryModal');
    }

    // 证书模板模态框
    openTemplateModal() {
        this.openModal('templateModal');
    }

    closeTemplateModal() {
        this.closeModal('templateModal');
        const form = document.getElementById('templateForm');
        if (form) form.reset();
    }

    // 上传证书图片模态框
    openUploadCertificateModal() {
        this.openModal('uploadCertificateModal');
    }

    closeUploadCertificateModal() {
        this.closeModal('uploadCertificateModal');
        // 重置预览
        const previewImage = document.getElementById('previewImage');
        const placeholder = document.getElementById('previewPlaceholder');
        const textOverlays = document.getElementById('textOverlays');
        
        if (previewImage) previewImage.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        if (textOverlays) textOverlays.style.display = 'none';
    }

    // 报名详情模态框
    openRegistrationDetailModal() {
        this.openModal('registrationDetailModal');
    }

    closeRegistrationDetailModal() {
        this.closeModal('registrationDetailModal');
    }

    // 积分详情模态框
    openScoreDetailModal() {
        this.openModal('scoreDetailModal');
    }

    closeScoreDetailModal() {
        this.closeModal('scoreDetailModal');
    }

    // 积分调整模态框
    openScoreAdjustModal() {
        this.openModal('scoreAdjustModal');
    }

    closeScoreAdjustModal() {
        this.closeModal('scoreAdjustModal');
        const form = document.getElementById('scoreAdjustForm');
        if (form) form.reset();
    }

    // 添加管理员模态框
    openAddAdminModal() {
        this.openModal('addAdminModal');
    }

    closeAddAdminModal() {
        this.closeModal('addAdminModal');
        const form = document.getElementById('addAdminForm');
        if (form) form.reset();
        const verificationGroup = document.getElementById('adminVerificationGroup');
        if (verificationGroup) verificationGroup.style.display = 'none';
    }
}

// 导出实例
window.ModalManager = new ModalManager();