// 竞赛管理模块
class EventManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.events = [
            {
                id: 1,
                name: 'OpenHarmony 安全挑战赛',
                startTime: '2024-01-15',
                endTime: '2024-03-15',
                status: '已发布',
                participants: 156,
                problemCount: 12,
                theme: '系统安全与漏洞挖掘',
                cover: null
            },
            {
                id: 2,
                name: 'HarmonyOS 创新开发大赛',
                startTime: '2024-02-01',
                endTime: '2024-04-01',
                status: '新建',
                participants: 0,
                problemCount: 8,
                theme: '应用创新与用户体验',
                cover: null
            }
        ];
        this.currentEditId = null;
    }

    // 渲染竞赛列表
    renderEventsList() {
        const tbody = document.querySelector('#eventsTable tbody');
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
                    <span class="status-badge status-${event.status === '已发布' ? 'published' : event.status === '已结束' ? 'ended' : 'draft'}">
                        ${event.status}
                    </span>
                </td>
                <td>${event.participants}</td>
                <td>${event.problemCount}</td>
                <td>
                    <div class="action-buttons">
                        ${event.status === '新建' ? 
                            `<button class="btn btn-primary btn-sm" onclick="publishEvent(${event.id})">发布</button>` :
                            `<button class="btn btn-outline btn-sm" onclick="unpublishEvent(${event.id})">取消发布</button>`
                        }
                        <button class="btn btn-outline btn-sm" onclick="editEvent(${event.id})">编辑</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 打开竞赛弹窗
    openEventModal(editId = null) {
        this.currentEditId = editId;
        const modal = document.getElementById('eventModal');
        const form = document.getElementById('eventForm');
        
        if (editId) {
            const event = this.events.find(e => e.id === editId);
            if (event) {
                form.eventName.value = event.name;
                form.startTime.value = event.startTime;
                form.endTime.value = event.endTime;
                form.theme.value = event.theme;
                document.getElementById('modalTitle').textContent = '编辑竞赛';
            }
        } else {
            form.reset();
            document.getElementById('modalTitle').textContent = '新建竞赛';
        }
        
        modal.style.display = 'block';
    }

    closeEventModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.currentEditId = null;
    }

    // 保存竞赛
    saveEvent() {
        const form = document.getElementById('eventForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = {
            name: form.eventName.value,
            startTime: form.startTime.value,
            endTime: form.endTime.value,
            theme: form.theme.value,
            cover: form.cover.files[0] || null
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
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<div class="upload-placeholder">点击上传封面图片<br><small>建议尺寸：640×360，PNG格式</small></div>';
        }
    }
}

// 导出实例
window.EventManager = new EventManager();
