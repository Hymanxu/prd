// 赛题管理功能模块
class AdminProblems {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
        document.addEventListener('click', (e) => {
            if (e.target.id === 'createProblemBtn') {
                this.openProblemModal();
            }
        });
    }

    openProblemModal() {
        const modal = document.getElementById('problemModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeProblemModal() {
        const modal = document.getElementById('problemModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('problemForm');
            if (form) {
                form.reset();
            }
        }
    }

    saveProblem() {
        const form = document.getElementById('problemForm');
        const formData = new FormData(form);

        console.log('保存赛题:', Object.fromEntries(formData));
        alert('赛题保存成功！');
        this.closeProblemModal();
    }

    batchImportProblems() {
        console.log('批量导入赛题');
        alert('批量导入功能开发中...');
    }

    publishProblem(id) {
        if (confirm('确定要发布这个赛题吗？')) {
            console.log('发布赛题:', id);
            alert('赛题发布成功！');
        }
    }

    unpublishProblem(id) {
        if (confirm('确定要取消发布这个赛题吗？')) {
            console.log('取消发布赛题:', id);
            alert('赛题已取消发布！');
        }
    }

    editProblem(id) {
        console.log('编辑赛题:', id);
        this.openProblemModal();
    }

    viewSubmissions(id) {
        console.log('查看赛题提交:', id);
    }
}

// 导出模块
window.AdminProblems = AdminProblems;