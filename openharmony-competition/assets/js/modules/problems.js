/**
 * 赛题相关模块
 * 处理赛题列表、详情查看、筛选、排序、提交等功能
 */

class ProblemsModule {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 2;
        this.currentSort = 'submissions';
        this.sortDirection = 'desc'; // 默认降序
        this.currentFilter = { tag: 'all', search: '' };
        this.currentProblem = null;
        
        this.initEventListeners();
        this.initPagination();
        this.initFilters();
        this.initProblemActions();
        this.initDefaultSort();
    }

    // 初始化事件监听器
    initEventListeners() {
        // 绑定赛题列表项点击
        this.bindProblemItems();
        
        // 绑定返回按钮
        this.bindBackButton();
        
        // 绑定赛题操作按钮
        this.bindProblemActions();
        
        // 绑定提交表单
        this.bindSubmitForm();
    }

    // 绑定赛题列表项
    bindProblemItems() {
        const problemItems = document.querySelectorAll('.problem-item[data-problem-id]');
        problemItems.forEach(item => {
            const problemId = item.getAttribute('data-problem-id');
            if (problemId) {
                item.addEventListener('click', () => this.viewProblem(problemId));
            }
        });
    }

    // 绑定返回按钮
    bindBackButton() {
        const backBtn = document.getElementById('backToProblemListBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToProblemList());
        }
    }

    // 绑定赛题操作按钮
    bindProblemActions() {
        // 查看代码按钮
        const viewCodeBtn = document.getElementById('viewCodeBtn');
        if (viewCodeBtn) {
            viewCodeBtn.addEventListener('click', () => this.viewProblemCode());
        }

        // 启动按钮
        const startBtn = document.getElementById('startProblemBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startProblem());
        }

        // 提交按钮
        const submitBtn = document.getElementById('submitProblemBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitProblem());
        }
    }

    // 绑定提交表单
    bindSubmitForm() {
        const submitForm = document.getElementById('submitForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => this.handleSubmitForm(e));
        }

        // 提交取消按钮
        const submitCancelBtn = document.getElementById('submitCancelBtn');
        if (submitCancelBtn) {
            submitCancelBtn.addEventListener('click', () => {
                if (window.modalManager) {
                    window.modalManager.hide('submitModal');
                }
            });
        }
    }

    // 初始化分页
    initPagination() {
        // 上一页按钮
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changePage(-1));
        }

        // 下一页按钮
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changePage(1));
        }

        this.updatePaginationState();
    }

    // 初始化筛选器
    initFilters() {
        // 排序按钮
        const sortBtns = document.querySelectorAll('.sort-btn[data-sort]');
        sortBtns.forEach(btn => {
            const sortType = btn.getAttribute('data-sort');
            if (sortType) {
                btn.addEventListener('click', () => this.sortProblems(sortType));
            }
        });

        // 标签筛选
        const tagFilter = document.getElementById('tagFilter');
        if (tagFilter) {
            tagFilter.addEventListener('change', (e) => {
                this.currentFilter.tag = e.target.value;
                this.applyFilters();
            });
        }

        // 搜索输入
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // 使用防抖处理搜索
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilter.search = e.target.value;
                    this.applyFilters();
                }, 300);
            });
        }
    }

    // 初始化赛题操作
    initProblemActions() {
        // 检查登录状态并更新UI
        this.updateProblemActionsState();
        
        // 监听登录状态变化
        if (window.appState) {
            window.appState.subscribe('isLoggedInChange', () => {
                this.updateProblemActionsState();
            });
        }
    }

    // 初始化默认排序
    initDefaultSort() {
        // 设置默认选中提交人数降序
        const submissionsBtn = document.querySelector('.sort-btn[data-sort="submissions"]');
        if (submissionsBtn) {
            submissionsBtn.classList.add('active');
            const downArrow = submissionsBtn.querySelector('.down-arrow');
            if (downArrow) {
                downArrow.classList.add('active');
            }
        }
    }

    // 查看赛题详情
    viewProblem(problemId) {
        // 允许未登录用户查看赛题详情
        // 显示题目详情页面
        this.showProblemDetail();
        
        // 加载题目详情内容
        this.loadProblemDetail(problemId);
        this.currentProblem = problemId;
    }

    // 显示赛题详情页面
    showProblemDetail() {
        const sectionTitle = document.querySelector('#tab-problems .section-title');
        const problemsInfoSection = document.querySelector('.problems-info-section');
        const problemList = document.querySelector('.problem-list');
        const pagination = document.querySelector('.pagination');
        const problemDetail = document.getElementById('problemDetail');
        
        if (sectionTitle) sectionTitle.style.display = 'none';
        if (problemsInfoSection) problemsInfoSection.style.display = 'none';
        if (problemList) problemList.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        if (problemDetail) problemDetail.style.display = 'block';
    }

    // 返回赛题列表
    backToProblemList() {
        const sectionTitle = document.querySelector('#tab-problems .section-title');
        const problemsInfoSection = document.querySelector('.problems-info-section');
        const problemList = document.querySelector('.problem-list');
        const pagination = document.querySelector('.pagination');
        const problemDetail = document.getElementById('problemDetail');
        
        if (problemDetail) problemDetail.style.display = 'none';
        if (sectionTitle) sectionTitle.style.display = 'block';
        if (problemsInfoSection) problemsInfoSection.style.display = 'flex';
        if (problemList) problemList.style.display = 'block';
        if (pagination) pagination.style.display = 'flex';
        
        this.currentProblem = null;
    }

    // 加载题目详情内容
    loadProblemDetail(problemId) {
        const problems = this.getProblemData();
        const problem = problems[problemId] || this.getDefaultProblem();
        
        // 更新页面内容
        const titleEl = document.getElementById('problemDetailTitle');
        const tag1El = document.getElementById('problemDetailTag1');
        const tag2El = document.getElementById('problemDetailTag2');
        const contentEl = document.getElementById('problemDetailContent');
        
        if (titleEl) titleEl.textContent = problem.title;
        if (tag1El) tag1El.textContent = problem.tags[0];
        if (tag2El) tag2El.textContent = problem.tags[1];
        if (contentEl) contentEl.innerHTML = problem.content;
    }

    // 获取赛题数据
    getProblemData() {
        return {
            'problem-001': {
                title: '内核缓冲区溢出检测',
                tags: ['内核安全', '困难'],
                content: `
                    <h3>题目描述</h3>
                    <p>设计Fuzz测试用例，检测OpenHarmony内核中的缓冲区溢出漏洞，重点关注内存管理和系统调用边界。</p>
                    
                    <h3>技术要求</h3>
                    <ul>
                        <li>深入理解OpenHarmony内核架构</li>
                        <li>熟悉缓冲区溢出漏洞原理</li>
                        <li>掌握Fuzz测试工具和方法</li>
                        <li>具备内核调试和分析能力</li>
                    </ul>
                    
                    <h3>测试目标</h3>
                    <ol>
                        <li>系统调用参数验证</li>
                        <li>内核内存分配边界</li>
                        <li>驱动程序接口安全</li>
                        <li>内核模块间通信</li>
                    </ol>
                    
                    <h3>提交要求</h3>
                    <p>提交包含测试用例代码、执行结果报告和漏洞分析文档的完整包。</p>
                    
                    <h3>评分标准</h3>
                    <ul>
                        <li>测试用例覆盖度 (30%)</li>
                        <li>发现漏洞数量 (40%)</li>
                        <li>漏洞严重程度 (20%)</li>
                        <li>文档质量 (10%)</li>
                    </ul>
                `
            },
            'problem-002': {
                title: '应用权限提升测试',
                tags: ['应用安全', '中等'],
                content: `
                    <h3>题目描述</h3>
                    <p>构建测试用例，发现应用层权限管理漏洞，包括权限绕过和非法权限获取等安全问题。</p>
                    
                    <h3>技术要求</h3>
                    <ul>
                        <li>理解OpenHarmony权限管理机制</li>
                        <li>熟悉应用安全模型</li>
                        <li>掌握权限提升攻击方法</li>
                        <li>具备应用逆向分析能力</li>
                    </ul>
                    
                    <h3>测试范围</h3>
                    <ol>
                        <li>应用权限声明和验证</li>
                        <li>跨应用权限传递</li>
                        <li>系统权限获取路径</li>
                        <li>权限缓存和状态管理</li>
                    </ol>
                `
            }
        };
    }

    // 获取默认赛题信息
    getDefaultProblem() {
        return {
            title: '题目详情',
            tags: ['未知', '未知'],
            content: '<p>题目详情正在加载中...</p>'
        };
    }

    // 查看题目代码
    viewProblemCode() {
        if (!this.checkLoginAndRegistration()) return;
        
        if (window.messageManager) {
            window.messageManager.show('正在跳转至GitCode仓库...', 'info');
        }
        
        // 跳转到OpenHarmony GitCode仓库
        window.open('https://gitcode.com/openharmony/community/issues', '_blank');
    }

    // 启动题目
    startProblem() {
        if (!this.checkLoginAndRegistration()) return;
        
        if (window.messageManager) {
            window.messageManager.show('正在跳转至沙箱环境...', 'info');
        }
        
        // 模拟跳转到沙箱环境
        setTimeout(() => {
            if (window.messageManager) {
                window.messageManager.show('沙箱环境已准备就绪！', 'success');
            }
        }, 2000);
    }

    // 提交题目
    submitProblem() {
        if (!this.checkLoginAndRegistration()) return;
        
        // 显示提交弹窗
        this.showSubmitModal();
    }

    // 显示提交弹窗
    showSubmitModal() {
        // 获取当前题目标题
        const currentProblemTitle = document.getElementById('problemDetailTitle')?.textContent || '题目';
        const submitProblemTitle = document.getElementById('submitProblemTitle');
        if (submitProblemTitle) {
            submitProblemTitle.textContent = currentProblemTitle;
        }
        
        if (window.modalManager) {
            window.modalManager.show('submitModal');
        }
    }

    // 处理提交表单
    handleSubmitForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const description = formData.get('description');
        const repoUrl = formData.get('repoUrl');
        
        // 验证必填字段
        if (!description || description.trim() === '') {
            if (window.messageManager) {
                window.messageManager.show('请填写解答说明', 'error');
            }
            return;
        }
        
        if (!repoUrl || repoUrl.trim() === '') {
            if (window.messageManager) {
                window.messageManager.show('请填写GitCode仓库链接', 'error');
            }
            return;
        }
        
        // 验证URL格式
        if (!this.validateGitCodeUrl(repoUrl)) {
            return;
        }
        
        // 提交解答
        this.submitSolution({
            problemId: this.currentProblem,
            description: description.trim(),
            repoUrl: repoUrl.trim()
        });
    }

    // 验证GitCode URL
    validateGitCodeUrl(url) {
        try {
            const urlObj = new URL(url);
            if (!url.includes('gitcode.com')) {
                if (window.messageManager) {
                    window.messageManager.show('请提供有效的GitCode仓库链接', 'error');
                }
                return false;
            }
            return true;
        } catch (e) {
            if (window.messageManager) {
                window.messageManager.show('请提供有效的仓库链接', 'error');
            }
            return false;
        }
    }

    // 提交解答
    submitSolution(solutionData) {
        const submitBtn = document.querySelector('#submitForm button[type="submit"]');
        if (submitBtn) {
            this.setButtonLoading(submitBtn, '提交中...');
        }
        
        // 模拟提交过程
        setTimeout(() => {
            // 恢复按钮状态
            if (submitBtn) {
                this.restoreButtonState(submitBtn, '提交解答');
            }
            
            // 隐藏弹窗
            if (window.modalManager) {
                window.modalManager.hide('submitModal');
            }
            
            // 重置表单
            const form = document.getElementById('submitForm');
            if (form) {
                form.reset();
            }
            
            if (window.messageManager) {
                window.messageManager.show('解答提交成功！评测结果将在24小时内公布', 'success');
            }
            
            // 添加到提交记录
            if (window.appState) {
                window.appState.addSubmission({
                    problemTitle: solutionData.problemId,
                    description: solutionData.description,
                    repoUrl: solutionData.repoUrl
                });
            }
            
        }, 2000);
    }

    // 分页功能
    changePage(direction) {
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= this.totalPages) {
            this.currentPage = newPage;
            this.updatePaginationState();
            this.loadProblemsPage(newPage);
            
            if (window.messageManager) {
                window.messageManager.show(`已切换到第${newPage}页`, 'info');
            }
        }
    }

    // 更新分页状态
    updatePaginationState() {
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = this.totalPages;
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === this.totalPages;
    }

    // 加载赛题页面
    loadProblemsPage(page) {
        // 这里可以添加实际的分页加载逻辑
        console.log(`Loading problems page: ${page}`);
    }

    // 题目排序
    sortProblems(sortType) {
        const sortBtns = document.querySelectorAll('.sort-btn');
        
        // 重置所有按钮状态
        sortBtns.forEach(btn => {
            btn.classList.remove('active');
            const arrows = btn.querySelectorAll('.up-arrow, .down-arrow');
            arrows.forEach(arrow => arrow.classList.remove('active'));
        });
        
        // 检查是否是同一排序类型的切换（升序/降序）
        if (this.currentSort === sortType) {
            // 切换排序方向
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // 新的排序类型，默认降序（大到小）
            this.sortDirection = 'desc';
            this.currentSort = sortType;
        }
        
        // 激活当前排序按钮并添加排序指示器
        const activeBtn = Array.from(sortBtns).find(btn => {
            return btn.getAttribute('data-sort') === sortType;
        });
        
        if (activeBtn) {
            activeBtn.classList.add('active');
            
            // 激活对应的箭头
            const upArrow = activeBtn.querySelector('.up-arrow');
            const downArrow = activeBtn.querySelector('.down-arrow');
            
            if (this.sortDirection === 'asc' && upArrow) {
                upArrow.classList.add('active');
            } else if (this.sortDirection === 'desc' && downArrow) {
                downArrow.classList.add('active');
            }
        }
        
        if (window.messageManager) {
            const sortName = sortType === 'submissions' ? '提交人数' : '通过人数';
            const directionName = this.sortDirection === 'asc' ? '升序' : '降序';
            window.messageManager.show(`按${sortName}${directionName}排序`, 'info');
        }
        
        // 应用排序逻辑
        this.applySorting(sortType, this.sortDirection);
    }

    // 应用排序
    applySorting(sortType, direction) {
        // 实现排序逻辑
        console.log(`Sorting problems by: ${sortType}, direction: ${direction}`);
    }

    // 应用筛选
    applyFilters() {
        console.log('Applying filters:', this.currentFilter);
        // 这里可以添加实际的筛选逻辑
        this.updateProblemCount();
    }

    // 更新题目数量显示
    updateProblemCount() {
        const problemCountEl = document.getElementById('problemCount');
        if (problemCountEl) {
            // 根据筛选条件更新显示的题目数量
            // problemCountEl.textContent = `共 ${filteredCount} 题`;
        }
    }

    // 检查登录状态用于访问赛题
    checkLoginForProblemAccess() {
        if (window.appState && !window.appState.getState('isLoggedIn')) {
            return false;
        }
        return true;
    }

    // 检查登录和报名状态
    checkLoginAndRegistration() {
        if (window.appState) {
            const isLoggedIn = window.appState.getState('isLoggedIn');
            const isRegistered = window.appState.getState('isRegistered');
            
            if (!isLoggedIn) {
                if (window.messageManager) {
                    window.messageManager.show('请先登录后操作', 'warning');
                }
                // 不自动跳转，让用户主动点击登录
                return false;
            }
            
            if (!isRegistered) {
                if (window.messageManager) {
                    window.messageManager.show('请先报名后操作', 'warning');
                }
                return false;
            }
        }
        return true;
    }

    // 更新赛题操作状态
    updateProblemActionsState() {
        const viewCodeBtn = document.getElementById('viewCodeBtn');
        const startBtn = document.getElementById('startProblemBtn');
        const submitBtn = document.getElementById('submitProblemBtn');
        
        // 检查登录状态但不触发跳转
        const isLoggedIn = window.appState ? window.appState.getState('isLoggedIn') : false;
        const isRegistered = window.appState ? window.appState.getState('isRegistered') : false;
        const canAccess = isLoggedIn && isRegistered;
        
        [viewCodeBtn, startBtn, submitBtn].forEach(btn => {
            if (btn) {
                btn.disabled = !canAccess;
                btn.style.opacity = canAccess ? '1' : '0.6';
            }
        });
    }

    // 设置按钮加载状态
    setButtonLoading(button, loadingText) {
        if (!button) return;
        
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = loadingText;
        button.disabled = true;
    }

    // 恢复按钮状态
    restoreButtonState(button, defaultText) {
        if (!button) return;
        
        const originalText = button.getAttribute('data-original-text') || defaultText;
        button.textContent = originalText;
        button.removeAttribute('data-original-text');
        button.disabled = false;
    }

    // 获取当前筛选状态
    getCurrentFilter() {
        return { ...this.currentFilter };
    }

    // 获取当前排序状态
    getCurrentSort() {
        return this.currentSort;
    }

    // 获取当前页码
    getCurrentPage() {
        return this.currentPage;
    }
}

// 导出模块
window.ProblemsModule = ProblemsModule;