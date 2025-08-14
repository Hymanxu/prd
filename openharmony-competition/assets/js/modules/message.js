/**
 * 消息提示管理模块
 * 统一管理所有消息提示的显示
 */

class MessageManager {
    constructor() {
        this.messages = new Map();
        this.messageCounter = 0;
        this.defaultDuration = 3000;
        this.maxMessages = 5;
    }

    // 显示消息
    show(message, type = 'info', duration = this.defaultDuration) {
        const messageId = `message-${++this.messageCounter}`;
        
        // 限制同时显示的消息数量
        if (this.messages.size >= this.maxMessages) {
            this.removeOldestMessage();
        }
        
        const messageElement = this.createMessageElement(messageId, message, type);
        this.messages.set(messageId, {
            element: messageElement,
            type,
            timestamp: Date.now()
        });
        
        // 添加到页面
        document.body.appendChild(messageElement);
        
        // 显示动画
        this.showAnimation(messageElement);
        
        // 自动隐藏
        if (duration > 0) {
            setTimeout(() => {
                this.hide(messageId);
            }, duration);
        }
        
        return messageId;
    }

    // 创建消息元素
    createMessageElement(messageId, message, type) {
        const element = document.createElement('div');
        element.id = messageId;
        element.className = this.getMessageClasses(type);
        
        element.innerHTML = `
            <div class="message-content">
                <div class="message-icon">
                    ${this.getMessageIcon(type)}
                </div>
                <span class="message-text">${this.escapeHtml(message)}</span>
                <button class="message-close" onclick="window.messageManager.hide('${messageId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        return element;
    }

    // 获取消息样式类
    getMessageClasses(type) {
        const baseClasses = 'message-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full max-w-sm';
        const typeClasses = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
    }

    // 获取消息图标
    getMessageIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        return icons[type] || icons.info;
    }

    // 转义HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 显示动画
    showAnimation(element) {
        // 初始状态
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        
        // 动画到可见状态
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    // 隐藏消息
    hide(messageId) {
        const messageData = this.messages.get(messageId);
        if (!messageData) return;
        
        const { element } = messageData;
        
        // 隐藏动画
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        
        // 移除元素
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.messages.delete(messageId);
        }, 300);
    }

    // 移除最旧的消息
    removeOldestMessage() {
        let oldestId = null;
        let oldestTime = Date.now();
        
        for (const [id, data] of this.messages) {
            if (data.timestamp < oldestTime) {
                oldestTime = data.timestamp;
                oldestId = id;
            }
        }
        
        if (oldestId) {
            this.hide(oldestId);
        }
    }

    // 清空所有消息
    clear() {
        for (const messageId of this.messages.keys()) {
            this.hide(messageId);
        }
    }

    // 成功消息
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    // 错误消息
    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    // 警告消息
    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    // 信息消息
    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // 显示加载消息
    loading(message) {
        const messageId = this.show(message, 'info', 0); // 不自动隐藏
        
        // 添加加载动画
        const messageElement = this.messages.get(messageId)?.element;
        if (messageElement) {
            const icon = messageElement.querySelector('.message-icon');
            if (icon) {
                icon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }
        }
        
        return messageId;
    }

    // 更新加载消息为成功
    loadingSuccess(messageId, successMessage) {
        const messageData = this.messages.get(messageId);
        if (!messageData) return;
        
        const { element } = messageData;
        
        // 更新样式
        element.className = this.getMessageClasses('success');
        
        // 更新内容
        const icon = element.querySelector('.message-icon');
        const text = element.querySelector('.message-text');
        
        if (icon) icon.innerHTML = this.getMessageIcon('success');
        if (text) text.textContent = successMessage;
        
        // 设置自动隐藏
        setTimeout(() => {
            this.hide(messageId);
        }, this.defaultDuration);
    }

    // 更新加载消息为错误
    loadingError(messageId, errorMessage) {
        const messageData = this.messages.get(messageId);
        if (!messageData) return;
        
        const { element } = messageData;
        
        // 更新样式
        element.className = this.getMessageClasses('error');
        
        // 更新内容
        const icon = element.querySelector('.message-icon');
        const text = element.querySelector('.message-text');
        
        if (icon) icon.innerHTML = this.getMessageIcon('error');
        if (text) text.textContent = errorMessage;
        
        // 设置自动隐藏
        setTimeout(() => {
            this.hide(messageId);
        }, this.defaultDuration);
    }

    // 确认对话框
    confirm(message, options = {}) {
        return new Promise((resolve) => {
            const {
                title = '确认',
                confirmText = '确认',
                cancelText = '取消',
                type = 'warning'
            } = options;
            
            // 创建确认对话框
            const modalId = 'confirm-modal';
            const modalHTML = `
                <div class="modal show flex" id="${modalId}">
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h3 class="modal-title">${this.escapeHtml(title)}</h3>
                        </div>
                        <div class="modal-body">
                            <div class="confirm-message">
                                <div class="confirm-icon ${type}">
                                    ${this.getMessageIcon(type)}
                                </div>
                                <p>${this.escapeHtml(message)}</p>
                            </div>
                        </div>
                        <div class="modal-footer" style="padding: 20px; text-align: right; border-top: 1px solid #F5F5F5;">
                            <button class="btn btn-secondary" id="confirm-cancel" style="margin-right: 12px;">
                                ${this.escapeHtml(cancelText)}
                            </button>
                            <button class="btn btn-primary" id="confirm-ok">
                                ${this.escapeHtml(confirmText)}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // 添加到页面
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            document.body.style.overflow = 'hidden';
            
            const modal = document.getElementById(modalId);
            const okBtn = document.getElementById('confirm-ok');
            const cancelBtn = document.getElementById('confirm-cancel');
            
            // 绑定事件
            const cleanup = () => {
                if (modal && modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                document.body.style.overflow = '';
            };
            
            okBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });
            
            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            });
            
            // ESC键关闭
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', escHandler);
                    cleanup();
                    resolve(false);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    // 获取当前消息数量
    getMessageCount() {
        return this.messages.size;
    }

    // 获取指定类型的消息数量
    getMessageCountByType(type) {
        let count = 0;
        for (const data of this.messages.values()) {
            if (data.type === type) {
                count++;
            }
        }
        return count;
    }

    // 设置默认持续时间
    setDefaultDuration(duration) {
        this.defaultDuration = duration;
    }

    // 设置最大消息数量
    setMaxMessages(max) {
        this.maxMessages = max;
        
        // 如果当前消息数量超过限制，移除多余的
        while (this.messages.size > this.maxMessages) {
            this.removeOldestMessage();
        }
    }
}

// 创建全局实例
window.MessageManager = MessageManager;