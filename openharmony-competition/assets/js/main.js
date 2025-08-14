/**
 * OpenHarmony Contest 主应用入口
 * 负责初始化所有模块并协调模块间的交互
 */

class Application {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.initPromise = null;
    }

    // 初始化应用
    async init() {
        if (this.isInitialized) {
            return;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._doInit();
        await this.initPromise;
        
        this.isInitialized = true;
        return this;
    }

    // 执行初始化
    async _doInit() {
        try {
            console.log('Initializing OpenHarmony Contest Application...');
            
            // 1. 初始化核心模块
            await this.initCoreModules();
            
            // 2. 初始化功能模块
            await this.initFeatureModules();
            
            // 3. 绑定模块间的交互
            this.bindModuleInteractions();
            
            // 4. 加载应用状态
            this.loadApplicationState();
            
            // 5. 检查特殊条件
            this.checkSpecialConditions();
            
            console.log('Application initialized successfully');
            
            // 触发初始化完成事件
            this.emit('app:initialized');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            throw error;
        }
    }

    // 初始化核心模块
    async initCoreModules() {
        console.log('Initializing core modules...');
        
        // 消息管理器
        this.modules.messageManager = new MessageManager();
        window.messageManager = this.modules.messageManager;
        
        // 模态框管理器
        this.modules.modalManager = new ModalManager();
        window.modalManager = this.modules.modalManager;
        
        // 应用状态（已在 app-state.js 中初始化）
        this.modules.appState = window.appState;
        
        console.log('Core modules initialized');
    }

    // 初始化功能模块
    async initFeatureModules() {
        console.log('Initializing feature modules...');
        
        // 确保DOM已经加载完成
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // 用户认证模块
        this.modules.authModule = new AuthModule();
        window.authModule = this.modules.authModule;
        
        // 导航模块
        this.modules.navigationModule = new NavigationModule();
        window.navigationModule = this.modules.navigationModule;
        
        // 竞赛模块
        this.modules.contestModule = new ContestModule();
        window.contestModule = this.modules.contestModule;
        
        // 赛题模块
        this.modules.problemsModule = new ProblemsModule();
        window.problemsModule = this.modules.problemsModule;
        
        // 排行榜模块
        this.modules.leaderboardModule = new LeaderboardModule();
        window.leaderboardModule = this.modules.leaderboardModule;
        
        // 报名模块
        this.modules.registrationModule = new RegistrationModule();
        window.registrationModule = this.modules.registrationModule;
        
        console.log('Feature modules initialized');
    }

    // 绑定模块间的交互
    bindModuleInteractions() {
        console.log('Binding module interactions...');
        
        // 确保 appState 存在
        if (!this.modules.appState) {
            console.error('AppState module not found');
            return;
        }
        
        // 监听登录状态变化，更新相关模块
        this.modules.appState.subscribe('isLoggedInChange', (isLoggedIn) => {
            if (isLoggedIn) {
                this.onUserLoggedIn();
            } else {
                this.onUserLoggedOut();
            }
        });
        
        // 监听报名状态变化
        this.modules.appState.subscribe('isRegisteredChange', (isRegistered) => {
            this.onRegistrationChange(isRegistered);
        });
        
        // 监听Tab切换
        this.modules.navigationModule.onTabSwitch((event) => {
            this.onTabSwitch(event.detail);
        });
        
        console.log('Module interactions bound');
    }

    // 加载应用状态
    loadApplicationState() {
        console.log('Loading application state...');
        
        // 从本地存储加载状态
        this.modules.appState.loadState();
        
        // 更新所有模块的UI状态
        this.updateAllModuleUI();
        
        console.log('Application state loaded');
    }

    // 检查特殊条件
    checkSpecialConditions() {
        // 检查是否从其他页面返回
        this.modules.authModule.checkReturnFromAuth();
        
        // 检查URL参数
        this.checkUrlParameters();
        
        // 检查浏览器兼容性
        this.checkBrowserCompatibility();
    }

    // 检查URL参数
    checkUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // 检查是否需要跳转到特定Tab
        const tab = urlParams.get('tab');
        if (tab && this.modules.navigationModule.isValidTab(tab)) {
            this.modules.navigationModule.navigateTo(tab);
        }
        
        // 检查是否需要显示特定模态框
        const modal = urlParams.get('modal');
        if (modal) {
            setTimeout(() => {
                this.modules.modalManager.show(modal);
            }, 500);
        }
    }

    // 检查浏览器兼容性
    checkBrowserCompatibility() {
        // 检查是否支持现代JavaScript特性
        if (!window.fetch || !window.Promise || !window.localStorage) {
            this.modules.messageManager.error('您的浏览器版本过低，请升级浏览器以获得最佳体验', 0);
        }
        
        // 检查是否支持CSS Grid
        if (!CSS.supports('display', 'grid')) {
            console.warn('Browser does not support CSS Grid');
        }
    }

    // 用户登录时的处理
    onUserLoggedIn() {
        console.log('User logged in');
        
        // 更新所有模块UI
        this.updateAllModuleUI();
        
        // 显示欢迎消息
        const user = this.modules.appState.getState('currentUser');
        if (user && user.name) {
            this.modules.messageManager.success(`欢迎回来，${user.name}！`);
        }
    }

    // 用户登出时的处理
    onUserLoggedOut() {
        console.log('User logged out');
        
        // 更新所有模块UI
        this.updateAllModuleUI();
        
        // 关闭可能打开的模态框
        this.modules.modalManager.hideAll();
        
        // 如果在赛题详情页面，返回列表
        if (this.modules.problemsModule.currentProblem) {
            this.modules.problemsModule.backToProblemList();
        }
    }

    // 报名状态变化时的处理
    onRegistrationChange(isRegistered) {
        console.log('Registration status changed:', isRegistered);
        
        // 更新相关模块UI
        this.modules.contestModule.updateUI();
        this.modules.problemsModule.updateProblemActionsState();
    }

    // Tab切换时的处理
    onTabSwitch(detail) {
        console.log('Tab switched to:', detail.tabName);
        
        // 处理特定Tab的特殊逻辑
        this.modules.navigationModule.handleTabSpecialContent(detail.tabName);
        
        // 更新URL（可选）
        if (window.history && window.history.pushState) {
            const url = new URL(window.location);
            url.searchParams.set('tab', detail.tabName);
            window.history.replaceState({}, '', url);
        }
    }

    // 更新所有模块UI
    updateAllModuleUI() {
        this.modules.authModule.updateAuthUI();
        this.modules.contestModule.updateUI();
        this.modules.problemsModule.updateProblemActionsState();
    }

    // 获取模块实例
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    // 获取所有模块
    getAllModules() {
        return { ...this.modules };
    }

    // 销毁应用
    destroy() {
        console.log('Destroying application...');
        
        // 清理所有模块
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // 清空模块引用
        this.modules = {};
        
        // 重置状态
        this.isInitialized = false;
        this.initPromise = null;
        
        console.log('Application destroyed');
    }

    // 重启应用
    async restart() {
        this.destroy();
        await this.init();
    }

    // 事件发射器
    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    // 事件监听器
    on(eventName, handler) {
        document.addEventListener(eventName, handler);
    }

    // 移除事件监听器
    off(eventName, handler) {
        document.removeEventListener(eventName, handler);
    }

    // 获取应用信息
    getInfo() {
        return {
            name: 'OpenHarmony Contest',
            version: '1.0.0',
            initialized: this.isInitialized,
            modules: Object.keys(this.modules)
        };
    }
}

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (window.messageManager) {
        window.messageManager.error('应用程序发生错误，请刷新页面重试');
    }
});

