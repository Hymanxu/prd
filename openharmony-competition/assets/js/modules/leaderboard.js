/**
 * 排行榜模块
 * 处理积分排行和贡献排行的数据展示和切换
 */

class LeaderboardModule {
    constructor() {
        this.currentType = 'score'; // 'score' 或 'contribution'
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalPages = {
            score: 3,
            contribution: 2
        };
        this.initEventListeners();
        this.loadLeaderboardData();
    }

    // 初始化事件监听器
    initEventListeners() {
        // 绑定排行榜切换按钮
        const leaderboardTabs = document.querySelectorAll('.leaderboard-tab[data-leaderboard]');
        leaderboardTabs.forEach(tab => {
            const type = tab.getAttribute('data-leaderboard');
            if (type) {
                tab.addEventListener('click', () => this.switchLeaderboard(type));
            }
        });
        
        // 绑定分页按钮
        const prevBtn = document.getElementById('leaderboardPrevBtn');
        const nextBtn = document.getElementById('leaderboardNextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changePage(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changePage(1));
        }
        
        // 初始化分页UI
        this.updatePaginationUI();
    }

    // 切换排行榜类型
    switchLeaderboard(type) {
        if (this.currentType === type) return;

        this.currentType = type;
        this.currentPage = 1; // 切换类型时重置页码

        // 更新按钮状态
        const tabs = document.querySelectorAll('.leaderboard-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-leaderboard') === type) {
                tab.classList.add('active');
            }
        });

        // 切换显示的排行榜
        const scoreBoard = document.getElementById('scoreLeaderboard');
        const contributionBoard = document.getElementById('contributionLeaderboard');

        if (type === 'score') {
            if (scoreBoard) scoreBoard.style.display = 'block';
            if (contributionBoard) contributionBoard.style.display = 'none';
        } else {
            if (scoreBoard) scoreBoard.style.display = 'none';
            if (contributionBoard) contributionBoard.style.display = 'block';
        }

        // 更新分页UI
        this.updatePaginationUI();
        
        // 加载对应数据
        this.loadLeaderboardData();

        if (window.messageManager) {
            const typeName = type === 'score' ? '积分排行' : '贡献排行';
            window.messageManager.show(`已切换到${typeName}`, 'info');
        }
    }
    
    // 切换页码
    changePage(direction) {
        const newPage = this.currentPage + direction;
        const maxPages = this.totalPages[this.currentType];
        
        if (newPage >= 1 && newPage <= maxPages) {
            this.currentPage = newPage;
            this.updatePaginationUI();
            this.loadLeaderboardData();
            
            if (window.messageManager) {
                window.messageManager.show(`已切换到第${newPage}页`, 'info');
            }
        }
    }
    
    // 更新分页UI
    updatePaginationUI() {
        const currentPageEl = document.getElementById('leaderboardCurrentPage');
        const totalPagesEl = document.getElementById('leaderboardTotalPages');
        const prevBtn = document.getElementById('leaderboardPrevBtn');
        const nextBtn = document.getElementById('leaderboardNextBtn');
        
        if (currentPageEl) {
            currentPageEl.textContent = this.currentPage;
        }
        
        if (totalPagesEl) {
            totalPagesEl.textContent = this.totalPages[this.currentType];
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages[this.currentType];
        }
    }

    // 加载排行榜数据
    loadLeaderboardData() {
        if (this.currentType === 'score') {
            this.loadScoreLeaderboard();
        } else {
            this.loadContributionLeaderboard();
        }
    }

    // 加载积分排行榜
    loadScoreLeaderboard() {
        const data = this.getScoreLeaderboardData();
        const tbody = document.getElementById('scoreLeaderboardBody');
        
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach((user, index) => {
            // 计算实际排名（考虑分页）
            const rank = (this.currentPage - 1) * this.itemsPerPage + index + 1;
            const row = this.createScoreRow(user, rank);
            tbody.appendChild(row);
        });
    }

    // 加载贡献排行榜
    loadContributionLeaderboard() {
        const data = this.getContributionLeaderboardData();
        const tbody = document.getElementById('contributionLeaderboardBody');
        
        if (!tbody) return;

        tbody.innerHTML = '';

        data.forEach((user, index) => {
            // 计算实际排名（考虑分页）
            const rank = (this.currentPage - 1) * this.itemsPerPage + index + 1;
            const row = this.createContributionRow(user, rank);
            tbody.appendChild(row);
        });
    }

    // 创建积分排行榜行
    createScoreRow(user, rank) {
        const row = document.createElement('tr');
        
        // 排名列
        const rankCell = document.createElement('td');
        rankCell.innerHTML = this.createRankBadge(rank);
        row.appendChild(rankCell);

        // 用户名列
        const nameCell = document.createElement('td');
        nameCell.textContent = user.username;
        row.appendChild(nameCell);

        // 学校列
        const schoolCell = document.createElement('td');
        schoolCell.textContent = user.school;
        row.appendChild(schoolCell);

        // 积分列
        const scoreCell = document.createElement('td');
        scoreCell.textContent = user.score.toLocaleString();
        scoreCell.style.fontWeight = '600';
        if (rank <= 3) {
            scoreCell.style.color = this.getRankColor(rank);
        }
        row.appendChild(scoreCell);

        // 提交列
        const submissionCell = document.createElement('td');
        submissionCell.textContent = user.submissions;
        row.appendChild(submissionCell);

        // 最近提交时间列
        const lastSubmissionCell = document.createElement('td');
        lastSubmissionCell.textContent = user.lastSubmission;
        row.appendChild(lastSubmissionCell);

        return row;
    }

    // 创建贡献排行榜行
    createContributionRow(user, rank) {
        const row = document.createElement('tr');
        
        // 排名列
        const rankCell = document.createElement('td');
        rankCell.innerHTML = this.createRankBadge(rank);
        row.appendChild(rankCell);

        // 用户名列
        const nameCell = document.createElement('td');
        nameCell.textContent = user.username;
        row.appendChild(nameCell);

        // 学校列
        const schoolCell = document.createElement('td');
        schoolCell.textContent = user.school;
        row.appendChild(schoolCell);

        // commit列
        const commitCell = document.createElement('td');
        commitCell.textContent = user.commits;
        commitCell.style.color = '#0052D9';
        commitCell.style.fontWeight = 'bold';
        row.appendChild(commitCell);

        // 贡献类型列
        const typeCell = document.createElement('td');
        const tagsContainer = document.createElement('div');
        tagsContainer.style.display = 'flex';
        tagsContainer.style.gap = '4px';
        tagsContainer.style.flexWrap = 'wrap';
        
        user.contributionTypes.forEach(type => {
            const tag = document.createElement('span');
            tag.className = 'contribution-tag';
            tag.textContent = type;
            tag.style.cssText = `
                display: inline-block;
                padding: 2px 8px;
                background: #F2F3FF;
                color: #0052D9;
                border-radius: 12px;
                font-size: 12px;
                line-height: 1.5;
            `;
            tagsContainer.appendChild(tag);
        });
        
        typeCell.appendChild(tagsContainer);
        row.appendChild(typeCell);

        // 积分列
        const scoreCell = document.createElement('td');
        scoreCell.textContent = user.score.toLocaleString();
        scoreCell.style.fontWeight = '600';
        if (rank <= 3) {
            scoreCell.style.color = this.getRankColor(rank);
        }
        row.appendChild(scoreCell);

        return row;
    }

    // 创建排名徽章
    createRankBadge(rank) {
        let icon = '';
        let badgeClass = '';
        
        if (rank === 1) {
            icon = '<i class="fas fa-crown" style="color: #F4D03F; margin-left: 8px;"></i>';
            badgeClass = 'rank-1';
        } else if (rank === 2) {
            icon = '<i class="fas fa-medal" style="color: #D5DBDB; margin-left: 8px;"></i>';
            badgeClass = 'rank-2';
        } else if (rank === 3) {
            icon = '<i class="fas fa-award" style="color: #E67E22; margin-left: 8px;"></i>';
            badgeClass = 'rank-3';
        }

        return `
            <div class="rank-number" style="display: flex; align-items: center;">
                <div class="rank-badge ${badgeClass}" style="
                    width: 24px; 
                    height: 24px; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: 600; 
                    font-size: 12px;
                    ${rank <= 3 ? `background: ${this.getRankColor(rank)}; color: white;` : 'background: #F5F5F5; color: #666;'}
                ">${rank}</div>
                ${icon}
            </div>
        `;
    }

    // 获取排名颜色
    getRankColor(rank) {
        switch (rank) {
            case 1: return '#F4D03F';
            case 2: return '#D5DBDB';
            case 3: return '#E67E22';
            default: return '#666';
        }
    }

    // 获取积分排行榜数据
    getScoreLeaderboardData() {
        // 生成随机日期时间（yyyy-mm-dd HH:mm格式）
        const generateRandomDate = () => {
            const year = 2025;
            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
            const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
            const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            return `${year}-${month}-${day} ${hour}:${minute}`;
        };
        
        // 模拟分页数据
        const allData = [
            {
                username: '张三',
                school: '清华大学',
                score: 1250,
                submissions: 28,
                lastSubmission: generateRandomDate()
            },
            {
                username: '李四',
                school: '北京大学',
                score: 1180,
                submissions: 25,
                lastSubmission: generateRandomDate()
            },
            {
                username: '王五',
                school: '上海交通大学',
                score: 950,
                submissions: 22,
                lastSubmission: generateRandomDate()
            },
            {
                username: '赵六',
                school: '浙江大学',
                score: 890,
                submissions: 20,
                lastSubmission: generateRandomDate()
            },
            {
                username: '钱七',
                school: '复旦大学',
                score: 820,
                submissions: 18,
                lastSubmission: generateRandomDate()
            },
            {
                username: '孙八',
                school: '中山大学',
                score: 750,
                submissions: 16,
                lastSubmission: generateRandomDate()
            },
            {
                username: '周九',
                school: '华中科技大学',
                score: 680,
                submissions: 15,
                lastSubmission: generateRandomDate()
            },
            {
                username: '吴十',
                school: '西安交通大学',
                score: 620,
                submissions: 14,
                lastSubmission: generateRandomDate()
            },
            {
                username: '郑十一',
                school: '南京大学',
                score: 580,
                submissions: 12,
                lastSubmission: generateRandomDate()
            },
            {
                username: '王十二',
                school: '武汉大学',
                score: 540,
                submissions: 10,
                lastSubmission: generateRandomDate()
            },
            // 第二页
            {
                username: '刘十三',
                school: '哈尔滨工业大学',
                score: 510,
                submissions: 9,
                lastSubmission: generateRandomDate()
            },
            {
                username: '陈十四',
                school: '电子科技大学',
                score: 480,
                submissions: 8,
                lastSubmission: generateRandomDate()
            }
            // 更多数据...
        ];
        
        // 计算分页
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        
        return allData.slice(start, end);
    }

    // 获取贡献排行榜数据
    getContributionLeaderboardData() {
        // 生成随机commit ID
        const generateCommitId = () => {
            const chars = '0123456789abcdef';
            let result = '';
            for (let i = 0; i < 5; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result;
        };
        
        // 贡献类型列表
        const contributionTypes = ['覆盖率提升', '已知漏洞检测', '0day漏洞挖掘'];
        
        // 模拟分页数据
        const allData = [
            {
                username: '张三',
                school: '清华大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[2]],
                score: 1250
            },
            {
                username: '李四',
                school: '北京大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[1]],
                score: 1180
            },
            {
                username: '王五',
                school: '上海交通大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[2]],
                score: 950
            },
            {
                username: '赵六',
                school: '浙江大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[1]],
                score: 890
            },
            {
                username: '钱七',
                school: '复旦大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[0]],
                score: 820
            },
            {
                username: '孙八',
                school: '中山大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[1]],
                score: 750
            },
            {
                username: '周九',
                school: '华中科技大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[0]],
                score: 680
            },
            {
                username: '吴十',
                school: '西安交通大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[0]],
                score: 620
            },
            {
                username: '郑十一',
                school: '南京大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[2]],
                score: 580
            },
            {
                username: '王十二',
                school: '武汉大学',
                commits: generateCommitId(),
                contributionTypes: [contributionTypes[1]],
                score: 540
            }
            // 更多数据...
        ];
        
        // 计算分页
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        
        return allData.slice(start, end);
    }

    // 获取当前排行榜类型
    getCurrentType() {
        return this.currentType;
    }

    // 刷新排行榜数据
    refresh() {
        this.loadLeaderboardData();
    }
}

// 导出模块
window.LeaderboardModule = LeaderboardModule;