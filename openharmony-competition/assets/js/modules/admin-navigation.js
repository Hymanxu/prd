// 管理后台导航功能模块
class AdminNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeModals();
    }

    bindEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentSections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('pageTitle');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;

                // 更新导航状态
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // 更新内容区域
                contentSections.forEach(section => section.classList.remove('active'));
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                }

                // 更新页面标题
                const titles = {
                    'events': '竞赛管理',
                    'problems': '赛题管理',
                    'registrations': '报名管理',
                    'submissions': '提交审核',
                    'scoring': '赛事结算',
                    'certificates': '发放规则',
                    'templates': '证书模板',
                    'users': '管理员账号',
                    'settings': '网站配置'
                };
                if (pageTitle) {
                    pageTitle.textContent = titles[targetSection] || '管理后台';
                }
            });
        });
    }

    initializeModals() {
        // 点击模态框背景关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('show');
            }
        });
    }

    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = 'login.html';
        }
    }
}

// 导出模块
window.AdminNavigation = AdminNavigation;