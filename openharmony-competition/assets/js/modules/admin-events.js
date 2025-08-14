// 竞赛管理功能模块
class AdminEvents {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
        document.addEventListener('click', (e) => {
            if (e.target.id === 'createEventBtn') {
                this.openEventModal();
            }
        });
    }

    openEventModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeEventModal() {
        const modal = document.getElementById('eventModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('eventForm');
            if (form) {
                form.reset();
            }
        }
    }

    saveEvent() {
        const form = document.getElementById('eventForm');
        const formData = new FormData(form);

        console.log('保存竞赛:', Object.fromEntries(formData));
        alert('竞赛保存成功！');
        this.closeEventModal();
    }

    editEvent(id) {
        console.log('编辑竞赛:', id);
        this.openEventModal();
    }

    publishEvent(id) {
        if (confirm('确定要发布这个竞赛吗？')) {
            console.log('发布竞赛:', id);
            alert('竞赛发布成功！');
        }
    }

    unpublishEvent(id) {
        if (confirm('确定要取消发布这个竞赛吗？')) {
            console.log('取消发布竞赛:', id);
            alert('竞赛已取消发布！');
        }
    }

    goToRegistrations(eventId) {
        console.log('跳转到报名管理，赛事ID:', eventId);
        document.querySelector('[data-section="registrations"]').click();
    }

    goToProblems(eventId) {
        console.log('跳转到赛题管理，赛事ID:', eventId);
        document.querySelector('[data-section="problems"]').click();
    }
}

// 导出模块
window.AdminEvents = AdminEvents;