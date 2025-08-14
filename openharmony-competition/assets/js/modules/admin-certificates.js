// 证书管理功能模块
class AdminCertificates {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    openCertificateRuleModal() {
        const modal = document.getElementById('certificateRuleModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeCertificateRuleModal() {
        const modal = document.getElementById('certificateRuleModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('certificateRuleForm');
            if (form) {
                form.reset();
            }
            // 隐藏所有条件输入框
            document.getElementById('rankCondition').style.display = 'none';
            document.getElementById('scoreCondition').style.display = 'none';
            document.getElementById('completionCondition').style.display = 'none';
        }
    }

    saveCertificateRule() {
        const form = document.getElementById('certificateRuleForm');
        const formData = new FormData(form);

        console.log('保存证书发放规则:', Object.fromEntries(formData));
        alert('证书发放规则保存成功！');
        this.closeCertificateRuleModal();
    }

    toggleConditionInput(conditionType) {
        // 隐藏所有条件输入框
        document.getElementById('rankCondition').style.display = 'none';
        document.getElementById('scoreCondition').style.display = 'none';
        document.getElementById('completionCondition').style.display = 'none';

        // 显示对应的条件输入框
        if (conditionType === 'rank') {
            document.getElementById('rankCondition').style.display = 'block';
        } else if (conditionType === 'score') {
            document.getElementById('scoreCondition').style.display = 'block';
        } else if (conditionType === 'completion') {
            document.getElementById('completionCondition').style.display = 'block';
        }
    }

    editCertificateRule(id) {
        console.log('编辑证书发放规则:', id);
        this.openCertificateRuleModal();
    }

    enableRule(id) {
        if (confirm('确定要启用这个发放规则吗？')) {
            console.log('启用规则:', id);
            alert('发放规则已启用！');
        }
    }

    disableRule(id) {
        if (confirm('确定要关闭这个发放规则吗？')) {
            console.log('关闭规则:', id);
            alert('发放规则已关闭！');
        }
    }

    openCertificateHistoryModal() {
        const modal = document.getElementById('certificateHistoryModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeCertificateHistoryModal() {
        const modal = document.getElementById('certificateHistoryModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// 导出模块
window.AdminCertificates = AdminCertificates;