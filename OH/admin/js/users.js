// 用户管理模块
class UserManager {
    constructor() {
        this.registrations = [
            {
                id: 1,
                username: '张三',
                school: '清华大学',
                major: '计算机科学与技术',
                email: 'zhangsan@example.com',
                phone: '138****8888',
                registerTime: '2025-01-15 14:30'
            }
        ];

        this.scorings = [
            {
                id: 1,
                rank: 1,
                username: '张三',
                school: '清华大学',
                score: 1250,
                paymentInfo: '已完善'
            }
        ];

        this.admins = [
            {
                id: 1,
                name: '管理员',
                phone: '138****8888',
                permissions: ['竞赛管理', '赛题管理', '奖励管理', '系统管理'],
                status: '启用',
                createTime: '2025-01-01 10:00',
                lastLogin: '2025-01-15 14:30'
            }
        ];
    }

    // 渲染报名列表
    renderRegistrationsList() {
        const tbody = document.querySelector('#registrations .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.registrations.map((reg, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${reg.username}</td>
                <td>${reg.school}</td>
                <td>${reg.major}</td>
                <td>${reg.email}</td>
                <td>${reg.registerTime}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewRegistrationDetail(${reg.id})">查看</button>
                    <button class="btn btn-danger btn-sm" onclick="removeRegistration(${reg.id})">移除</button>
                </td>
            </tr>
        `).join('');
    }

    // 渲染结算列表
    renderScoringList() {
        const tbody = document.querySelector('#scoring .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.scorings.map(scoring => `
            <tr>
                <td>${scoring.rank}</td>
                <td>${scoring.username}</td>
                <td>${scoring.school}</td>
                <td>${scoring.score}</td>
                <td><span class="status-badge ${scoring.paymentInfo === '已完善' ? 'status-active' : 'status-inactive'}">${scoring.paymentInfo}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewScoreDetail(${scoring.id})">查看</button>
                    <button class="btn btn-outline btn-sm" onclick="adjustScore(${scoring.id})">调整</button>
                </td>
            </tr>
        `).join('');
    }

    // 渲染管理员列表
    renderAdminsList() {
        const tbody = document.querySelector('#users .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.admins.map(admin => `
            <tr>
                <td>${admin.name}</td>
                <td>${admin.phone}</td>
                <td>
                    ${admin.permissions.map(perm => `<span class="status-badge">${perm}</span>`).join('')}
                </td>
                <td><span class="status-badge ${admin.status === '启用' ? 'status-active' : 'status-inactive'}">${admin.status}</span></td>
                <td>${admin.createTime}</td>
                <td>${admin.lastLogin}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="editAdmin(${admin.id})">编辑</button>
                    <button class="btn btn-secondary btn-sm" onclick="${admin.status === '启用' ? 'disableAdmin' : 'enableAdmin'}(${admin.id})">${admin.status === '启用' ? '禁用' : '启用'}</button>
                </td>
            </tr>
        `).join('');
    }

    // 按赛事筛选报名
    filterRegistrationsByEvent(eventId) {
        console.log('按赛事筛选报名:', eventId);
        this.renderRegistrationsList();
    }

    // 按赛事筛选结算
    filterScoringByEvent(eventId) {
        console.log('按赛事筛选结算:', eventId);
        this.renderScoringList();
    }

    // 导出报名信息
    exportRegistrations() {
        alert('导出报名信息功能');
    }

    // 导出结算数据
    exportScoring() {
        alert('导出结算数据功能');
    }

    // 查看报名详情
    viewRegistrationDetail(id) {
        const modal = document.getElementById('registrationDetailModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // 关闭报名详情弹窗
    closeRegistrationDetailModal() {
        document.getElementById('registrationDetailModal').classList.remove('show');
    }

    // 移除报名
    removeRegistration(id) {
        if (confirm('确定要移除这个报名吗？')) {
            this.registrations = this.registrations.filter(r => r.id !== id);
            this.renderRegistrationsList();
            alert('报名已移除！');
        }
    }

    // 查看积分详情
    viewScoreDetail(id) {
        const scoring = this.scorings.find(s => s.id === id);
        if (scoring) {
            const modal = document.getElementById('scoreDetailModal');
            document.getElementById('scoreDetailUsername').textContent = scoring.username;
            document.getElementById('scoreDetailSchool').textContent = scoring.school;
            document.getElementById('scoreDetailRank').textContent = scoring.rank;
            document.getElementById('scoreDetailTotal').textContent = scoring.score;

            modal.classList.add('show');
        }
    }

    // 关闭积分详情弹窗
    closeScoreDetailModal() {
        document.getElementById('scoreDetailModal').classList.remove('show');
    }

    // 打开积分调整弹窗
    openScoreAdjustModal() {
        this.closeScoreDetailModal();
        setTimeout(() => {
            const modal = document.getElementById('scoreAdjustModal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 200);
    }

    // 关闭积分调整弹窗
    closeScoreAdjustModal() {
        document.getElementById('scoreAdjustModal').classList.remove('show');
    }



    // 打开添加管理员弹窗
    openAddAdminModal() {
        const modal = document.getElementById('addAdminModal');
        if (modal) {
            modal.querySelector('.modal-title').textContent = '创建管理员账号';
            // 清空表单
            document.getElementById('adminName').value = '';
            document.getElementById('adminPhone').value = '';
            document.getElementById('permContest').checked = false;
            document.getElementById('permProblem').checked = false;
            document.getElementById('permReward').checked = false;
            document.getElementById('permSystem').checked = false;

            this.currentEditAdminId = null;
            modal.classList.add('show');
        }
    }

    // 关闭添加管理员弹窗
    closeAddAdminModal() {
        document.getElementById('addAdminModal').classList.remove('show');
        this.currentEditAdminId = null;
    }

    // 保存管理员
    saveAdmin() {
        const name = document.getElementById('adminName').value;
        const phone = document.getElementById('adminPhone').value;

        if (!name.trim() || !phone.trim()) {
            alert('请填写完整信息');
            return;
        }

        const permissions = [];
        const permissionMap = {
            'permContest': '竞赛管理',
            'permProblem': '赛题管理',
            'permReward': '奖励管理',
            'permSystem': '系统管理'
        };

        Object.keys(permissionMap).forEach(id => {
            if (document.getElementById(id).checked) {
                permissions.push(permissionMap[id]);
            }
        });

        if (this.currentEditAdminId) {
            // 编辑模式
            const adminIndex = this.admins.findIndex(a => a.id === this.currentEditAdminId);
            if (adminIndex !== -1) {
                this.admins[adminIndex] = {
                    ...this.admins[adminIndex],
                    name: name.trim(),
                    phone: phone.trim(),
                    permissions: permissions
                };
            }
            alert('管理员信息更新成功！');
        } else {
            // 新建模式
            const newAdmin = {
                id: Date.now(),
                name: name.trim(),
                phone: phone.trim(),
                permissions: permissions,
                status: '启用',
                createTime: new Date().toLocaleString(),
                lastLogin: '-'
            };
            this.admins.push(newAdmin);
            alert('管理员创建成功！');
        }

        this.renderAdminsList();
        this.closeAddAdminModal();
    }

    // 编辑管理员
    editAdmin(id) {
        const admin = this.admins.find(a => a.id === id);
        if (admin) {
            const modal = document.getElementById('addAdminModal');
            modal.querySelector('.modal-title').textContent = '编辑管理员账号';

            // 填充表单数据
            document.getElementById('adminName').value = admin.name;
            document.getElementById('adminPhone').value = admin.phone;

            // 设置权限复选框
            document.getElementById('permContest').checked = admin.permissions.includes('竞赛管理');
            document.getElementById('permProblem').checked = admin.permissions.includes('赛题管理');
            document.getElementById('permReward').checked = admin.permissions.includes('奖励管理');
            document.getElementById('permSystem').checked = admin.permissions.includes('系统管理');

            this.currentEditAdminId = id;
            modal.classList.add('show');
        }
    }

    // 禁用管理员
    disableAdmin(id) {
        if (confirm('确定要禁用这个管理员吗？')) {
            const admin = this.admins.find(a => a.id === id);
            if (admin) {
                admin.status = '禁用';
                this.renderAdminsList();
                alert('管理员已禁用！');
            }
        }
    }

    // 启用管理员
    enableAdmin(id) {
        const admin = this.admins.find(a => a.id === id);
        if (admin) {
            admin.status = '启用';
            this.renderAdminsList();
            alert('管理员已启用！');
        }
    }

    // 更新积分调整功能
    submitScoreAdjust() {
        const username = document.getElementById('adjustUsername').value;
        const newScore = document.getElementById('newScore').value;
        
        if (!newScore || isNaN(newScore)) {
            alert('请输入有效的积分值');
            return;
        }

        // 更新积分
        const scoring = this.scorings.find(s => s.username === username);
        if (scoring) {
            scoring.score = parseInt(newScore);
            this.renderScoringList();
            alert(`积分调整成功！用户 ${username} 的积分已调整为 ${newScore} 分`);
        }
        
        this.closeScoreAdjustModal();
    }

    // 调整积分（从列表直接调用）
    adjustScore(id) {
        const scoring = this.scorings.find(s => s.id === id);
        if (scoring) {
            const modal = document.getElementById('scoreAdjustModal');
            document.getElementById('adjustUsername').value = scoring.username;
            document.getElementById('newScore').value = scoring.score;
            modal.classList.add('show');
        }
    }
}

// 导出实例
window.UserManager = new UserManager();