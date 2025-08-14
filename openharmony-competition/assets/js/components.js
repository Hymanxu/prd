/**
 * 组件基类和通用组件
 */

// 基础组件类
class Component {
  constructor(element) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.listeners = [];
    this.init();
  }

  init() {
    // 子类重写此方法
  }

  // 事件绑定
  on(event, selector, handler) {
    const listener = (e) => {
      const target = e.target.closest(selector);
      if (target && this.element.contains(target)) {
        handler.call(target, e);
      }
    };
    
    this.element.addEventListener(event, listener);
    this.listeners.push({ event, listener });
  }

  // 移除所有事件监听
  destroy() {
    this.listeners.forEach(({ event, listener }) => {
      this.element.removeEventListener(event, listener);
    });
    this.listeners = [];
  }

  // 渲染方法
  render(data) {
    // 子类重写此方法
  }

  // 更新方法
  update(data) {
    this.render(data);
  }
}

// Tab组件
class TabComponent extends Component {
  constructor(element, options = {}) {
    super(element);
    this.options = {
      activeClass: 'active',
      contentSelector: '.tab-content',
      onSwitch: null,
      ...options
    };
    this.currentTab = null;
  }

  init() {
    this.on('click', '[data-tab]', (e) => {
      e.preventDefault();
      const tabName = e.target.getAttribute('data-tab');
      this.switchTo(tabName);
    });

    // 设置初始激活tab
    const firstTab = this.element.querySelector('[data-tab]');
    if (firstTab) {
      this.switchTo(firstTab.getAttribute('data-tab'));
    }
  }

  switchTo(tabName) {
    if (this.currentTab === tabName) return;

    // 更新tab按钮状态
    this.element.querySelectorAll('[data-tab]').forEach(tab => {
      const isActive = tab.getAttribute('data-tab') === tabName;
      tab.classList.toggle(this.options.activeClass, isActive);
      
      // TDesign样式更新
      if (isActive) {
        tab.classList.add('border-blue-500', 'text-blue-600');
        tab.classList.remove('border-transparent', 'text-gray-500');
      } else {
        tab.classList.remove('border-blue-500', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-500');
      }
    });

    // 更新内容区域
    document.querySelectorAll(this.options.contentSelector).forEach(content => {
      const contentId = content.id;
      const isActive = contentId === `tab-${tabName}`;
      content.classList.toggle('hidden', !isActive);
    });

    this.currentTab = tabName;

    // 调用回调
    if (this.options.onSwitch) {
      this.options.onSwitch(tabName);
    }

    // 更新应用状态
    if (window.appState) {
      window.appState.switchTab(tabName);
    }
  }
}

// 用户菜单组件
class UserMenuComponent extends Component {
  constructor(element, options = {}) {
    super(element);
    this.options = {
      menuSelector: '.user-menu',
      triggerSelector: '.user-menu-trigger',
      delay: 300,
      ...options
    };
    this.hideTimeout = null;
  }

  init() {
    const trigger = this.element.querySelector(this.options.triggerSelector);
    const menu = this.element.querySelector(this.options.menuSelector);

    if (!trigger || !menu) return;

    // 鼠标进入显示菜单
    trigger.addEventListener('mouseenter', () => {
      this.showMenu();
    });

    // 鼠标离开隐藏菜单
    trigger.addEventListener('mouseleave', () => {
      this.hideMenu();
    });

    // 菜单内部鼠标事件
    menu.addEventListener('mouseenter', () => {
      this.cancelHide();
    });

    menu.addEventListener('mouseleave', () => {
      this.hideMenu();
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.hideMenuImmediate();
      }
    });
  }

  showMenu() {
    this.cancelHide();
    const menu = this.element.querySelector(this.options.menuSelector);
    if (menu) {
      menu.classList.remove('hidden');
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px)';
      
      requestAnimationFrame(() => {
        menu.style.transition = 'all 0.2s ease-out';
        menu.style.opacity = '1';
        menu.style.transform = 'translateY(0)';
      });
    }
  }

  hideMenu() {
    this.hideTimeout = setTimeout(() => {
      this.hideMenuImmediate();
    }, this.options.delay);
  }

  hideMenuImmediate() {
    const menu = this.element.querySelector(this.options.menuSelector);
    if (menu) {
      menu.style.transition = 'all 0.2s ease-in';
      menu.style.opacity = '0';
      menu.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        menu.classList.add('hidden');
      }, 200);
    }
  }

  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}

// 模态框组件
class ModalComponent extends Component {
  constructor(element, options = {}) {
    super(element);
    this.options = {
      closeSelector: '[data-modal-close]',
      backdrop: true,
      keyboard: true,
      onShow: null,
      onHide: null,
      ...options
    };
    this.isVisible = false;
  }

  init() {
    // 关闭按钮
    this.on('click', this.options.closeSelector, () => {
      this.hide();
    });

    // 点击背景关闭
    if (this.options.backdrop) {
      this.element.addEventListener('click', (e) => {
        if (e.target === this.element) {
          this.hide();
        }
      });
    }

    // ESC键关闭
    if (this.options.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible) {
          this.hide();
        }
      });
    }
  }

  show() {
    if (this.isVisible) return;

    this.element.classList.remove('hidden');
    this.element.classList.add('flex');
    document.body.style.overflow = 'hidden';
    this.isVisible = true;

    if (this.options.onShow) {
      this.options.onShow();
    }
  }

  hide() {
    if (!this.isVisible) return;

    this.element.classList.add('hidden');
    this.element.classList.remove('flex');
    document.body.style.overflow = '';
    this.isVisible = false;

    if (this.options.onHide) {
      this.options.onHide();
    }
  }

  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
}

