// 导航管理模块
class NavigationManager {
    constructor() {
        this.currentSection = 'events';
        this.init();
    }

    init() {
        // 绑定导航点击事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // 初始化显示第一个section
        this.switchSection('events');
    }

    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // 更新页面标题
        const titles = {
            'events': '竞赛管理',
            'registrations': '报名管理',
            'settings': '网站管理',
            'problems': '赛题管理',
            'submissions': '提交审核',
            'scoring': '赛事结算',
            'certificates': '证书发放',
            'templates': '证书模板',
            'users': '管理员账号'
        };
        
        document.getElementById('pageTitle').textContent = titles[section] || section;

        // 隐藏所有内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // 显示对应的内容区域
        const targetSection = document.getElementById(`${section}Section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // 调用对应的渲染函数
        this.renderSection(section);
        this.currentSection = section;
    }

    renderSection(section) {
        switch(section) {
            case 'events':
                if (window.EventManager) {
                    window.EventManager.renderEventsList();
                }
                break;
            case 'registrations':
                if (window.UserManager) {
                    window.UserManager.renderRegistrationsList();
                }
                break;
            case 'settings':
                if (window.SettingsManager) {
                    window.SettingsManager.switchConfigTab('banner');
                }
                break;
            case 'problems':
                if (window.ProblemManager) {
                    window.ProblemManager.renderProblemsList();
                }
                break;
            case 'submissions':
                if (window.SubmissionManager) {
                    window.SubmissionManager.renderSubmissionsList();
                    window.SubmissionManager.updateProblemOptions();
                }
                break;
            case 'scoring':
                if (window.UserManager) {
                    window.UserManager.renderScoringList();
                }
                break;
            case 'certificates':
                if (window.CertificateManager) {
                    window.CertificateManager.renderCertificateRulesList();
                }
                break;
            case 'templates':
                if (window.CertificateManager) {
                    window.CertificateManager.renderCertificateTemplatesList();
                }
                break;
            case 'users':
                if (window.UserManager) {
                    window.UserManager.renderAdminsList();
                }
                break;
        }
    }
}

// 导出实例
window.NavigationManager = new NavigationManager();