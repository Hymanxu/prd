/**
 * 模态框管理模块
 * 统一管理所有模态框的显示、隐藏和交互
 */

class ModalManager {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.initModals();
        this.bindGlobalEvents();
    }

    // 初始化所有模态框
    initModals() {
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modal => {
            const modalId = modal.id;
            if (modalId) {
                this.modals.set(modalId, {
                    element: modal,
                    isVisible: false
                });
                this.bindModalEvents(modal);
            }
        });
    }

    // 绑定模态框事件
    bindModalEvents(modal) {
        // 关闭按钮
        const closeButtons = modal.querySelectorAll('.modal-close, [data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hide(modal.id);
            });
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide(modal.id);
            }
        });
    }

    // 绑定全局事件
    bindGlobalEvents() {
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.hide(this.currentModal);
            }
        });

        // 替换原有的onclick事件
        this.replaceOnclickEvents();
    }

    // 替换原有的onclick事件为事件监听器
    replaceOnclickEvents() {
        // 竞赛协议弹窗
        const agreementLinks = document.querySelectorAll('[onclick="showAgreementModal()"]');
        agreementLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            newLink.removeAttribute('onclick');
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.show('agreementModal');
            });
            link.parentNode.replaceChild(newLink, link);
        });

        // 往期赛事弹窗
        const pastContestBtns = document.querySelectorAll('[onclick="showPastContests()"]');
        pastContestBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            newBtn.removeAttribute('onclick');
            newBtn.addEventListener('click', () => this.show('pastContestModal'));
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // 模态框关闭事件
        this.replaceCloseEvents();
    }

    // 替换模态框关闭事件
    replaceCloseEvents() {
        // 协议弹窗关闭
        const agreementModal = document.getElementById('agreementModal');
        if (agreementModal) {
            const oldOnclick = agreementModal.getAttribute('onclick');
            if (oldOnclick && oldOnclick.includes('hideAgreementModal')) {
                agreementModal.removeAttribute('onclick');
            }
        }

        // 往期赛事弹窗关闭
        const pastContestModal = document.getElementById('pastContestModal');
        if (pastContestModal) {
            const oldOnclick = pastContestModal.getAttribute('onclick');
            if (oldOnclick && oldOnclick.includes('hidePastContests')) {
                pastContestModal.removeAttribute('onclick');
            }
        }

        // 个人信息弹窗关闭
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            const oldOnclick = profileModal.getAttribute('onclick');
            if (oldOnclick && oldOnclick.includes('hideProfileModal')) {
                profileModal.removeAttribute('onclick');
            }
        }

        // 登录弹窗关闭
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            const oldOnclick = loginModal.getAttribute('onclick');
            if (oldOnclick && oldOnclick.includes('hideLoginModal')) {
                loginModal.removeAttribute('onclick');
            }
        }

        // 提交弹窗关闭
        const submitModal = document.getElementById('submitModal');
        if (submitModal) {
            const oldOnclick = submitModal.getAttribute('onclick');
            if (oldOnclick && oldOnclick.includes('hideSubmitModal')) {
                submitModal.removeAttribute('onclick');
            }
        }
    }

    // 显示模态框
    show(modalId, options = {}) {
        const modalData = this.modals.get(modalId);
        if (!modalData) {
            console.warn(`Modal with id "${modalId}" not found`);
            return;
        }

        const { element } = modalData;
        
        // 隐藏当前模态框（如果有）
        if (this.currentModal && this.currentModal !== modalId) {
            this.hide(this.currentModal);
        }

        // 显示模态框
        element.classList.remove('hidden');
        element.classList.add('show', 'flex');
        document.body.style.overflow = 'hidden';

        // 更新状态
        modalData.isVisible = true;
        this.currentModal = modalId;

        // 添加显示动画
        requestAnimationFrame(() => {
            const content = element.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(0.95)';
                content.style.opacity = '0';
                content.style.transition = 'all 0.3s ease-out';
                
                requestAnimationFrame(() => {
                    content.style.transform = 'scale(1)';
                    content.style.opacity = '1';
                });
            }
        });

        // 执行回调
        if (options.onShow) {
            options.onShow();
        }

        // 触发自定义事件
        element.dispatchEvent(new CustomEvent('modal:show', { detail: { modalId } }));
    }

    // 隐藏模态框
    hide(modalId, options = {}) {
        const modalData = this.modals.get(modalId);
        if (!modalData || !modalData.isVisible) {
            return;
        }

        const { element } = modalData;
        
        // 添加隐藏动画
        const content = element.querySelector('.modal-content');
        if (content) {
            content.style.transition = 'all 0.2s ease-in';
            content.style.transform = 'scale(0.95)';
            content.style.opacity = '0';
        }

        // 延迟隐藏
        setTimeout(() => {
            element.classList.add('hidden');
            element.classList.remove('show', 'flex');
            document.body.style.overflow = '';

            // 重置样式
            if (content) {
                content.style.transform = '';
                content.style.opacity = '';
                content.style.transition = '';
            }

            // 更新状态
            modalData.isVisible = false;
            if (this.currentModal === modalId) {
                this.currentModal = null;
            }

            // 执行回调
            if (options.onHide) {
                options.onHide();
            }

            // 触发自定义事件
            element.dispatchEvent(new CustomEvent('modal:hide', { detail: { modalId } }));
        }, 200);
    }

    // 切换模态框显示状态
    toggle(modalId, options = {}) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        if (modalData.isVisible) {
            this.hide(modalId, options);
        } else {
            this.show(modalId, options);
        }
    }

    // 检查模态框是否可见
    isVisible(modalId) {
        const modalData = this.modals.get(modalId);
        return modalData ? modalData.isVisible : false;
    }

    // 获取当前可见的模态框
    getCurrentModal() {
        return this.currentModal;
    }

    // 关闭所有模态框
    hideAll() {
        this.modals.forEach((modalData, modalId) => {
            if (modalData.isVisible) {
                this.hide(modalId);
            }
        });
    }

    // 设置模态框内容
    setContent(modalId, content) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        const body = modalData.element.querySelector('.modal-body');
        if (body && content) {
            body.innerHTML = content;
        }
    }

    // 设置模态框标题
    setTitle(modalId, title) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        const titleEl = modalData.element.querySelector('.modal-title');
        if (titleEl && title) {
            titleEl.textContent = title;
        }
    }

    // 添加模态框事件监听器
    on(modalId, eventType, handler) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        modalData.element.addEventListener(`modal:${eventType}`, handler);
    }

    // 移除模态框事件监听器
    off(modalId, eventType, handler) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        modalData.element.removeEventListener(`modal:${eventType}`, handler);
    }

    // 注册新的模态框
    register(modalId, element) {
        if (this.modals.has(modalId)) {
            console.warn(`Modal with id "${modalId}" is already registered`);
            return;
        }

        this.modals.set(modalId, {
            element: element,
            isVisible: false
        });
        this.bindModalEvents(element);
    }

    // 注销模态框
    unregister(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        if (modalData.isVisible) {
            this.hide(modalId);
        }
        this.modals.delete(modalId);
    }
}

// 创建全局实例
window.ModalManager = ModalManager;