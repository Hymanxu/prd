/**
 * 应用状态管理模块
 */

// 应用状态管理
class AppState {
  constructor() {
    this.state = {
      isLoggedIn: false,
      isRegistered: false,
      currentUser: null,
      currentTab: 'intro',
      submissions: [],
      leaderboard: [],
      problems: []
    };
    
    this.subscribers = {};
    this.loadState();
  }

  // 订阅状态变化
  subscribe(event, callback) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  // 取消订阅
  unsubscribe(event, callback) {
    if (this.subscribers[event]) {
      this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    }
  }

  // 触发事件
  emit(event, data) {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(callback => callback(data));
    }
  }

  // 更新状态
  setState(updates) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    // 保存到本地存储
    this.saveState();
    
    // 触发状态变化事件
    this.emit('stateChange', { oldState, newState: this.state });
    
    // 触发具体的状态变化事件
    Object.keys(updates).forEach(key => {
      if (oldState[key] !== this.state[key]) {
        this.emit(`${key}Change`, this.state[key]);
      }
    });
  }

  // 获取状态
  getState(key) {
    return key ? this.state[key] : this.state;
  }

  // 加载状态
  loadState() {
    const savedState = {
      isLoggedIn: DataManager.get('isLoggedIn'),
      isRegistered: DataManager.get('isRegistered'),
      currentUser: DataManager.get('userInfo'),
      submissions: DataManager.get('userSubmissions') || [],
      currentTab: DataManager.get('currentTab') || 'intro'
    };

    // 过滤掉 null 值
    Object.keys(savedState).forEach(key => {
      if (savedState[key] !== null) {
        this.state[key] = savedState[key];
      }
    });
  }

  // 保存状态
  saveState() {
    DataManager.set('isLoggedIn', this.state.isLoggedIn);
    DataManager.set('isRegistered', this.state.isRegistered);
    DataManager.set('userInfo', this.state.currentUser);
    DataManager.set('userSubmissions', this.state.submissions);
    DataManager.set('currentTab', this.state.currentTab);
  }

  // 用户登录
  login(userInfo) {
    this.setState({
      isLoggedIn: true,
      currentUser: userInfo
    });
  }

  // 用户登出
  logout() {
    this.setState({
      isLoggedIn: false,
      isRegistered: false,
      currentUser: null,
      submissions: []
    });

    // 清除所有本地数据
    DataManager.remove('userInfo');
    DataManager.remove('isLoggedIn');
    DataManager.remove('isRegistered');
    DataManager.remove('profileCompleted');
    DataManager.remove('userSubmissions');
  }

  // 用户报名
  register() {
    this.setState({
      isRegistered: true
    });
  }

  // 取消报名
  cancelRegister() {
    this.setState({
      isRegistered: false
    });
  }

  // 切换Tab
  switchTab(tabName) {
    this.setState({
      currentTab: tabName
    });
  }

  // 添加提交记录
  addSubmission(submission) {
    const submissions = [...this.state.submissions];
    submissions.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...submission
    });
    
    this.setState({
      submissions
    });
  }

  // 更新提交状态
  updateSubmission(id, updates) {
    const submissions = this.state.submissions.map(submission => 
      submission.id === id ? { ...submission, ...updates } : submission
    );
    
    this.setState({
      submissions
    });
  }

  // 更新用户信息
  updateUser(userInfo) {
    this.setState({
      currentUser: { ...this.state.currentUser, ...userInfo }
    });
  }
}

// 创建全局应用状态实例
window.appState = new AppState();