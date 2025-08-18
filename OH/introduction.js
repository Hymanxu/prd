document.addEventListener('DOMContentLoaded', function() {
    // 生成数据
    const allContests = generateContestData();

    // 状态
    const itemsPerPage = 20;
    let currentPage = 1;
    let sortKey = 'submissions'; // 'submissions' | 'difficulty'
    let sortOrder = 'desc'; // 'asc' | 'desc'
    let filterCategory = '全部标签';
    let searchTerm = '';

    const difficultyRank = { '简单': 1, '中等': 2, '困难': 3 };

    // 更新题目总数显示（保持展示全部题数）
    const totalCountElement = document.querySelector('.total-count');
    if (totalCountElement) {
        totalCountElement.textContent = `共 ${allContests.length} 题`;
    }

    // DOM 引用（仅限赛事题目 tab）
    const topicsContent = document.getElementById('topics-content');
    const topicsHeader = document.querySelector('.topics-header');
    const topicsList = document.getElementById('topicsList');
    const pagination = topicsContent ? topicsContent.querySelector('.pagination') : null;

    // 排序/筛选/搜索后得到工作集
    function getWorkingList() {
        let arr = allContests.filter(c => {
            const okCat = (filterCategory === '全部标签') || (c.category === filterCategory);
            const text = (c.title + ' ' + c.description).toLowerCase();
            const okSearch = searchTerm ? text.includes(searchTerm) : true;
            return okCat && okSearch;
        });

        arr.sort((a, b) => {
            if (sortKey === 'submissions') {
                return sortOrder === 'asc' ? a.submissions - b.submissions : b.submissions - a.submissions;
            } else {
                const da = difficultyRank[a.difficulty] || 0;
                const db = difficultyRank[b.difficulty] || 0;
                return sortOrder === 'asc' ? da - db : db - da;
            }
        });

        return arr;
    }

    // 更新排序标签 UI（文本与箭头、active）
    function updateSortTagsUI() {
        if (!topicsHeader) return;
        const tags = topicsHeader.querySelectorAll('.filter-tag');
        if (tags[1]) tags[1].textContent = '难易度';

        if (tags[0]) {
            tags[0].textContent = '提交人数' + (sortKey === 'submissions' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '');
        }
        if (tags[1]) {
            tags[1].textContent = '难易度' + (sortKey === 'difficulty' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '');
        }

        tags.forEach(t => t.classList.remove('active'));
        if (sortKey === 'submissions' && tags[0]) tags[0].classList.add('active');
        if (sortKey === 'difficulty' && tags[1]) tags[1].classList.add('active');
    }

    // 渲染
    function render(page = 1) {
        const working = getWorkingList();
        const totalPages = Math.max(1, Math.ceil(working.length / itemsPerPage));

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        currentPage = page;

        if (topicsList) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            topicsList.innerHTML = generateContestHTML(working, startIndex, itemsPerPage);
            // 重新绑定点击事件
            bindTopicClickEvents();
            // 恢复为样式表的 display（flex + gap）
            topicsList.style.display = '';
        }

        // 分页信息与按钮状态
        const pageInfo = topicsContent ? topicsContent.querySelector('.page-info') : null;
        if (pageInfo) pageInfo.textContent = `${currentPage} / ${totalPages}`;

        const prevBtn = topicsContent ? topicsContent.querySelector('.page-btn.prev') : null;
        const nextBtn = topicsContent ? topicsContent.querySelector('.page-btn.next') : null;
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;
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

    // 显示题目详情（隐藏列表、头部与分页）
    function showTopicDetail() {
        const topicDetail = document.getElementById('topicDetail');
        if (topicsList) topicsList.style.display = 'none';
        if (topicsHeader) topicsHeader.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
        if (topicDetail) topicDetail.style.display = 'block';
    }

    // 初始化渲染
    updateSortTagsUI();
    render(1);

    // 左侧导航切换（保持原逻辑）
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });

    // 详情返回
    const backBtn = document.getElementById('topicBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const topicDetail = document.getElementById('topicDetail');
            if (topicDetail) topicDetail.style.display = 'none';
            if (topicsHeader) topicsHeader.style.display = '';
            if (topicsList) topicsList.style.display = '';
            if (pagination) pagination.style.display = '';
        });
    }

    // 筛选标签点击（提交人数、难易度）
    if (topicsHeader) {
        const tags = topicsHeader.querySelectorAll('.filter-tag');
        // 确保第二个标签文案
        if (tags[1]) tags[1].textContent = '难易度';
        tags.forEach((tag, idx) => {
            tag.addEventListener('click', function() {
                if (idx === 0) {
                    // 提交人数
                    if (sortKey === 'submissions') {
                        sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
                    } else {
                        sortKey = 'submissions';
                        sortOrder = 'desc';
                    }
                } else if (idx === 1) {
                    // 难易度
                    if (sortKey === 'difficulty') {
                        sortOrder = (sortOrder === 'asc') ? 'desc' : 'asc';
                    } else {
                        sortKey = 'difficulty';
                        sortOrder = 'asc';
                    }
                }
                updateSortTagsUI();
                render(1);
            });
        });
    }

    // 搜索
    const searchInput = document.querySelector('.topics-header .search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.trim().toLowerCase();
            render(1);
        });
    }

    // 下拉筛选
    const filterSelect = document.querySelector('.topics-header .filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterCategory = this.value;
            render(1);
        });
    }

    // 分页按钮
    if (topicsContent) {
        const pageButtons = topicsContent.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.disabled) return;
                if (this.classList.contains('prev')) {
                    render(currentPage - 1);
                } else if (this.classList.contains('next')) {
                    render(currentPage + 1);
                }
            });
        });
    }

    // 立即报名按钮（保持原逻辑）
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