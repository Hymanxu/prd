// 管理后台主入口文件
class AdminApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // 初始化所有模块
        this.initModules();
        // 设置全局函数
        this.setupGlobalFunctions();
    }

    initModules() {
        // 初始化导航模块
        this.modules.navigation = new AdminNavigation();
        
        // 初始化功能模块
        this.modules.events = new AdminEvents();
        this.modules.problems = new AdminProblems();
        this.modules.registrations = new AdminRegistrations();
        this.modules.submissions = new AdminSubmissions();
        this.modules.scoring = new AdminScoring();
        this.modules.certificates = new AdminCertificates();
        this.modules.templates = new AdminTemplates();
        this.modules.users = new AdminUsers();
        this.modules.settings = new AdminSettings();
    }

    setupGlobalFunctions() {
        // 将模块方法设置为全局函数，以便HTML中的onclick能够调用
        const globalMethods = [
            // 竞赛管理
            'openEventModal', 'closeEventModal', 'saveEvent', 'editEvent', 'publishEvent', 'unpublishEvent',
            'goToRegistrations', 'goToProblems',
            
            // 赛题管理
            'openProblemModal', 'closeProblemModal', 'saveProblem', 'batchImportProblems',
            'publishProblem', 'unpublishProblem', 'editProblem', 'viewSubmissions',
            
            // 报名管理
            'exportRegistrations', 'removeRegistration', 'viewRegistrationDetail', 'closeRegistrationDetailModal',
            
            // 提交审核
            'reviewSubmission', 'closeReviewModal', 'submitReview', 'batchApproveSubmissions',
            'viewSubmissionDetail', 'closeSubmissionDetailModal',
            
            // 赛事结算
            'exportScoring', 'viewScoreDetail', 'closeScoreDetailModal', 'adjustScore',
            'closeScoreAdjustModal', 'submitScoreAdjust',
            
            // 证书发放规则
            'openCertificateRuleModal', 'closeCertificateRuleModal', 'saveCertificateRule',
            'toggleConditionInput', 'editCertificateRule', 'enableRule', 'disableRule',
            'openCertificateHistoryModal', 'closeCertificateHistoryModal',
            
            // 证书模板
            'openTemplateModal', 'closeTemplateModal', 'saveTemplate', 'previewTemplate',
            'editTemplate', 'duplicateTemplate', 'uploadCertificateImage', 'closeUploadCertificateModal',
            'previewCertificateImage', 'saveCertificateTemplate',
            
            // 管理员账号
            'openAddAdminModal', 'closeAddAdminModal', 'saveAdmin',
            'editAdmin', 'disableAdmin', 'enableAdmin',
            
            // 网站配置
            'switchConfigTab', 'addBannerImage', 'editBannerImage', 'deleteBannerImage',
            'toggleBannerStatus', 'formatText', 'insertLink', 'insertImage', 'saveIntroduction',
            'previewIntroduction', 'addNotice', 'editNotice', 'unpublishNotice', 'addFAQ',
            'editFAQ', 'hideFAQ',
            
            // 通用功能
            'handleLogout'
        ];

        globalMethods.forEach(method => {
            window[method] = (...args) => {
                // 找到包含该方法的模块并调用
                for (const [moduleName, moduleInstance] of Object.entries(this.modules)) {
                    if (typeof moduleInstance[method] === 'function') {
                        return moduleInstance[method](...args);
                    }
                }
                console.warn(`Method ${method} not found in any module`);
            };
        });
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.adminApp = new AdminApp();
});