// 表单组件
class FormComponent extends Component {
  constructor(element, options = {}) {
    super(element);
    this.options = {
      validationRules: {},
      onSubmit: null,
      onValidate: null,
      realTimeValidation: true,
      ...options
    };
    this.formData = {};
    this.errors = {};
  }

  init() {
    // 表单提交
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // 实时验证
    if (this.options.realTimeValidation) {
      this.element.addEventListener('input', (e) => {
        const field = e.target.name;
        if (field && this.options.validationRules[field]) {
          this.validateField(field, e.target.value);
        }
      });

      this.element.addEventListener('blur', (e) => {
        const field = e.target.name;
        if (field && this.options.validationRules[field]) {
          this.validateField(field, e.target.value);
        }
      }, true);
    }
  }

  // 收集表单数据
  collectFormData() {
    const formData = new FormData(this.element);
    this.formData = {};
    
    for (const [key, value] of formData.entries()) {
      this.formData[key] = value;
    }
    
    return this.formData;
  }

  // 验证单个字段
  validateField(field, value) {
    const rules = this.options.validationRules[field];
    if (!rules) return null;

    const error = FormValidator.validate(value, rules);
    
    if (error) {
      this.errors[field] = error;
    } else {
      delete this.errors[field];
    }

    this.showFieldError(field, error);
    return error;
  }

  // 验证整个表单
  validateForm() {
    this.collectFormData();
    const { isValid, errors } = FormValidator.validateForm(this.formData, this.options.validationRules);
    
    this.errors = errors;
    
    // 显示所有错误
    Object.keys(this.options.validationRules).forEach(field => {
      this.showFieldError(field, errors[field]);
    });

    if (this.options.onValidate) {
      this.options.onValidate(isValid, errors);
    }

    return isValid;
  }

  // 显示字段错误
  showFieldError(field, error) {
    const fieldElement = this.element.querySelector(`[name="${field}"]`);
    if (!fieldElement) return;

    const errorElement = this.element.querySelector(`[data-error="${field}"]`);
    
    if (error) {
      fieldElement.classList.add('border-red-500');
      fieldElement.classList.remove('border-gray-300');
      
      if (errorElement) {
        errorElement.textContent = error;
        errorElement.classList.remove('hidden');
      }
    } else {
      fieldElement.classList.remove('border-red-500');
      fieldElement.classList.add('border-gray-300');
      
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
      }
    }
  }

  // 处理表单提交
  handleSubmit() {
    if (this.validateForm()) {
      if (this.options.onSubmit) {
        this.options.onSubmit(this.formData);
      }
    }
  }

  // 重置表单
  reset() {
    this.element.reset();
    this.formData = {};
    this.errors = {};
    
    // 清除所有错误显示
    Object.keys(this.options.validationRules).forEach(field => {
      this.showFieldError(field, null);
    });
  }

  // 设置字段值
  setFieldValue(field, value) {
    const fieldElement = this.element.querySelector(`[name="${field}"]`);
    if (fieldElement) {
      fieldElement.value = value;
      this.formData[field] = value;
    }
  }

  // 获取字段值
  getFieldValue(field) {
    return this.formData[field] || this.element.querySelector(`[name="${field}"]`)?.value || '';
  }
}

// 倒计时组件
class CountdownComponent extends Component {
  constructor(element, options = {}) {
    super(element);
    this.options = {
      targetDate: null,
      format: 'DD天 HH:mm:ss',
      onExpired: null,
      onUpdate: null,
      ...options
    };
    this.timer = null;
  }

  init() {
    if (this.options.targetDate) {
      this.start();
    }
  }

  start() {
    this.timer = setInterval(() => {
      this.update();
    }, 1000);
    this.update(); // 立即更新一次
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  update() {
    const result = DateUtils.countdown(this.options.targetDate);
    
    if (result.expired) {
      this.stop();
      this.element.textContent = '已结束';
      
      if (this.options.onExpired) {
        this.options.onExpired();
      }
    } else {
      const formatted = this.formatTime(result);
      this.element.textContent = formatted;
      
      if (this.options.onUpdate) {
        this.options.onUpdate(result);
      }
    }
  }

  formatTime({ days, hours, minutes, seconds }) {
    return this.options.format
      .replace('DD', days.toString().padStart(2, '0'))
      .replace('HH', hours.toString().padStart(2, '0'))
      .replace('mm', minutes.toString().padStart(2, '0'))
      .replace('ss', seconds.toString().padStart(2, '0'));
  }

  destroy() {
    this.stop();
    super.destroy();
  }
}

// 导出组件类
window.Component = Component;
window.TabComponent = TabComponent;
window.UserMenuComponent = UserMenuComponent;
window.ModalComponent = ModalComponent;
window.FormComponent = FormComponent;
window.CountdownComponent = CountdownComponent;