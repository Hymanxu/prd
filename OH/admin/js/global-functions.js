// 全局函数文件 - 支持新的模态框和功能

// 证书发放相关函数
function openCertificateRuleModal() {
    window.CertificateManager.openCertificateRuleModal();
}

function closeCertificateRuleModal() {
    window.CertificateManager.closeCertificateRuleModal();
}

function saveCertificateRule() {
    window.CertificateManager.saveCertificateRule();
}

function editCertificateRule(id) {
    window.CertificateManager.editCertificateRule(id);
}

function closeEditCertificateRuleModal() {
    window.CertificateManager.closeEditCertificateRuleModal();
}

function saveEditCertificateRule() {
    window.CertificateManager.saveEditCertificateRule();
}

function deleteCertificateRule(id) {
    window.CertificateManager.deleteCertificateRule(id);
}

function toggleConditionInput(type) {
    window.CertificateManager.toggleConditionInput(type);
}

function toggleEditConditionInput(type) {
    window.CertificateManager.toggleEditConditionInput(type);
}

// 证书模板相关函数
function openTemplateModal() {
    window.CertificateManager.openTemplateModal();
}

function closeTemplateModal() {
    window.CertificateManager.closeTemplateModal();
}

function saveTemplate() {
    window.CertificateManager.saveTemplate();
}

function previewTemplate(id) {
    window.CertificateManager.previewTemplate(id);
}

function editCertificateTemplate(id) {
    window.CertificateManager.editCertificateTemplate(id);
}

function deleteCertificateTemplate(id) {
    window.CertificateManager.deleteCertificateTemplate(id);
}

function closeTemplatePreviewModal() {
    window.CertificateManager.closeTemplatePreviewModal();
}

function editTemplateFromPreview() {
    window.CertificateManager.editTemplateFromPreview();
}

function closeTemplateEditModal() {
    window.CertificateManager.closeTemplateEditModal();
}

function previewTemplateDesign() {
    window.CertificateManager.previewTemplateDesign();
}

function saveTemplateDesign() {
    window.CertificateManager.saveTemplateDesign();
}

function resetTemplateFields() {
    window.CertificateManager.resetTemplateFields();
}

function previewTemplateFromCreate() {
    // 等待 CertificateManager 加载完成
    if (window.CertificateManager && typeof window.CertificateManager.previewTemplateFromCreate === 'function') {
        window.CertificateManager.previewTemplateFromCreate();
    } else {
        // 备用方案：直接操作模态框
        setTimeout(() => {
            const createModal = document.getElementById('templateModal');
            const previewModal = document.getElementById('templatePreviewModal');
            
            if (createModal) {
                createModal.classList.remove('show');
            }
            
            setTimeout(() => {
                if (previewModal) {
                    previewModal.classList.add('show');
                }
            }, 200);
        }, 100);
    }
}

function previewCertificateImage(input) {
    window.CertificateManager.previewCertificateImage(input);
}

// 拖拽相关函数
function dragField(event) {
    window.CertificateManager.dragField(event);
}

function allowDrop(event) {
    window.CertificateManager.allowDrop(event);
}

function dropField(event) {
    window.CertificateManager.dropField(event);
}

// 通知公告相关函数
function addNotice() {
    window.SettingsManager.addNotice();
}

function editNotice(id) {
    window.SettingsManager.editNotice(id);
}

function closeNoticeModal() {
    window.SettingsManager.closeNoticeModal();
}

function publishNotice() {
    window.SettingsManager.publishNotice();
}

function unpublishNotice(id) {
    window.SettingsManager.unpublishNotice(id);
}

// FAQ相关函数
function addFAQ() {
    window.SettingsManager.addFAQ();
}

function editFAQ(id) {
    window.SettingsManager.editFAQ(id);
}

function closeFAQModal() {
    window.SettingsManager.closeFAQModal();
}

function publishFAQ() {
    window.SettingsManager.publishFAQ();
}

function hideFAQ(id) {
    window.SettingsManager.hideFAQ(id);
}

function showFAQ(id) {
    window.SettingsManager.showFAQ(id);
}

// 富文本编辑器相关函数
function formatNoticeText(cmd) {
    window.SettingsManager.formatNoticeText(cmd);
}

function insertNoticeLink() {
    window.SettingsManager.insertNoticeLink();
}

function insertNoticeImage() {
    window.SettingsManager.insertNoticeImage();
}

function formatFAQText(cmd) {
    window.SettingsManager.formatFAQText(cmd);
}

function insertFAQLink() {
    window.SettingsManager.insertFAQLink();
}

function insertFAQImage() {
    window.SettingsManager.insertFAQImage();
}

// Banner相关函数
function addBannerImage() {
    window.SettingsManager.addBannerImage();
}

function closeBannerModal() {
    window.SettingsManager.closeBannerModal();
}

function previewBannerImage(input) {
    window.SettingsManager.previewBannerImage(input);
}

function saveBanner() {
    window.SettingsManager.saveBanner();
}

// 配置标签切换
function switchConfigTab(tab) {
    window.SettingsManager.switchConfigTab(tab);
}

// 大赛介绍相关函数
function formatText(cmd) {
    window.SettingsManager.formatText(cmd);
}

function insertLink() {
    window.SettingsManager.insertLink();
}

function insertImage() {
    window.SettingsManager.insertImage();
}

function clearIntroduction() {
    window.SettingsManager.clearIntroduction();
}

function saveIntroduction() {
    window.SettingsManager.saveIntroduction();
}

// 退出登录
function handleLogout() {
    window.SettingsManager.handleLogout();
}

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 确保所有管理器都已初始化
    if (window.CertificateManager) {
        window.CertificateManager.renderCertificateRulesList();
        window.CertificateManager.renderCertificateTemplatesList();
    }
    
    if (window.SettingsManager) {
        window.SettingsManager.switchConfigTab('banner');
    }
    
    // 为所有模态框的关闭按钮添加事件监听器
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // 添加ESC键关闭模态框功能
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                openModal.classList.remove('show');
            }
        }
    });
    
    // 点击模态框背景关闭
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
});