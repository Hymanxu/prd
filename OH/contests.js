// 赛题展示页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const filterTags = document.querySelectorAll('.filter-tag');
    const filterSelect = document.querySelector('.filter-select');
    const searchInput = document.querySelector('.search-input');
    const contestItems = document.querySelectorAll('.contest-item');
    const totalCount = document.querySelector('.total-count');
    const pageButtons = document.querySelectorAll('.page-btn');
    const pageInfo = document.querySelector('.page-info');

    // 筛选标签点击事件
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 移除其他标签的active状态
            filterTags.forEach(t => t.classList.remove('active'));
            // 添加当前标签的active状态
            this.classList.add('active');
            
            // 根据标签内容进行排序
            const sortType = this.textContent.trim();
            sortContests(sortType);
        });
    });

    // 下拉筛选器变化事件
    filterSelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        filterByCategory(selectedCategory);
    });

    // 搜索输入事件
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchContests(searchTerm);
    });

    // 分页按钮点击事件
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('prev')) {
                // 上一页逻辑
                console.log('上一页');
            } else if (this.classList.contains('next')) {
                // 下一页逻辑
                console.log('下一页');
            }
        });
    });

    // 赛题标题点击事件
    const contestTitles = document.querySelectorAll('.contest-title');
    const contestDetail = document.getElementById('contestDetail');
    const contestsList = document.getElementById('contestsList');
    const backBtn = document.getElementById('backBtn');
    
    contestTitles.forEach(title => {
        title.addEventListener('click', function() {
            // 显示赛题详情，隐藏赛题列表
            showContestDetail();
        });
    });

    // 返回按钮点击事件
    backBtn.addEventListener('click', function() {
        // 隐藏赛题详情，显示赛题列表
        hideContestDetail();
    });

    // 显示赛题详情
    function showContestDetail() {
        contestsList.style.display = 'none';
        contestDetail.style.display = 'block';
        
        // 隐藏筛选区域和分页
        document.querySelector('.contests-header').style.display = 'none';
        document.querySelector('.pagination').style.display = 'none';
    }

    // 隐藏赛题详情
    function hideContestDetail() {
        contestDetail.style.display = 'none';
        contestsList.style.display = 'flex';
        
        // 显示筛选区域和分页
        document.querySelector('.contests-header').style.display = 'flex';
        document.querySelector('.pagination').style.display = 'flex';
    }

    // 排序功能
    function sortContests(sortType) {
        const contestsContainer = document.querySelector('.contests-list');
        const items = Array.from(contestItems);
        
        items.sort((a, b) => {
            if (sortType.includes('提交人数')) {
                const aSubmit = parseInt(a.querySelector('.stat-value').textContent);
                const bSubmit = parseInt(b.querySelector('.stat-value').textContent);
                return sortType.includes('↓') ? bSubmit - aSubmit : aSubmit - bSubmit;
            } else if (sortType.includes('通过人数')) {
                const aPass = parseInt(a.querySelectorAll('.stat-value')[1].textContent);
                const bPass = parseInt(b.querySelectorAll('.stat-value')[1].textContent);
                return sortType.includes('↓') ? bPass - aPass : aPass - bPass;
            }
            return 0;
        });

        // 重新排列DOM元素
        items.forEach(item => contestsContainer.appendChild(item));
    }

    // 按类别筛选
    function filterByCategory(category) {
        contestItems.forEach(item => {
            const title = item.querySelector('.contest-title').textContent;
            const description = item.querySelector('.contest-description').textContent;
            
            if (category === '全部标签') {
                item.style.display = 'flex';
            } else {
                const isMatch = title.includes(getCategoryKeyword(category)) || 
                               description.includes(getCategoryKeyword(category));
                item.style.display = isMatch ? 'flex' : 'none';
            }
        });
        
        updateTotalCount();
    }

    // 搜索功能
    function searchContests(searchTerm) {
        let visibleCount = 0;
        
        contestItems.forEach(item => {
            const title = item.querySelector('.contest-title').textContent.toLowerCase();
            const description = item.querySelector('.contest-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        updateTotalCount(visibleCount);
    }

    // 获取类别关键词
    function getCategoryKeyword(category) {
        const keywords = {
            '内核安全': '内核',
            '应用安全': '应用',
            '网络安全': '网络',
            '系统服务': '系统'
        };
        return keywords[category] || category;
    }

    // 更新总数显示
    function updateTotalCount(count) {
        if (count !== undefined) {
            totalCount.textContent = `共 ${count} 题`;
        } else {
            const visibleItems = Array.from(contestItems).filter(item => 
                item.style.display !== 'none'
            );
            totalCount.textContent = `共 ${visibleItems.length} 题`;
        }
    }

    // 初始化页面
    function init() {
        // 设置初始排序
        sortContests('提交人数 ↓');
    }

    // 页面加载完成后初始化
    init();
});