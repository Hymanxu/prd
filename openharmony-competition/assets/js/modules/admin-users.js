// 管理员账号管理功能模块
class AdminUsers {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    openAddAdminModal() {
        const modal = document.getElementById('addAdminModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeAddAdminModal() {
        const modal = document.getElementById('addAdminModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('addAdminForm');
            if (form) {
                form.reset();
            }
        }
    }

    saveAdmin() {
        const form = document.getElementById('addAdminForm');
        const formData = new FormData(form);

        // 验证必填字段
        const name = formData.get('name');
        const phone = formData.get('phone');
        const role = formData.get('role');

        if (!name) {
            alert('请输入姓名');
            return;
        }

        if (!phone) {
            alert('请输入手机号');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            alert('请输入正确的手机号格式');
            return;
        }

        if (!role) {
            alert('请选择角色');
            return;
        }

        console.log('添加管理员:', Object.fromEntries(formData));
        alert('管理员添加成功！');
        this.closeAddAdminModal();
    }

    editAdmin(id) {
        console.log('编辑管理员:', id);
        this.openAddAdminModal();
    }

    disableAdmin(id) {
        if (confirm('确定要禁用这个管理员账号吗？')) {
            console.log('禁用管理员:', id);
            alert('管理员账号已禁用！');
        }
    }

    enableAdmin(id) {
        if (confirm('确定要启用这个管理员账号吗？')) {
            console.log('启用管理员:', id);
            alert('管理员账号已启用！');
        }
    }
}

// 导出模块
window.AdminUsers = AdminUsers;