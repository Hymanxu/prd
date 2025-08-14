/**
 * 导航模块
 * 处理Tab切换、页面导航等功能
 */

class NavigationModule {
    constructor() {
        this.currentTab = 'intro';
        this.initTabNavigation();
        this.initLeaderboardTabs();
        this.initFAQ();
        this.bindScrollToProblems();
        this.bindPastContestItems();
    }

    // 初始化Tab导航
    initTabNavigation() {
        const tabItems = document.querySelectorAll('.tab-item');
        tabItems.forEach(tab => {
            // 使用data-tab属性获取tab名称
            const tabName = tab.getAttribute('data-tab');
            if (tabName) {
                tab.addEventListener('click', () => this.switchTab(tabName));
            }
        });

        // 设置初始状态
        this.updateTabState();
    }

    // 初始化排行榜标签
    initLeaderboardTabs() {
        const leaderboardTabs = document.querySelectorAll('.leaderboard-tab');
        leaderboardTabs.forEach(tab => {
            // 使用data-leaderboard属性获取类型
            const type = tab.getAttribute('data-leaderboard');
            if (type) {
                tab.addEventListener('click', () => this.switchLeaderboard(type));
            }
        });
    }

    // 初始化FAQ功能
    initFAQ() {
        // FAQ默认展开，无需JavaScript处理
        // 所有FAQ项通过CSS默认显示
    }

    // 绑定滚动到赛题功能
    bindScrollToProblems() {
        const viewProblemsBtn = document.getElementById('viewProblemsBtn');
        if (viewProblemsBtn) {
            viewProblemsBtn.addEventListener('click', () => this.scrollToProblems());
        }
    }

    // 绑定往期赛事项目点击
    bindPastContestItems() {
        const pastItems = document.querySelectorAll('.past-contest-item[data-contest]');
        pastItems.forEach(item => {
            const contestId = item.getAttribute('data-contest');
            if (contestId) {
                item.addEventListener('click', () => this.loadPastContest(contestId));
            }
        });

        // 往期赛事更多按钮
        const pastContestsBtn = document.getElementById('pastContestsBtn');
        if (pastContestsBtn) {
            pastContestsBtn.addEventListener('click', () => {
                if (window.modalManager) {
                    window.modalManager.show('pastContestModal');
                }
            });
        }

        // 协议链接
        const agreementLink = document.getElementById('agreementLink');
        if (agreementLink) {
            agreementLink.addEventListener('click', () => {
                if (window.modalManager) {
                    window.modalManager.show('agreementModal');
                }
            });
        }
    }

    // Tab切换
    switchTab(tabName) {
        // 更新Tab按钮状态
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 查找并激活当前tab
        const currentTabBtn = Array.from(document.querySelectorAll('.tab-item')).find(btn => {
            return btn.textContent.includes(this.getTabTitle(tabName));
        });
        if (currentTabBtn) {
            currentTabBtn.classList.add('active');
        }

        // 更新Tab内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // 更新当前tab状态
        this.currentTab = tabName;

        // 更新应用状态
        if (window.appState) {
            window.appState.switchTab(tabName);
        }

        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('navigation:tabSwitch', {
            detail: { tabName, previousTab: this.currentTab }
        }));
    }

    // 获取Tab标题
    getTabTitle(tabName) {
        const titles = {
            'intro': '赛事介绍',
            'problems': '赛题',
            'leaderboard': '排行榜',
            'announcements': '通知公告',
            'faq': '常见问题'
        };
        return titles[tabName] || tabName;
    }

    // 更新Tab状态
    updateTabState() {
        if (window.appState) {
            const savedTab = window.appState.getState('currentTab');
            if (savedTab && savedTab !== this.currentTab) {
                this.switchTab(savedTab);
            }
        }
    }

    // 显示FAQ
    showFaq(id) {
        const answer = document.getElementById(`faq-answer-${id}`);
        const icon = document.getElementById(`faq-icon-${id}`);

        if (!answer || !icon) return;

        // 始终保持展开状态
        answer.classList.add('show');
        icon.classList.add('rotate');
        
        // 添加内联样式确保显示
        answer.style.display = 'block';
    }
    
    // FAQ切换（保留但不再使用）
    toggleFaq(id) {
        // 直接调用显示方法，确保始终展开
        this.showFaq(id);
    }

    // 排行榜切换
    switchLeaderboard(type) {
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 找到并激活当前tab
        const currentTab = Array.from(document.querySelectorAll('.leaderboard-tab')).find(tab => {
            return (type === 'current' && tab.textContent.includes('当月')) ||
                   (type === 'total' && tab.textContent.includes('总排行榜'));
        });
        
        if (currentTab) {
            currentTab.classList.add('active');
        }

        // 这里可以添加数据加载逻辑
        console.log(`Switching to ${type} leaderboard`);
    }

    // 滚动到赛题区域
    scrollToProblems() {
        // 先切换到赛题tab
        this.switchTab('problems');
        
        // 滚动到赛题区域
        setTimeout(() => {
            const problemsTab = document.getElementById('tab-problems');
            if (problemsTab) {
                const tabNav = document.querySelector('.tab-nav');
                const offsetTop = tabNav ? tabNav.offsetHeight : 0;
                
                window.scrollTo({
                    top: problemsTab.offsetTop - offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    // 加载往期赛事
    loadPastContest(contestId) {
        console.log('Loading past contest:', contestId);
        
        if (window.modalManager) {
            window.modalManager.hide('pastContestModal');
        }
        
        // 这里可以添加加载往期赛事详情的逻辑
        if (window.messageManager) {
            window.messageManager.show('正在加载往期赛事详情...', 'info');
        }
        
        // 模拟加载过程
        setTimeout(() => {
            if (window.messageManager) {
                window.messageManager.show(`已加载 ${contestId} 赛事信息`, 'success');
            }
        }, 1500);
    }

    // 获取当前Tab
    getCurrentTab() {
        return this.currentTab;
    }

    // 程序化切换到指定Tab
    navigateTo(tabName) {
        if (this.isValidTab(tabName)) {
            this.switchTab(tabName);
        } else {
            console.warn(`Invalid tab name: ${tabName}`);
        }
    }

    // 验证Tab名称是否有效
    isValidTab(tabName) {
        const validTabs = ['intro', 'problems', 'leaderboard', 'announcements', 'faq'];
        return validTabs.includes(tabName);
    }

    // 添加Tab切换监听器
    onTabSwitch(callback) {
        document.addEventListener('navigation:tabSwitch', callback);
    }

    // 移除Tab切换监听器
    offTabSwitch(callback) {
        document.removeEventListener('navigation:tabSwitch', callback);
    }

    // 获取所有可用的Tab
    getAvailableTabs() {
        return ['intro', 'problems', 'leaderboard', 'announcements', 'faq'];
    }

    // 检查Tab内容是否需要特殊处理
    handleTabSpecialContent(tabName) {
        switch (tabName) {
            case 'leaderboard':
                // 可以在这里加载排行榜数据
                this.loadLeaderboardData();
                break;
            default:
                break;
        }
    }

    // 加载排行榜数据
    loadLeaderboardData() {
        // 这里可以添加排行榜数据加载逻辑
        console.log('Loading leaderboard data...');
    }
}

// 导出模块
window.NavigationModule = NavigationModule;