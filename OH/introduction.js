document.addEventListener('DOMContentLoaded', function() {
    // 生成100个赛题数据
    const allContests = generateContestData();
    let currentPage = 1;
    const itemsPerPage = 20;
    const totalPages = Math.ceil(allContests.length / itemsPerPage);
    
    // 更新题目总数显示
    const totalCountElement = document.querySelector('.total-count');
    if (totalCountElement) {
        totalCountElement.textContent = `共 ${allContests.length} 题`;
    }
    
    // 渲染当前页面的赛题
    function renderContests(page = 1) {
        const startIndex = (page - 1) * itemsPerPage;
        const topicsList = document.getElementById('topicsList');
        if (topicsList) {
            topicsList.innerHTML = generateContestHTML(allContests, startIndex, itemsPerPage);
            
            // 重新绑定点击事件
            bindTopicClickEvents();
        }
        
        // 更新分页信息
        const pageInfo = document.querySelector('.page-info');
        if (pageInfo) {
            pageInfo.textContent = `${page} / ${totalPages}`;
        }
        
        // 更新分页按钮状态
        const prevBtn = document.querySelector('.page-btn.prev');
        const nextBtn = document.querySelector('.page-btn.next');
        if (prevBtn) prevBtn.disabled = page === 1;
        if (nextBtn) nextBtn.disabled = page === totalPages;
    }
    
    // 绑定题目点击事件
    function bindTopicClickEvents() {
        const topicTitles = document.querySelectorAll('.topic-title');
        topicTitles.forEach(title => {
            title.addEventListener('click', function(e) {
                e.stopPropagation();
                showTopicDetail();
            });
        });
    }
    
    // 显示题目详情
    function showTopicDetail() {
        const topicsList = document.getElementById('topicsList');
        const topicsHeader = document.querySelector('.topics-header');
        const topicDetail = document.getElementById('topicDetail');
        
        if (topicsList) topicsList.style.display = 'none';
        if (topicsHeader) topicsHeader.style.display = 'none';
        if (topicDetail) topicDetail.style.display = 'block';
    }
    
    // 初始化渲染
    renderContests(1);

    // 导航切换功能
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });

    // 题目详情显示/隐藏功能
    const topicDetail = document.getElementById('topicDetail');
    const topicsList = document.getElementById('topicsList');
    const topicsHeader = document.querySelector('.topics-header');
    const backBtn = document.getElementById('topicBackBtn');

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            topicDetail.style.display = 'none';
            topicsHeader.style.display = 'flex';
            topicsList.style.display = 'block';
            // 修复返回列表后卡片间距消失的问题
            const topicItems = document.querySelectorAll('.topic-item');
            topicItems.forEach(item => {
                item.style.marginBottom = '20px';
            });
        });
    }

    // 筛选标签切换
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const topicItems = document.querySelectorAll('.topic-item');
            
            topicItems.forEach(item => {
                const title = item.querySelector('.topic-title').textContent.toLowerCase();
                const description = item.querySelector('.topic-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 分页功能
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                if (this.classList.contains('prev') && currentPage > 1) {
                    currentPage--;
                    renderContests(currentPage);
                } else if (this.classList.contains('next') && currentPage < totalPages) {
                    currentPage++;
                    renderContests(currentPage);
                }
            }
        });
    });

    // 筛选下拉框功能
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            console.log('筛选条件:', selectedValue);
            // 这里可以添加筛选逻辑
        });
    }

    // 立即报名按钮功能
    const registerBtn = document.querySelector('.register-btn-new');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            if (!this.classList.contains('registered')) {
                this.textContent = '已报名';
                this.classList.add('registered');
            }
        });
    }
});