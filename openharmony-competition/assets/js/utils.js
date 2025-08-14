/**
 * 通用工具函数库
 */

// 数据存储管理
class DataManager {
  static set(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    } catch (error) {
      console.error('存储数据失败:', error);
    }
  }

  static get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('读取数据失败:', error);
      return defaultValue;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('删除数据失败:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清空数据失败:', error);
    }
  }
}

// 表单验证工具
class FormValidator {
  static rules = {
    required: (value, message = '此字段为必填项') => {
      return value && value.toString().trim() !== '' ? null : message;
    },
    
    email: (value, message = '请输入有效的邮箱地址') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value) ? null : message;
    },
    
    phone: (value, message = '请输入有效的手机号码') => {
      const phoneRegex = /^1[3-9]\d{9}$/;
      return !value || phoneRegex.test(value) ? null : message;
    },
    
    minLength: (minLength, message) => (value) => {
      if (!message) message = `最少需要${minLength}个字符`;
      return !value || value.length >= minLength ? null : message;
    },
    
    maxLength: (maxLength, message) => (value) => {
      if (!message) message = `最多允许${maxLength}个字符`;
      return !value || value.length <= maxLength ? null : message;
    }
  };

  static validate(value, rules) {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }

  static validateForm(formData, validationRules) {
    const errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(validationRules)) {
      const error = this.validate(formData[field], rules);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }

    return { isValid, errors };
  }
}

// 日期时间工具
class DateUtils {
  static format(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  static timeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}天前`;
    if (diffHours > 0) return `${diffHours}小时前`;
    if (diffMinutes > 0) return `${diffMinutes}分钟前`;
    return '刚刚';
  }

  static countdown(targetDate) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { expired: false, days, hours, minutes, seconds };
  }
}

// DOM操作工具
class DOMUtils {
  static $(selector) {
    return document.querySelector(selector);
  }

  static $$(selector) {
    return document.querySelectorAll(selector);
  }

  static createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static show(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.style.display = '';
  }

  static hide(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.style.display = 'none';
  }

  static toggle(element) {
    if (typeof element === 'string') element = this.$(element);
    if (element) {
      element.style.display = element.style.display === 'none' ? '' : 'none';
    }
  }

  static addClass(element, className) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.add(className);
  }

  static removeClass(element, className) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.remove(className);
  }

  static toggleClass(element, className) {
    if (typeof element === 'string') element = this.$(element);
    if (element) element.classList.toggle(className);
  }
}

// 消息提示工具
class MessageUtils {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };
    
    toast.classList.add(bgColors[type] || bgColors.info);
    toast.innerHTML = `
      <div class="flex items-center text-white">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  static success(message, duration) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// 加载状态管理
class LoadingUtils {
  static show(element, text = '加载中...') {
    if (typeof element === 'string') element = DOMUtils.$(element);
    if (!element) return;

    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    element.disabled = true;
    element.innerHTML = `<i class="t-loading mr-2"></i>${text}`;
  }

  static hide(element) {
    if (typeof element === 'string') element = DOMUtils.$(element);
    if (!element) return;

    const originalContent = element.getAttribute('data-original-content');
    if (originalContent) {
      element.innerHTML = originalContent;
      element.removeAttribute('data-original-content');
    }
    element.disabled = false;
  }
}

// 模态框管理
class ModalUtils {
  static show(modalId, onShow) {
    const modal = DOMUtils.$(modalId);
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (onShow) onShow();

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hide(modalId);
      }
    });
  }

  static hide(modalId, onHide) {
    const modal = DOMUtils.$(modalId);
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';

    if (onHide) onHide();
  }
}

// URL工具
class UrlUtils {
  static getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  static setParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
  }

  static removeParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.replaceState({}, '', url);
  }

  static redirect(url, newTab = false) {
    if (newTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }
}

// 防抖和节流
class ThrottleUtils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// 导出全局使用
window.DataManager = DataManager;
window.FormValidator = FormValidator;
window.DateUtils = DateUtils;
window.DOMUtils = DOMUtils;
window.MessageUtils = MessageUtils;
window.LoadingUtils = LoadingUtils;
window.ModalUtils = ModalUtils;
window.UrlUtils = UrlUtils;
window.ThrottleUtils = ThrottleUtils;