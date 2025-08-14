// 网站配置功能模块
class AdminSettings {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    switchConfigTab(tabName) {
        // 切换tab激活状态
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 切换内容显示
        document.querySelectorAll('.config-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-config`).classList.add('active');
    }

    // Banner管理功能
    addBannerImage() {
        console.log('添加Banner图片');
        alert('添加Banner图片功能开发中...');
    }

    editBannerImage(id) {
        console.log('编辑Banner图片:', id);
        alert('编辑Banner图片功能开发中...');
    }

    deleteBannerImage(id) {
        if (confirm('确定要删除这个Banner图片吗？')) {
            console.log('删除Banner图片:', id);
            alert('Banner图片已删除！');
        }
    }

    toggleBannerStatus(id) {
        console.log('切换Banner状态:', id);
        alert('Banner状态已切换！');
    }

    // 大赛介绍功能
    formatText(command) {
        document.execCommand(command, false, null);
    }

    insertLink() {
        const url = prompt('请输入链接地址:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    insertImage() {
        const url = prompt('请输入图片地址:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    saveIntroduction() {
        const content = document.querySelector('[contenteditable="true"]').innerHTML;
        console.log('保存大赛介绍:', content);
        alert('大赛介绍保存成功！');
    }

    previewIntroduction() {
        console.log('预览大赛介绍');
        alert('预览大赛介绍功能开发中...');
    }

    // 通知公告功能
    addNotice() {
        console.log('发布新公告');
        alert('发布新公告功能开发中...');
    }

    editNotice(id) {
        console.log('编辑公告:', id);
        alert('编辑公告功能开发中...');
    }

    unpublishNotice(id) {
        if (confirm('确定要下线这个公告吗？')) {
            console.log('下线公告:', id);
            alert('公告已下线！');
        }
    }

    // 常见问题功能
    addFAQ() {
        console.log('添加问题');
        alert('添加问题功能开发中...');
    }

    editFAQ(id) {
        console.log('编辑问题:', id);
        alert('编辑问题功能开发中...');
    }

    hideFAQ(id) {
        if (confirm('确定要隐藏这个问题吗？')) {
            console.log('隐藏问题:', id);
            alert('问题已隐藏！');
        }
    }
}

// 导出模块
window.AdminSettings = AdminSettings;