// Admin主入口文件 - 全局函数绑定
document.addEventListener('DOMContentLoaded', function() {
    // 确保所有模块都已加载
    const modules = [
        'NavigationManager',
        'ModalManager', 
        'EventManager',
        'ProblemManager',
        'SubmissionManager',
        'CertificateManager',
        'UserManager',
        'SettingsManager'
    ];

    // 检查模块是否加载完成
    const checkModules = () => {
        const allLoaded = modules.every(module => window[module]);
        if (allLoaded) {
            bindGlobalFunctions();
        } else {
            setTimeout(checkModules, 100);
        }
    };

    checkModules();
});

// 绑定全局函数到window对象
function bindGlobalFunctions() {
    const eventManager = window.EventManager;
    const problemManager = window.ProblemManager;
    const submissionManager = window.SubmissionManager;
    const certificateManager = window.CertificateManager;
    const userManager = window.UserManager;
    const settingsManager = window.SettingsManager;

    // 竞赛管理函数
    window.openEventModal = () => eventManager.openEventModal();
    window.closeEventModal = () => eventManager.closeEventModal();
    window.saveEvent = () => eventManager.saveEvent();
    window.editEvent = (id) => eventManager.editEvent(id);
    window.publishEvent = (id) => eventManager.publishEvent(id);
    window.unpublishEvent = (id) => eventManager.unpublishEvent(id);
    window.goToRegistrations = (id) => eventManager.goToRegistrations(id);
    window.goToProblems = (id) => eventManager.goToProblems(id);

    // 赛题管理函数
    window.openProblemModal = () => problemManager.openProblemModal();
    window.closeProblemModal = () => problemManager.closeProblemModal();
    window.saveProblem = () => problemManager.saveProblem();
    window.batchImportProblems = () => problemManager.batchImportProblems();
    window.publishProblem = (id) => problemManager.publishProblem(id);
    window.unpublishProblem = (id) => problemManager.unpublishProblem(id);
    window.editProblem = (id) => problemManager.editProblem(id);
    window.viewSubmissions = (id) => problemManager.viewSubmissions(id);

    // 提交审核函数
    window.reviewSubmission = (id) => submissionManager.reviewSubmission(id);
    window.closeReviewModal = () => submissionManager.closeReviewModal();
    window.submitReview = () => submissionManager.submitReview();
    window.batchApproveSubmissions = () => submissionManager.batchApproveSubmissions();
    window.viewSubmissionDetail = (id) => submissionManager.viewSubmissionDetail(id);
    window.closeSubmissionDetailModal = () => submissionManager.closeSubmissionDetailModal();

    // 证书管理函数
    window.openCertificateRuleModal = () => certificateManager.openCertificateRuleModal();
    window.closeCertificateRuleModal = () => certificateManager.closeCertificateRuleModal();
    window.saveCertificateRule = () => certificateManager.saveCertificateRule();
    window.toggleConditionInput = (type) => certificateManager.toggleConditionInput(type);
    window.editCertificateRule = (id) => certificateManager.editCertificateRule(id);
    window.enableRule = (id) => certificateManager.enableRule(id);
    window.disableRule = (id) => certificateManager.disableRule(id);
    window.openCertificateHistoryModal = () => certificateManager.openCertificateHistoryModal();
    window.closeCertificateHistoryModal = () => certificateManager.closeCertificateHistoryModal();
    window.openTemplateModal = () => certificateManager.openTemplateModal();
    window.closeTemplateModal = () => certificateManager.closeTemplateModal();
    window.saveTemplate = () => certificateManager.saveTemplate();
    window.previewTemplate = (id) => certificateManager.previewTemplate(id);
    window.duplicateTemplate = (id) => certificateManager.duplicateTemplate(id);
    window.uploadCertificateImage = (id) => certificateManager.uploadCertificateImage(id);
    window.closeUploadCertificateModal = () => certificateManager.closeUploadCertificateModal();
    window.previewCertificateImage = (input) => certificateManager.previewCertificateImage(input);
    window.saveCertificateTemplate = () => certificateManager.saveCertificateTemplate();

    // 用户管理函数
    window.removeRegistration = (id) => userManager.removeRegistration(id);
    window.viewRegistrationDetail = (id) => userManager.viewRegistrationDetail(id);
    window.closeRegistrationDetailModal = () => userManager.closeRegistrationDetailModal();
    window.exportRegistrations = () => userManager.exportRegistrations();
    window.viewScoreDetail = (id) => userManager.viewScoreDetail(id);
    window.closeScoreDetailModal = () => userManager.closeScoreDetailModal();
    window.adjustScore = (id) => userManager.adjustScore(id);
    window.closeScoreAdjustModal = () => userManager.closeScoreAdjustModal();
    window.submitScoreAdjust = () => userManager.submitScoreAdjust();
    window.exportScoring = () => userManager.exportScoring();
    window.openAddAdminModal = () => userManager.openAddAdminModal();
    window.closeAddAdminModal = () => userManager.closeAddAdminModal();
    window.sendAdminVerificationCode = () => userManager.sendAdminVerificationCode();
    window.saveAdmin = () => userManager.saveAdmin();
    window.editAdmin = (id) => userManager.editAdmin(id);
    window.disableAdmin = (id) => userManager.disableAdmin(id);
    window.enableAdmin = (id) => userManager.enableAdmin(id);

    // 网站配置函数
    window.switchConfigTab = (tab) => settingsManager.switchConfigTab(tab);
    window.addBannerImage = () => settingsManager.addBannerImage();
    window.editBannerImage = (id) => settingsManager.editBannerImage(id);
    window.deleteBannerImage = (id) => settingsManager.deleteBannerImage(id);
    window.toggleBannerStatus = (id) => settingsManager.toggleBannerStatus(id);
    window.closeBannerModal = () => settingsManager.closeBannerModal();
    window.previewBannerImage = (input) => settingsManager.previewBannerImage(input);
    window.saveBanner = () => settingsManager.saveBanner();
    window.formatText = (cmd) => settingsManager.formatText(cmd);
    window.insertLink = () => settingsManager.insertLink();
    window.insertImage = () => settingsManager.insertImage();
    window.saveIntroduction = () => settingsManager.saveIntroduction();
    window.previewIntroduction = () => settingsManager.previewIntroduction();
    window.addNotice = () => settingsManager.addNotice();
    window.editNotice = (id) => settingsManager.editNotice(id);
    window.unpublishNotice = (id) => settingsManager.unpublishNotice(id);
    window.publishNotice = (id) => settingsManager.publishNotice(id);
    window.closeNoticeModal = () => settingsManager.closeNoticeModal();
    window.saveNotice = () => settingsManager.saveNotice();
    window.addFAQ = () => settingsManager.addFAQ();
    window.editFAQ = (id) => settingsManager.editFAQ(id);
    window.hideFAQ = (id) => settingsManager.hideFAQ(id);
    window.showFAQ = (id) => settingsManager.showFAQ(id);
    window.closeFAQModal = () => settingsManager.closeFAQModal();
    window.saveFAQ = () => settingsManager.saveFAQ();
    window.handleLogout = () => settingsManager.handleLogout();

    // 新增的全局函数
    window.previewCover = (input) => eventManager.previewCover(input);
    window.filterRegistrationsByEvent = (eventId) => userManager.filterRegistrationsByEvent(eventId);
    window.filterScoringByEvent = (eventId) => userManager.filterScoringByEvent(eventId);
    window.filterProblemsByEvent = (eventId) => problemManager.filterProblemsByEvent(eventId);
    window.batchImportProblems = () => problemManager.batchImportProblems();
    window.closeBatchImportModal = () => problemManager.closeBatchImportModal();
    window.handleFileUpload = (input) => problemManager.handleFileUpload(input);
    window.downloadTemplate = () => problemManager.downloadTemplate();
    window.filterSubmissionsByEvent = (eventId) => submissionManager.filterSubmissionsByEvent(eventId);
    window.filterSubmissionsByProblem = (problemId) => submissionManager.filterSubmissionsByProblem(problemId);
    window.filterSubmissionsByStatus = (status) => submissionManager.filterSubmissionsByStatus(status);
    window.toggleSubmissionSelection = (id, checked) => submissionManager.toggleSubmissionSelection(id, checked);
    window.toggleAllSubmissions = (checked) => submissionManager.toggleAllSubmissions(checked);
    window.batchApproveSubmissions = () => submissionManager.batchApproveSubmissions();
    window.batchRejectSubmissions = () => submissionManager.batchRejectSubmissions();
    window.toggleReviewResult = (result) => submissionManager.toggleReviewResult(result);
    window.exportSubmissions = () => submissionManager.exportSubmissions();
    window.resetFilters = () => submissionManager.resetFilters();
    window.deleteCertificateRule = (id) => certificateManager.deleteCertificateRule(id);
    window.issueCertificates = (ruleId) => certificateManager.issueCertificates(ruleId);
    window.editCertificateTemplate = (id) => certificateManager.editCertificateTemplate(id);
    window.closeTemplateDesigner = () => certificateManager.closeTemplateDesigner();
    window.saveTemplateDesign = () => certificateManager.saveTemplateDesign();
    window.closeTemplatePreview = () => certificateManager.closeTemplatePreview();
    window.deleteCertificateTemplate = (id) => certificateManager.deleteCertificateTemplate(id);

    console.log('Admin管理系统已初始化完成');
}