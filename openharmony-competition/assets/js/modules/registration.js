/**
 * 报名相关模块
 * 处理报名状态和按钮更新
 */

class RegistrationModule {
    constructor() {
        this.initEventListeners();
        this.updateRegistrationButtonState();
    }

    // 初始化事件监听器
    initEventListeners() {
        // 监听报名状态变化
        if (window.appState) {
            window.appState.subscribe('isRegisteredChange', () => {
                this.updateRegistrationButtonState();
            });
        }

        // 绑定报名按钮点击事件
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                this.handleRegistration(e);
            });
        }
    }

    // 处理报名
    handleRegistration(event) {
        event.preventDefault();
        
        // 检查登录状态
        if (window.appState && !window.appState.getState('isLoggedIn')) {
            if (window.messageManager) {
                window.messageManager.show('请先登录后报名', 'warning');
            }
            return;
        }

        // 检查是否已报名
        if (window.appState && window.appState.getState('isRegistered')) {
            if (window.messageManager) {
                window.messageManager.show('您已经报名成功', 'info');
            }
            return;
        }

        // 显示报名确认弹窗或直接处理报名
        this.processRegistration();
    }

    // 处理报名流程
    processRegistration() {
        const registerBtn = document.getElementById('registerBtn');
        
        if (registerBtn) {
            // 设置按钮为加载状态
            this.setButtonLoading(registerBtn, '报名中...');
        }

        // 模拟报名过程
        setTimeout(() => {
            // 更新报名状态
            if (window.appState) {
                window.appState.setState('isRegistered', true);
            }

            // 显示成功消息
            if (window.messageManager) {
                window.messageManager.show('报名成功！', 'success');
            }

            // 更新按钮状态
            this.updateRegistrationButtonState();
        }, 2000);
    }

    // 更新报名按钮状态
    updateRegistrationButtonState() {
        const registerBtn = document.getElementById('registerBtn');
        if (!registerBtn) return;

        const isLoggedIn = window.appState ? window.appState.getState('isLoggedIn') : false;
        const isRegistered = window.appState ? window.appState.getState('isRegistered') : false;

        if (!isLoggedIn) {
            // 未登录状态
            registerBtn.textContent = '立即报名';
            registerBtn.className = 'btn btn-primary';
            registerBtn.disabled = false;
        } else if (isRegistered) {
            // 已报名状态
            registerBtn.textContent = '已报名';
            registerBtn.className = 'btn btn-registered';
            registerBtn.disabled = true;
        } else {
            // 已登录但未报名
            registerBtn.textContent = '立即报名';
            registerBtn.className = 'btn btn-primary';
            registerBtn.disabled = false;
        }
    }

    // 设置按钮加载状态
    setButtonLoading(button, loadingText) {
        if (!button) return;
        
        button.setAttribute('data-original-text', button.textContent);
        button.setAttribute('data-original-class', button.className);
        button.textContent = loadingText;
        button.disabled = true;
    }

    // 恢复按钮状态
    restoreButtonState(button) {
        if (!button) return;
        
        const originalText = button.getAttribute('data-original-text');
        const originalClass = button.getAttribute('data-original-class');
        
        if (originalText) {
            button.textContent = originalText;
            button.removeAttribute('data-original-text');
        }
        
        if (originalClass) {
            button.className = originalClass;
            button.removeAttribute('data-original-class');
        }
        
        button.disabled = false;
    }

    // 检查报名资格
    checkRegistrationEligibility() {
        // 这里可以添加更多的报名资格检查逻辑
        return true;
    }

    // 获取报名状态
    getRegistrationStatus() {
        if (!window.appState) return 'unknown';
        
        const isLoggedIn = window.appState.getState('isLoggedIn');
        const isRegistered = window.appState.getState('isRegistered');
        
        if (!isLoggedIn) return 'not_logged_in';
        if (isRegistered) return 'registered';
        return 'not_registered';
    }
}

// 导出模块
window.RegistrationModule = RegistrationModule;