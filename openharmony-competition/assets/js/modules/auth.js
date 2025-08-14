/**
 * 用户认证模块
 * 处理登录、登出、用户菜单等认证相关功能
 */

class AuthModule {
    constructor() {
        this.initEventListeners();
        this.updateAuthUI();
    }

    // 初始化事件监听器
    initEventListeners() {
        // 登录按钮点击
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }

        // 用户菜单相关事件
        this.initUserMenu();
        
        // 报名按钮点击事件
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.handleRegister());
        }
    }

    // 初始化用户菜单
    initUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (!userMenu) return;

        userMenu.addEventListener('mouseenter', () => this.showUserDropdown());
        userMenu.addEventListener('mouseleave', () => this.hideUserDropdown());

        // 绑定菜单项点击事件
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    // 处理登录
    handleLogin() {
        // 跳转到登录页面
        window.location.href = 'login.html';
    }

    // 处理报名
    handleRegister() {
        // 检查登录状态
        if (!window.appState.isLoggedIn()) {
            // 未登录，先跳转到登录页面，登录后会自动跳转到手机验证
            sessionStorage.setItem('redirectAfterLogin', 'register');
            window.location.href = 'login.html';
            return;
        }
        
        // 已登录，跳转到手机验证页面
        window.location.href = 'phone-verification.html';
    }

    // 检查登录状态
    isLoggedIn() {
        const appState = window.appState;
        return appState && appState.getState('isLoggedIn');
    }

    // 执行报名
    performRegistration() {
        if (window.messageManager) {
            window.messageManager.show('报名成功！', 'success');
        }
        
        // 更新按钮状态
        const registerBtn = document.getElementById('registerBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const viewProblemsBtn = document.getElementById('viewProblemsBtn');
        
        if (registerBtn) registerBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (viewProblemsBtn) viewProblemsBtn.style.display = 'inline-block';
    }

    // 处理登出
    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            // 清除应用状态
            if (window.appState) {
                window.appState.logout();
                
                // 设置标记，表示用户已登出，下次登录需要走验证流程
                sessionStorage.setItem('needPhoneVerification', 'true');
            }

            this.updateAuthUI();
            this.hideUserDropdown();
            
            if (window.messageManager) {
                window.messageManager.show('已成功退出登录', 'info');
            }
        }
    }

    // 显示用户下拉菜单
    showUserDropdown() {
        if (this.dropdownTimeout) {
            clearTimeout(this.dropdownTimeout);
        }
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.add('show');
        }
    }

    // 隐藏用户下拉菜单
    hideUserDropdown() {
        this.dropdownTimeout = setTimeout(() => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }, 300);
    }

    // 更新认证UI
    updateAuthUI() {
        const appState = window.appState;
        if (!appState) return;

        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');

        const isLoggedIn = appState.getState('isLoggedIn');
        const currentUser = appState.getState('currentUser');

        if (isLoggedIn && currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = currentUser.name || '用户';
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    }

    // 登录成功后的处理
    onLoginSuccess(userInfo) {
        if (window.appState) {
            window.appState.login(userInfo);
        }
        this.updateAuthUI();
    }

    // 检查从其他页面返回的状态
    checkReturnFromAuth() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 从登录页面返回
        if (urlParams.get('from') === 'login') {
            // 模拟登录成功
            const mockUser = {
                name: '张三',
                gitcodeId: 'zhangsan_dev',
                email: 'zhangsan@example.com'
            };
            this.onLoginSuccess(mockUser);
            
            if (window.messageManager) {
                window.messageManager.show('登录成功！', 'success');
            }
            
            // 检查是否需要继续报名流程
            const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
            if (redirectAfterLogin === 'register') {
                sessionStorage.removeItem('redirectAfterLogin');
                // 延迟跳转到手机验证页面
                setTimeout(() => {
                    window.location.href = 'phone-verification.html';
                }, 1000);
            }
            
            // 清理URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // 从授权页面返回 - 修复授权流程
        if (urlParams.get('from') === 'auth' || urlParams.get('code')) {
            // 模拟授权成功
            const mockUser = {
                name: '张三',
                gitcodeId: 'zhangsan_dev',
                email: 'zhangsan@example.com'
            };
            this.onLoginSuccess(mockUser);
            
            // 检查是否已完成注册流程
            const hasCompletedRegistration = window.appState.getState('isRegistered');
            if (!hasCompletedRegistration) {
                // 首次授权，跳转到手机验证页面
                setTimeout(() => {
                    window.location.href = 'phone-verification.html';
                }, 1000);
                return;
            }
            
            if (window.messageManager) {
                window.messageManager.show('授权成功！', 'success');
            }
            
            // 检查是否需要走手机验证流程
            // 1. 新用户或退出登录后重新授权的用户需要验证
            // 2. 从登录页面过来的用户需要验证
            const needPhoneVerification = sessionStorage.getItem('needPhoneVerification') === 'true' || 
                                         sessionStorage.getItem('redirectAfterLogin') === 'register' ||
                                         !window.appState.getState('hasCompletedVerification');
            
            // 清除标记
            sessionStorage.removeItem('needPhoneVerification');
            sessionStorage.removeItem('redirectAfterLogin');
            
            // 如果需要验证，跳转到手机验证页面
            if (needPhoneVerification) {
                setTimeout(() => {
                    window.location.href = 'phone-verification.html';
                }, 1000);
            }
            
            // 清理URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
        
        // 从手机验证页面返回
        if (urlParams.get('from') === 'phone-verification') {
            // 模拟报名完成
            if (window.appState) {
                window.appState.setState('isRegistered', true);
            }
            
            if (window.messageManager) {
                window.messageManager.show('报名成功！', 'success');
            }
            
            // 更新竞赛模块UI
            if (window.contestModule) {
                window.contestModule.updateUI();
            }
            
            // 清理URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
}

// 导出模块
window.AuthModule = AuthModule;