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
        const contestsList = document.getElementById('contestsList');
        if (contestsList) {
            contestsList.innerHTML = generateContestHTMLForContests(allContests, startIndex, itemsPerPage);
            
            // 重新绑定点击事件
            bindContestClickEvents();
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
    
    // 绑定赛题点击事件
    function bindContestClickEvents() {
        const contestTitles = document.querySelectorAll('.contest-title');
        contestTitles.forEach(title => {
            title.addEventListener('click', function(e) {
                e.stopPropagation();
                showContestDetail();
            });
        });
    }
    
    // 显示赛题详情
    function showContestDetail() {
        const contestsList = document.getElementById('contestsList');
        const contestsHeader = document.querySelector('.contests-header');
        const contestDetail = document.getElementById('contestDetail');
        
        if (contestsList) contestsList.style.display = 'none';
        if (contestsHeader) contestsHeader.style.display = 'none';
        if (contestDetail) contestDetail.style.display = 'block';
    }
    
    // 初始化渲染
    renderContests(1);

    // 赛题详情显示/隐藏功能
    const contestDetail = document.getElementById('contestDetail');
    const contestsList = document.getElementById('contestsList');
    const contestsHeader = document.querySelector('.contests-header');
    const backBtn = document.getElementById('backBtn');

    if (backBtn) {
        backBtn.addEventListener('click', function() {
            contestDetail.style.display = 'none';
            contestsHeader.style.display = 'flex';
            contestsList.style.display = 'block';
            // 修复返回列表后卡片间距消失的问题
            const contestItems = document.querySelectorAll('.contest-item');
            contestItems.forEach(item => {
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
            const contestItems = document.querySelectorAll('.contest-item');
            
            contestItems.forEach(item => {
                const title = item.querySelector('.contest-title').textContent.toLowerCase();
                const description = item.querySelector('.contest-description').textContent.toLowerCase();
                
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
});