// 用户管理模块
class UserManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.registrations = [
            {
                id: 1,
                username: '张三',
                school: '清华大学',
                major: '计算机科学与技术',
                email: 'zhangsan@example.com',
                registerTime: '2024-01-20 14:30:00',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛'
            },
            {
                id: 2,
                username: '李四',
                school: '北京大学',
                major: '软件工程',
                email: 'lisi@example.com',
                registerTime: '2024-01-21 09:15:00',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛'
            }
        ];
        
        this.scoringData = [
            {
                id: 1,
                rank: 1,
                username: '张三',
                school: '清华大学',
                score: 850,
                paymentInfo: '已完善',
                eventId: 1
            },
            {
                id: 2,
                rank: 2,
                username: '李四',
                school: '北京大学',
                score: 720,
                paymentInfo: '无',
                eventId: 1
            }
        ];

        this.admins = [
            {
                id: 1,
                name: '管理员1',
                phone: '13800138001',
                permissions: ['竞赛管理', '赛题管理'],
                status: '启用',
                createTime: '2024-01-01 10:00:00',
                lastLogin: '2024-01-20 15:30:00'
            },
            {
                id: 2,
                name: '管理员2',
                phone: '13800138002',
                permissions: ['奖励管理', '系统管理'],
                status: '禁用',
                createTime: '2024-01-02 11:00:00',
                lastLogin: '2024-01-15 09:20:00'
            }
        ];

        this.currentEditAdminId = null;
        this.selectedEventId = null;
    }

    // 渲染报名管理列表
    renderRegistrationsList() {
        const tbody = document.querySelector('#registrationsTable tbody');
        if (!tbody) return;

        let filteredRegistrations = this.registrations;
        if (this.selectedEventId) {
            filteredRegistrations = this.registrations.filter(r => r.eventId == this.selectedEventId);
        }

        tbody.innerHTML = filteredRegistrations.map((reg, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${reg.username}</td>
                <td>${reg.school}</td>
                <td>${reg.major}</td>
                <td>${reg.email}</td>
                <td>${reg.registerTime}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="viewRegistrationDetail(${reg.id})">查看</button>
                        <button class="btn btn-danger btn-sm" onclick="removeRegistration(${reg.id})">移除</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 渲染赛事结算列表
    renderScoringList() {
        const tbody = document.querySelector('#scoringTable tbody');
        if (!tbody) return;

        let filteredScoring = this.scoringData;
        if (this.selectedEventId) {
            filteredScoring = this.scoringData.filter(s => s.eventId == this.selectedEventId);
        }

        tbody.innerHTML = filteredScoring.map(score => `
            <tr>
                <td>${score.rank}</td>
                <td>${score.username}</td>
                <td>${score.school}</td>
                <td>${score.score}</td>
                <td>
                    <span class="status-badge ${score.paymentInfo === '已完善' ? 'status-published' : 'status-draft'}">
                        ${score.paymentInfo}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="viewScoreDetail(${score.id})">查看</button>
                        <button class="btn btn-outline btn-sm" onclick="adjustScore(${score.id})">调整</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 渲染管理员列表
    renderAdminsList() {
        const tbody = document.querySelector('#adminsTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.admins.map((admin, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${admin.name}</td>
                <td>${admin.phone}</td>
                <td>${admin.permissions.join(', ')}</td>
                <td>
                    <span class="status-badge ${admin.status === '启用' ? 'status-published' : 'status-draft'}">
                        ${admin.status}
                    </span>
                </td>
                <td>${admin.createTime}</td>
                <td>${admin.lastLogin}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editAdmin(${admin.id})">编辑</button>
                        ${admin.status === '启用' ? 
                            `<button class="btn btn-danger btn-sm" onclick="disableAdmin(${admin.id})">禁用</button>` :
                            `<button class="btn btn-primary btn-sm" onclick="enableAdmin(${admin.id})">启用</button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 报名管理功能
    filterRegistrationsByEvent(eventId) {
        this.selectedEventId = eventId;
        this.renderRegistrationsList();
    }

    removeRegistration(id) {
        if (confirm('确定要移除这个报名吗？此操作不可恢复。')) {
            this.registrations = this.registrations.filter(r => r.id !== id);
            this.renderRegistrationsList();
            alert('报名已移除！');
        }
    }

    viewRegistrationDetail(id) {
        const registration = this.registrations.find(r => r.id === id);
        if (registration) {
            const modal = document.getElementById('registrationDetailModal');
            document.getElementById('detailUsername').textContent = registration.username;
            document.getElementById('detailSchool').textContent = registration.school;
            document.getElementById('detailMajor').textContent = registration.major;
            document.getElementById('detailEmail').textContent = registration.email;
            document.getElementById('detailRegisterTime').textContent = registration.registerTime;
            document.getElementById('detailEventName').textContent = registration.eventName;
            modal.style.display = 'block';
        }
    }

    closeRegistrationDetailModal() {
        document.getElementById('registrationDetailModal').style.display = 'none';
    }

    exportRegistrations() {
        // 模拟导出功能
        const data = this.registrations.map(r => ({
            用户名: r.username,
            学校: r.school,
            专业: r.major,
            邮箱: r.email,
            报名时间: r.registerTime
        }));
        
        console.log('导出报名数据:', data);
        alert('报名数据导出成功！已下载到本地。');
    }

    // 赛事结算功能
    filterScoringByEvent(eventId) {
        this.selectedEventId = eventId;
        this.renderScoringList();
    }

    viewScoreDetail(id) {
        const score = this.scoringData.find(s => s.id === id);
        if (score) {
            const modal = document.getElementById('scoreDetailModal');
            document.getElementById('scoreDetailUsername').textContent = score.username;
            document.getElementById('scoreDetailSchool').textContent = score.school;
            document.getElementById('scoreDetailScore').textContent = score.score;
            document.getElementById('scoreDetailRank').textContent = score.rank;
            document.getElementById('scoreDetailPayment').textContent = score.paymentInfo;
            modal.style.display = 'block';
        }
    }

    closeScoreDetailModal() {
        document.getElementById('scoreDetailModal').style.display = 'none';
    }

    adjustScore(id) {
        const score = this.scoringData.find(s => s.id === id);
        if (score) {
            const modal = document.getElementById('scoreAdjustModal');
            document.getElementById('adjustUsername').textContent = score.username;
            document.getElementById('adjustCurrentScore').textContent = score.score;
            document.getElementById('newScore').value = score.score;
            document.getElementById('adjustReason').value = '';
            modal.style.display = 'block';
            this.currentAdjustId = id;
        }
    }

    closeScoreAdjustModal() {
        document.getElementById('scoreAdjustModal').style.display = 'none';
        this.currentAdjustId = null;
    }

    submitScoreAdjust() {
        const newScore = document.getElementById('newScore').value;
        const reason = document.getElementById('adjustReason').value;
        
        if (!newScore || !reason) {
            alert('请填写完整信息');
            return;
        }

        const score = this.scoringData.find(s => s.id === this.currentAdjustId);
        if (score) {
            score.score = parseInt(newScore);
            this.renderScoringList();
            this.closeScoreAdjustModal();
            alert('积分调整成功！');
        }
    }

    exportScoring() {
        const data = this.scoringData.map(s => ({
            排名: s.rank,
            用户名: s.username,
            学校: s.school,
            积分: s.score,
            收款信息: s.paymentInfo
        }));
        
        console.log('导出结算数据:', data);
        alert('结算数据导出成功！已下载到本地。');
    }

    // 管理员账号功能
    openAddAdminModal(editId = null) {
        this.currentEditAdminId = editId;
        const modal = document.getElementById('addAdminModal');
        const form = document.getElementById('addAdminForm');
        
        if (editId) {
            const admin = this.admins.find(a => a.id === editId);
            if (admin) {
                form.adminName.value = admin.name;
                form.adminPhone.value = admin.phone;
                // 设置权限复选框
                const checkboxes = form.querySelectorAll('input[name="permissions"]');
                checkboxes.forEach(cb => {
                    cb.checked = admin.permissions.includes(cb.value);
                });
                document.getElementById('adminModalTitle').textContent = '编辑管理员';
            }
        } else {
            form.reset();
            document.getElementById('adminModalTitle').textContent = '新建管理员';
        }
        
        modal.style.display = 'block';
    }

    closeAddAdminModal() {
        document.getElementById('addAdminModal').style.display = 'none';
        this.currentEditAdminId = null;
    }

    sendAdminVerificationCode() {
        const phone = document.getElementById('adminPhone').value;
        if (!phone) {
            alert('请输入手机号');
            return;
        }
        
        // 模拟发送验证码
        const btn = document.getElementById('sendCodeBtn');
        btn.disabled = true;
        btn.textContent = '60s后重发';
        
        let countdown = 60;
        const timer = setInterval(() => {
            countdown--;
            btn.textContent = `${countdown}s后重发`;
            if (countdown <= 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.textContent = '发送验证码';
            }
        }, 1000);
        
        alert('验证码已发送到手机！');
    }

    saveAdmin() {
        const form = document.getElementById('addAdminForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const permissions = Array.from(form.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value);
        
        const adminData = {
            name: formData.get('adminName'),
            phone: formData.get('adminPhone'),
            permissions: permissions
        };

        if (this.currentEditAdminId) {
            // 编辑模式
            const adminIndex = this.admins.findIndex(a => a.id === this.currentEditAdminId);
            if (adminIndex !== -1) {
                this.admins[adminIndex] = {
                    ...this.admins[adminIndex],
                    ...adminData
                };
            }
        } else {
            // 新建模式
            const newAdmin = {
                id: Date.now(),
                ...adminData,
                status: '启用',
                createTime: new Date().toLocaleString('zh-CN'),
                lastLogin: '从未登录'
            };
            this.admins.push(newAdmin);
        }

        this.renderAdminsList();
        this.closeAddAdminModal();
        alert('管理员保存成功！');
    }

    editAdmin(id) {
        this.openAddAdminModal(id);
    }

    disableAdmin(id) {
        if (confirm('确定要禁用这个管理员账号吗？禁用后该账号将无法登录。')) {
            const admin = this.admins.find(a => a.id === id);
            if (admin) {
                admin.status = '禁用';
                this.renderAdminsList();
                alert('管理员账号已禁用！');
            }
        }
    }

    enableAdmin(id) {
        if (confirm('确定要启用这个管理员账号吗？')) {
            const admin = this.admins.find(a => a.id === id);
            if (admin) {
                admin.status = '启用';
                this.renderAdminsList();
                alert('管理员账号已启用！');
            }
        }
    }
}

// 导出实例
window.UserManager = new UserManager();