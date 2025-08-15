document.addEventListener('DOMContentLoaded', function() {
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
    const topicTitles = document.querySelectorAll('.topic-title');
    const topicDetail = document.getElementById('topicDetail');
    const topicsList = document.getElementById('topicsList');
    const topicsHeader = document.querySelector('.topics-header');
    const backBtn = document.getElementById('topicBackBtn');

    topicTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            e.stopPropagation();
            topicsList.style.display = 'none';
            topicsHeader.style.display = 'none';
            topicDetail.style.display = 'block';
        });
    });

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            topicDetail.style.display = 'none';
            topicsHeader.style.display = 'flex';
            topicsList.style.display = 'block';
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
                // 这里可以添加分页逻辑
                console.log('分页按钮点击:', this.classList.contains('prev') ? '上一页' : '下一页');
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