// 全局未处理的Promise错误
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.messageManager) {
        window.messageManager.error('网络请求失败，请检查网络连接');
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.app) {
        // 页面重新可见时，可以刷新一些数据
        console.log('Page became visible');
    }
});

// 公告详情功能
function initAnnouncementDetail() {
    const announcementLinks = document.querySelectorAll('[data-announcement-detail]');
    const announcementList = document.getElementById('announcementList');
    const announcementDetail = document.getElementById('announcementDetail');
    const backBtn = document.getElementById('backToAnnouncementListBtn');
    
    // 公告详情数据
    const announcementData = {
        'announcement-001': {
            title: '2025年度总决赛报名开始',
            tag: '重要',
            tagClass: 'important',
            date: '2025-01-15',
            content: `
                <h3>赛事背景</h3>
                <p>OpenHarmony社区创新奖励计划年度总决赛是面向全球开发者的顶级技术竞赛，旨在推动OpenHarmony生态系统的创新发展，发掘和培养优秀的技术人才。</p>
                
                <h3>参赛资格</h3>
                <p>参赛者需满足以下条件：</p>
                <ul>
                    <li>在2024年度月赛中累计积分达到500分以上</li>
                    <li>至少参与过3次月度竞赛</li>
                    <li>提交的解决方案通过技术审核</li>
                    <li>遵守竞赛规则和开源社区行为准则</li>
                </ul>
                
                <h3>赛事安排</h3>
                <p><strong>报名时间：</strong>2025年1月15日 - 2月15日</p>
                <p><strong>初赛时间：</strong>2025年2月20日 - 2月25日</p>
                <p><strong>决赛时间：</strong>2025年3月15日 - 3月17日</p>
                <p><strong>举办地点：</strong>深圳市南山区华为总部</p>
                
                <h3>奖励设置</h3>
                <p><strong>总奖金池：100万元人民币</strong></p>
                <ul>
                    <li><strong>冠军（1名）：</strong>50万元 + 华为Mate系列最新旗舰手机 + 荣誉证书</li>
                    <li><strong>亚军（1名）：</strong>25万元 + 华为MatePad Pro + 荣誉证书</li>
                    <li><strong>季军（1名）：</strong>15万元 + 华为MateBook + 荣誉证书</li>
                    <li><strong>优秀奖（5名）：</strong>每人2万元 + 华为智能手表 + 荣誉证书</li>
                </ul>
                
                <h3>报名方式</h3>
                <p>符合条件的参赛者请登录竞赛平台，在个人中心提交总决赛报名申请。报名材料包括：</p>
                <ul>
                    <li>个人技术简历</li>
                    <li>历次月赛参与证明</li>
                    <li>代表性技术作品展示</li>
                    <li>参赛动机说明</li>
                </ul>
                
                <h3>联系方式</h3>
                <p>如有疑问，请联系组委会：</p>
                <p><strong>邮箱：</strong>contest@openharmony.cn</p>
                <p><strong>电话：</strong>400-123-4567</p>
            `
        },
        'announcement-002': {
            title: '12月月赛结果公布',
            tag: '公告',
            tagClass: 'normal',
            date: '2025-01-10',
            content: `
                <h3>赛事概况</h3>
                <p>OpenHarmony社区创新奖励计划12月月赛已于2024年12月31日圆满结束。本次竞赛主题为"OpenHarmony安全测试与漏洞挖掘"，吸引了来自全球的优秀开发者参与。</p>
                
                <h3>参赛数据</h3>
                <ul>
                    <li><strong>报名人数：</strong>234人</li>
                    <li><strong>有效提交：</strong>568个</li>
                    <li><strong>发现漏洞：</strong>23个（其中严重漏洞5个）</li>
                    <li><strong>代码覆盖率提升：</strong>平均15.3%</li>
                </ul>
                
                <h3>获奖名单</h3>
                <h4>🏆 月度冠军</h4>
                <p><strong>张三</strong>（清华大学）- 积分：1,250分</p>
                <p>发现2个严重安全漏洞，提交的Fuzz测试用例覆盖率达到92%</p>
                
                <h4>🥈 月度亚军</h4>
                <p><strong>李四</strong>（北京大学）- 积分：1,180分</p>
                <p>在网络协议安全测试方面表现突出，发现3个中等级别漏洞</p>
                
                <h4>🥉 月度季军</h4>
                <p><strong>王五</strong>（上海交通大学）- 积分：950分</p>
                <p>在驱动程序安全测试领域贡献突出，提交质量优秀</p>
                
                <h4>🌟 优秀奖（5名）</h4>
                <ul>
                    <li>赵六（浙江大学）- 890分</li>
                    <li>钱七（复旦大学）- 820分</li>
                    <li>孙八（中山大学）- 750分</li>
                    <li>周九（华中科技大学）- 680分</li>
                    <li>吴十（西安交通大学）- 620分</li>
                </ul>
                
                <h3>奖金发放</h3>
                <p>所有获奖者的奖金将在3个工作日内发放至您在平台绑定的银行账户。请确保您的收款信息准确无误。</p>
                
                <h3>技术亮点</h3>
                <p>本次竞赛中涌现出许多优秀的技术方案：</p>
                <ul>
                    <li>基于机器学习的智能Fuzz测试框架</li>
                    <li>针对OpenHarmony IPC机制的专项安全测试工具</li>
                    <li>多媒体框架漏洞挖掘的创新方法</li>
                    <li>内核态与用户态交互安全性验证方案</li>
                </ul>
                
                <h3>下期预告</h3>
                <p>1月月赛主题：<strong>"OpenHarmony性能优化挑战"</strong></p>
                <p>报名时间：2025年1月1日 - 1月7日</p>
                <p>敬请期待！</p>
            `
        }
    };
    
    // 绑定查看详情链接
    announcementLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const announcementId = link.getAttribute('data-announcement-detail');
            showAnnouncementDetail(announcementId);
        });
    });
    
    // 绑定返回按钮
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            hideAnnouncementDetail();
        });
    }
    
    // 显示公告详情
    function showAnnouncementDetail(announcementId) {
        const data = announcementData[announcementId];
        if (!data) return;
        
        const sectionTitle = document.getElementById('announcementSectionTitle');
        
        // 更新详情页内容
        document.getElementById('announcementDetailTitle').textContent = data.title;
        document.getElementById('announcementDetailTag').textContent = data.tag;
        document.getElementById('announcementDetailTag').className = `tag ${data.tagClass}`;
        document.getElementById('announcementDetailDate').textContent = data.date;
        document.getElementById('announcementDetailContent').innerHTML = data.content;
        
        // 显示详情页，隐藏列表和标题
        if (sectionTitle) sectionTitle.style.display = 'none';
        if (announcementList) announcementList.style.display = 'none';
        if (announcementDetail) announcementDetail.style.display = 'block';
    }
    
    // 隐藏公告详情
    function hideAnnouncementDetail() {
        const sectionTitle = document.getElementById('announcementSectionTitle');
        
        // 显示列表和标题，隐藏详情页
        if (sectionTitle) sectionTitle.style.display = 'block';
        if (announcementList) announcementList.style.display = 'block';
        if (announcementDetail) announcementDetail.style.display = 'none';
    }
}

