/**
 * 竞赛功能模块
 * 处理报名、取消报名、竞赛状态管理等功能
 */

class ContestModule {
    constructor() {
        this.initEventListeners();
        this.updateUI();
    }

    // 初始化事件监听器
    initEventListeners() {
        // 报名按钮
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.handleRegister());
        }

        // 取消报名按钮
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancelRegister());
        }

        // 监听应用状态变化
        if (window.appState) {
            window.appState.subscribe('isLoggedInChange', () => this.updateUI());
            window.appState.subscribe('isRegisteredChange', () => this.updateUI());
        }
    }

    // 处理报名
    handleRegister() {
        // 检查登录状态
        if (!this.isLoggedIn()) {
            // 未登录，跳转到登录页面
            window.location.href = 'login.html';
            return;
        }

        const appState = window.appState;
        if (appState && appState.getState('isRegistered')) {
            if (window.messageManager) {
                window.messageManager.show('您已成功报名！', 'info');
            }
            return;
        }

        // 显示加载状态
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            this.setButtonLoading(registerBtn, '报名中...');
        }

        // 模拟报名过程
        setTimeout(() => {
            if (appState) {
                appState.register();
            }
            
            this.updateUI();
            
            if (window.messageManager) {
                window.messageManager.show('报名成功！', 'success');
            }
            
            // 恢复按钮状态
            if (registerBtn) {
                this.restoreButtonState(registerBtn);
            }
        }, 2000);
    }

    // 处理取消报名
    handleCancelRegister() {
        if (confirm('确定要取消报名吗？取消后需要重新报名才能参赛。')) {
            if (window.appState) {
                window.appState.cancelRegister();
            }
            
            this.updateUI();
            
            if (window.messageManager) {
                window.messageManager.show('已取消报名', 'info');
            }
        }
    }

    // 检查登录状态（仅用于内部判断，不会跳转）
    isLoggedIn() {
        const appState = window.appState;
        return appState && appState.getState('isLoggedIn');
    }

    // 更新UI状态
    updateUI() {
        this.updateRegisterUI();
        this.updateContestStats();
    }

    // 更新报名UI
    updateRegisterUI() {
        const appState = window.appState;
        if (!appState) return;

        const registerBtn = document.getElementById('registerBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const viewProblemsBtn = document.getElementById('viewProblemsBtn');
        const agreementText = document.querySelector('.agreement-text');

        const isRegistered = appState.getState('isRegistered');

        if (registerBtn) {
            if (isRegistered) {
                registerBtn.textContent = '已报名';
                registerBtn.disabled = true;
                registerBtn.style.background = '#00A870';
                registerBtn.style.cursor = 'not-allowed';
            } else {
                registerBtn.textContent = '立即报名';
                registerBtn.disabled = false;
                registerBtn.style.background = '#0052D9';
                registerBtn.style.cursor = 'pointer';
            }
        }

        // 控制其他元素显示
        if (agreementText) {
            agreementText.style.display = isRegistered ? 'none' : 'inline';
        }

        if (cancelBtn) {
            cancelBtn.style.display = 'none'; // 暂时隐藏取消报名按钮
        }

        if (viewProblemsBtn) {
            viewProblemsBtn.style.display = isRegistered ? 'inline-block' : 'none';
        }
    }

    // 更新竞赛统计数据
    updateContestStats() {
        // 这里可以添加实时更新竞赛统计数据的逻辑
        // 比如参赛人数、提交次数等
        this.updateParticipantCount();
        this.updateSubmissionCount();
    }

    // 更新参赛人数
    updateParticipantCount() {
        const participantElement = document.querySelector('.stat-item .stat-number');
        if (participantElement && participantElement.textContent === '156') {
            // 可以从API获取最新数据
            // 这里暂时保持静态数据
        }
    }

    // 更新提交次数
    updateSubmissionCount() {
        const submissionElements = document.querySelectorAll('.stat-item .stat-number');
        if (submissionElements.length >= 4) {
            // 更新提交次数（第4个统计项）
            // submissionElements[3].textContent = newSubmissionCount;
        }
    }

    // 设置按钮加载状态
    setButtonLoading(button, loadingText) {
        if (!button) return;
        
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = loadingText;
        button.disabled = true;
        button.style.cursor = 'not-allowed';
    }

    // 恢复按钮状态
    restoreButtonState(button) {
        if (!button) return;
        
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
            button.removeAttribute('data-original-text');
        }
        button.disabled = false;
        button.style.cursor = 'pointer';
    }

    // 获取竞赛信息
    getContestInfo() {
        return {
            title: 'OpenHarmony社区创新奖励计划 10月赛',
            subtitle: 'OpenHarmony Fuzzing 挑战赛',
            status: '进行中',
            timeline: '10.1 - 10.31',
            problemCount: 8,
            participantCount: 156,
            submissionCount: 342
        };
    }

    // 获取竞赛时间线
    getContestTimeline() {
        return {
            registration: {
                start: '2024-10-01',
                end: '2024-10-07',
                title: '报名阶段'
            },
            development: {
                start: '2024-10-08',
                end: '2024-10-25',
                title: '开发阶段'
            },
            submission: {
                start: '2024-10-26',
                end: '2024-10-31',
                title: '提交阶段'
            },
            review: {
                start: '2024-11-01',
                end: '2024-11-07',
                title: '评审阶段'
            },
            award: {
                start: '2024-11-08',
                end: '2024-11-15',
                title: '颁奖阶段'
            }
        };
    }

    // 检查当前竞赛阶段
    getCurrentPhase() {
        const now = new Date();
        const timeline = this.getContestTimeline();
        
        for (const [phase, info] of Object.entries(timeline)) {
            const start = new Date(info.start);
            const end = new Date(info.end);
            
            if (now >= start && now <= end) {
                return {
                    phase,
                    title: info.title,
                    start: info.start,
                    end: info.end
                };
            }
        }
        
        return null;
    }

    // 检查是否可以报名
    canRegister() {
        const currentPhase = this.getCurrentPhase();
        return currentPhase && currentPhase.phase === 'registration';
    }

    // 检查是否可以提交
    canSubmit() {
        const currentPhase = this.getCurrentPhase();
        return currentPhase && ['development', 'submission'].includes(currentPhase.phase);
    }

    // 获取竞赛规则
    getContestRules() {
        return {
            eligibility: [
                '拥有有效的GitCode账号',
                '熟悉OpenHarmony系统架构',
                '具备相关技术领域基础知识',
                '遵守开源社区行为准则'
            ],
            scoring: {
                innovation: { weight: 30, description: '技术创新度' },
                quality: { weight: 25, description: '实现质量' },
                completeness: { weight: 25, description: '功能完成度' },
                performance: { weight: 20, description: '性能表现' }
            },
            rewards: {
                champion: '15,000元 + 荣誉证书',
                runnerUp: '10,000元 + 荣誉证书',
                thirdPlace: '8,000元 + 荣誉证书',
                excellence: '5名，每人3,000元',
                participation: '所有完成提交者获得社区积分'
            }
        };
    }

    // 注册状态变化监听器
    onRegistrationChange(callback) {
        if (window.appState) {
            window.appState.subscribe('isRegisteredChange', callback);
        }
    }

    // 取消注册状态变化监听器
    offRegistrationChange(callback) {
        if (window.appState) {
            window.appState.unsubscribe('isRegisteredChange', callback);
        }
    }

    // 初始化竞赛倒计时
    initCountdown() {
        const currentPhase = this.getCurrentPhase();
        if (!currentPhase) return;

        const endDate = new Date(currentPhase.end);
        const countdownElement = document.querySelector('.countdown');
        
        if (countdownElement) {
            this.updateCountdown(countdownElement, endDate);
            
            // 每秒更新倒计时
            setInterval(() => {
                this.updateCountdown(countdownElement, endDate);
            }, 1000);
        }
    }

    // 更新倒计时显示
    updateCountdown(element, targetDate) {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            element.textContent = '已结束';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        element.textContent = `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// 导出模块
window.ContestModule = ContestModule;