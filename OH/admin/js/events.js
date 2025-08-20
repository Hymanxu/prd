// 竞赛管理模块
class EventManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.events = [
            {
                id: 1,
                name: 'OpenHarmony 2025年1月安全挑战赛',
                startTime: '2025-01-01',
                endTime: '2025-01-31',
                status: '已发布',
                participants: 156,
                problemCount: 8,
                theme: '系统安全与漏洞挖掘',
                cover: null
            },
            {
                id: 2,
                name: 'OpenHarmony 2025年2月安全挑战赛',
                startTime: '2025-02-01',
                endTime: '2025-02-28',
                status: '新建',
                participants: 0,
                problemCount: 0,
                theme: '应用创新与用户体验',
                cover: null
            }
        ];
        this.currentEditId = null;
    }

    // 渲染竞赛列表
    renderEventsList() {
        const tbody = document.querySelector('#events .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.events.map((event, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div class="cover-placeholder" style="width: 60px; height: 34px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">
                        ${event.cover ? '封面' : '暂无'}
                    </div>
                </td>
                <td>${event.name}</td>
                <td>${event.startTime} ~ ${event.endTime}</td>
                <td>
                    <span class="status-badge ${event.status === '已发布' ? 'status-active' : event.status === '已结束' ? 'status-inactive' : 'status-draft'}">
                        ${event.status}
                    </span>
                </td>
                <td><a href="#" onclick="goToRegistrations(${event.id})" style="color: #3B82F6; text-decoration: none;">${event.participants}</a></td>
                <td><a href="#" onclick="goToProblems(${event.id})" style="color: #3B82F6; text-decoration: none;">${event.problemCount}</a></td>
                <td>
                    ${event.status === '新建' ?
                `<button class="btn btn-success btn-sm" onclick="publishEvent(${event.id})">发布</button>` :
                `<button class="btn btn-secondary btn-sm" onclick="unpublishEvent(${event.id})">取消发布</button>`
            }
                    <button class="btn btn-outline btn-sm" onclick="editEvent(${event.id})">编辑</button>
                </td>
            </tr>
        `).join('');
    }

    // 打开竞赛弹窗
    openEventModal(editId = null) {
        this.currentEditId = editId;
        const modal = document.getElementById('eventModal');

        if (editId) {
            const event = this.events.find(e => e.id === editId);
            if (event) {
                modal.querySelector('input[placeholder="请输入竞赛名称"]').value = event.name;
                modal.querySelector('textarea[placeholder="请输入竞赛主题"]').value = event.theme;
                modal.querySelector('.modal-title').textContent = '编辑竞赛';
            }
        } else {
            modal.querySelector('input[placeholder="请输入竞赛名称"]').value = '';
            modal.querySelector('textarea[placeholder="请输入竞赛主题"]').value = '';
            modal.querySelector('.modal-title').textContent = '新建竞赛';
        }

        modal.classList.add('show');
    }

    closeEventModal() {
        document.getElementById('eventModal').classList.remove('show');
        this.currentEditId = null;
    }

    // 保存竞赛
    saveEvent() {
        const modal = document.getElementById('eventModal');
        const name = modal.querySelector('input[placeholder="请输入竞赛名称"]').value;
        const theme = modal.querySelector('textarea[placeholder="请输入竞赛主题"]').value;

        if (!name.trim()) {
            alert('请输入竞赛名称');
            return;
        }

        const formData = {
            name: name.trim(),
            theme: theme.trim(),
            startTime: '2025-01-01',
            endTime: '2025-01-31'
        };

        if (this.currentEditId) {
            // 编辑模式
            const eventIndex = this.events.findIndex(e => e.id === this.currentEditId);
            if (eventIndex !== -1) {
                this.events[eventIndex] = {
                    ...this.events[eventIndex],
                    ...formData
                };
            }
        } else {
            // 新建模式
            const newEvent = {
                id: Date.now(),
                ...formData,
                status: '新建',
                participants: 0,
                problemCount: 0
            };
            this.events.push(newEvent);
        }

        this.renderEventsList();
        this.closeEventModal();
        alert('竞赛保存成功！');
    }

    // 编辑竞赛
    editEvent(id) {
        this.openEventModal(id);
    }

    // 发布竞赛
    publishEvent(id) {
        if (confirm('确定要发布这个竞赛吗？发布后参赛者即可报名参加。')) {
            const event = this.events.find(e => e.id === id);
            if (event) {
                event.status = '已发布';
                this.renderEventsList();
                alert('竞赛发布成功！');
            }
        }
    }

    // 取消发布竞赛
    unpublishEvent(id) {
        if (confirm('确定要取消发布这个竞赛吗？取消后参赛者将无法继续报名。')) {
            const event = this.events.find(e => e.id === id);
            if (event) {
                event.status = '新建';
                this.renderEventsList();
                alert('竞赛已取消发布！');
            }
        }
    }

    // 预览封面图片
    previewCover(input) {
        const file = input.files[0];
        const preview = document.getElementById('coverPreview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<div class="upload-placeholder">点击上传封面图片<br><small>建议尺寸：640×360，PNG格式</small></div>';
        }
    }

    // 跳转到报名管理
    goToRegistrations(eventId) {
        const navigationManager = window.NavigationManager;
        if (navigationManager) {
            navigationManager.switchSection('registrations');
            // 设置筛选条件
            setTimeout(() => {
                const userManager = window.UserManager;
                if (userManager) {
                    userManager.filterRegistrationsByEvent(eventId);
                }
            }, 100);
        }
    }

    // 跳转到赛题管理
    goToProblems(eventId) {
        const navigationManager = window.NavigationManager;
        if (navigationManager) {
            navigationManager.switchSection('problems');
            // 设置筛选条件
            setTimeout(() => {
                const problemManager = window.ProblemManager;
                if (problemManager) {
                    problemManager.filterProblemsByEvent(eventId);
                }
            }, 100);
        }
    }
}

// 导出实例
window.EventManager = new EventManager();

// 导出实例
window.EventManager = new EventManager();