// 初始化应用
async function initializeApp() {
    try {
        console.log('Starting application initialization...');
        
        // 等待所有必要的依赖加载完成
        await waitForDependencies();
        
        // 创建应用实例
        window.app = new Application();
        
        // 初始化应用
        await window.app.init();
        
        // 初始化公告详情功能
        initAnnouncementDetail();
        
        console.log('Application ready!');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // 显示友好的错误消息
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f5f5f5;
            ">
                <h1 style="color: #E34D59; margin-bottom: 16px;">应用初始化失败</h1>
                <p style="color: #666; margin-bottom: 24px;">抱歉，应用程序无法正常启动</p>
                <p style="color: #999; margin-bottom: 24px; font-size: 14px;">错误详情: ${error.message}</p>
                <button onclick="window.location.reload()" style="
                    background: #0052D9;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                ">重新加载页面</button>
            </div>
        `;
    }
}

// 等待依赖加载完成
async function waitForDependencies() {
    const maxWaitTime = 5000; // 最大等待5秒
    const checkInterval = 100; // 每100ms检查一次
    let waitTime = 0;
    
    while (waitTime < maxWaitTime) {
        // 检查所有必要的依赖是否已加载
        if (
            typeof DataManager !== 'undefined' &&
            typeof window.appState !== 'undefined' &&
            typeof MessageManager !== 'undefined' &&
            typeof ModalManager !== 'undefined' &&
            typeof AuthModule !== 'undefined' &&
            typeof NavigationModule !== 'undefined' &&
            typeof ContestModule !== 'undefined' &&
            typeof ProblemsModule !== 'undefined' &&
            typeof LeaderboardModule !== 'undefined' &&
            typeof RegistrationModule !== 'undefined'
        ) {
            console.log('All dependencies loaded successfully');
            return;
        }
        
        // 等待一段时间后再检查
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waitTime += checkInterval;
    }
    
    // 如果等待超时，抛出错误
    const missingDeps = [];
    if (typeof DataManager === 'undefined') missingDeps.push('DataManager');
    if (typeof window.appState === 'undefined') missingDeps.push('appState');
    if (typeof MessageManager === 'undefined') missingDeps.push('MessageManager');
    if (typeof ModalManager === 'undefined') missingDeps.push('ModalManager');
    if (typeof AuthModule === 'undefined') missingDeps.push('AuthModule');
    if (typeof NavigationModule === 'undefined') missingDeps.push('NavigationModule');
    if (typeof ContestModule === 'undefined') missingDeps.push('ContestModule');
    if (typeof ProblemsModule === 'undefined') missingDeps.push('ProblemsModule');
    if (typeof LeaderboardModule === 'undefined') missingDeps.push('LeaderboardModule');
    if (typeof RegistrationModule === 'undefined') missingDeps.push('RegistrationModule');
    
    throw new Error(`依赖加载超时。缺失的依赖: ${missingDeps.join(', ')}`);
}

// DOM内容加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // 如果DOM已经加载完成，直接初始化
    initializeApp();
}

// 导出应用类（供其他脚本使用）
window.Application = Application;