// 证书管理模块
class CertificateManager {
    constructor() {
        this.certificateRules = [
            {
                id: 1,
                eventName: '2025年1月安全挑战赛',
                condition: '前10名',
                templateName: '优秀奖证书',
                issueTime: '2025-02-01 10:00'
            }
        ];

        this.certificateTemplates = [
            {
                id: 1,
                name: '优秀奖证书',
                image: null,
                fields: {
                    eventName: { x: 100, y: 200 },
                    theme: { x: 100, y: 250 },
                    time: { x: 100, y: 300 },
                    username: { x: 100, y: 350 },
                    award: { x: 100, y: 400 }
                }
            }
        ];
    }

    // 渲染证书发放规则列表
    renderCertificateRulesList() {
        const tbody = document.querySelector('#certificates .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.certificateRules.map(rule => `
            <tr>
                <td>${rule.eventName}</td>
                <td>${rule.condition}</td>
                <td>${rule.templateName}</td>
                <td>${rule.issueTime}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="editCertificateRule(${rule.id})">编辑</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCertificateRule(${rule.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 渲染证书模板列表
    renderCertificateTemplatesList() {
        const container = document.querySelector('#templates .template-grid');
        if (!container) return;

        container.innerHTML = this.certificateTemplates.map(template => `
            <div class="template-card">
                <div class="template-preview">
                    <div class="template-placeholder">证书模板占位</div>
                </div>
                <div class="template-info">
                    <h4>${template.name}</h4>
                    <div class="template-actions">
                        <button class="btn btn-outline btn-sm" onclick="previewTemplate(${template.id})">预览</button>
                        <button class="btn btn-outline btn-sm" onclick="editCertificateTemplate(${template.id})">编辑</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCertificateTemplate(${template.id})">删除</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 打开证书发放规则弹窗
    openCertificateRuleModal() {
        const modal = document.getElementById('certificateRuleModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // 关闭证书发放规则弹窗
    closeCertificateRuleModal() {
        document.getElementById('certificateRuleModal').classList.remove('show');
    }

    // 保存证书发放规则
    saveCertificateRule() {
        const modal = document.getElementById('certificateRuleModal');
        const eventSelect = modal.querySelector('select');
        const conditionInput = modal.querySelector('.condition-input.active input');
        const templateSelect = modal.querySelectorAll('select')[1];

        if (!eventSelect.value || !conditionInput.value || !templateSelect.value) {
            alert('请填写完整信息');
            return;
        }

        const newRule = {
            id: Date.now(),
            eventName: eventSelect.options[eventSelect.selectedIndex].text,
            condition: `前${conditionInput.value}名`,
            templateName: templateSelect.options[templateSelect.selectedIndex].text,
            issueTime: new Date().toLocaleString()
        };

        this.certificateRules.push(newRule);
        this.renderCertificateRulesList();
        this.closeCertificateRuleModal();
        alert('证书发放规则保存成功！');
    }

    // 切换条件输入
    toggleConditionInput(type) {
        document.querySelectorAll('.condition-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.condition-input').forEach(input => input.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(`${type}Condition`).classList.add('active');
    }


    // 删除证书发放规则
    deleteCertificateRule(id) {
        if (confirm('确定要删除这个发放规则吗？')) {
            this.certificateRules = this.certificateRules.filter(r => r.id !== id);
            this.renderCertificateRulesList();
            alert('发放规则删除成功！');
        }
    }

    // 打开证书模板弹窗
    openTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // 关闭证书模板弹窗
    closeTemplateModal() {
        document.getElementById('templateModal').classList.remove('show');
    }

    // 保存证书模板
    saveTemplate() {
        const modal = document.getElementById('templateModal');
        const name = modal.querySelector('input[placeholder="请输入模板名称"]').value;
        const fileInput = modal.querySelector('input[type="file"]');

        if (!name.trim()) {
            alert('请输入模板名称');
            return;
        }

        const newTemplate = {
            id: Date.now(),
            name: name.trim(),
            image: fileInput.files[0] || null,
            fields: {
                eventName: { x: 100, y: 200 },
                theme: { x: 100, y: 250 },
                time: { x: 100, y: 300 },
                username: { x: 100, y: 350 },
                award: { x: 100, y: 400 }
            }
        };

        this.certificateTemplates.push(newTemplate);
        this.renderCertificateTemplatesList();
        this.closeTemplateModal();
        alert('证书模板保存成功！');
    }


    // 编辑证书模板
    editCertificateTemplate(id) {
        alert('编辑证书模板功能');
    }

    // 删除证书模板
    deleteCertificateTemplate(id) {
        if (confirm('确定要删除这个证书模板吗？')) {
            this.certificateTemplates = this.certificateTemplates.filter(t => t.id !== id);
            this.renderCertificateTemplatesList();
            alert('证书模板删除成功！');
        }
    }

    // 预览证书图片
    previewCertificateImage(input) {
        const file = input.files[0];
        const preview = document.getElementById('certificatePreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<div class="certificate-placeholder">证书图片占位</div>';
        }
    }

    // 编辑证书发放规则
    editCertificateRule(id) {
        const rule = this.certificateRules.find(r => r.id === id);
        if (rule) {
            const modal = document.getElementById('editCertificateRuleModal');
            if (modal) {
                document.getElementById('editRuleEventName').value = rule.eventName;
                document.getElementById('editRankValue').value = rule.condition.replace('前', '').replace('名', '');
                modal.classList.add('show');
            }
        }
    }

    closeEditCertificateRuleModal() {
        document.getElementById('editCertificateRuleModal').classList.remove('show');
    }

    saveEditCertificateRule() {
        // 保存编辑的发放规则
        alert('发放规则保存成功！');
        this.closeEditCertificateRuleModal();
        this.renderCertificateRulesList();
    }

    toggleEditConditionInput(type) {
        document.querySelectorAll('#editCertificateRuleModal .condition-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('#editCertificateRuleModal .condition-input').forEach(input => input.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById(`edit${type.charAt(0).toUpperCase() + type.slice(1)}Condition`).classList.add('active');
    }

    // 预览证书模板
    previewTemplate(id) {
        const modal = document.getElementById('templatePreviewModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeTemplatePreviewModal() {
        document.getElementById('templatePreviewModal').classList.remove('show');
    }

    editTemplateFromPreview() {
        this.closeTemplatePreviewModal();
        setTimeout(() => {
            const modal = document.getElementById('templateEditModal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 200);
    }

    closeTemplateEditModal() {
        document.getElementById('templateEditModal').classList.remove('show');
    }

    previewTemplateDesign() {
        // 从编辑模式切换到预览模式
        this.closeTemplateEditModal();
        setTimeout(() => {
            const modal = document.getElementById('templatePreviewModal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 200);
    }

    saveTemplateDesign() {
        alert('证书模板保存成功！');
        this.closeTemplateEditModal();
        this.renderCertificateTemplatesList();
    }

    resetTemplateFields() {
        if (confirm('确定要重置所有字段位置吗？')) {
            const canvas = document.getElementById('editCanvas');
            const fields = canvas.querySelectorAll('.draggable-field');
            fields.forEach(field => field.remove());
            alert('字段位置已重置！');
        }
    }

    // 拖拽功能
    dragField(event) {
        event.dataTransfer.setData('text/plain', event.target.dataset.field);
    }

    allowDrop(event) {
        event.preventDefault();
    }

    dropField(event) {
        event.preventDefault();
        const fieldType = event.dataTransfer.getData('text/plain');
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.createDraggableField(fieldType, x, y, canvas);
    }

    createDraggableField(fieldType, x, y, canvas) {
        const field = document.createElement('div');
        field.className = 'draggable-field';
        field.style.left = x + 'px';
        field.style.top = y + 'px';
        field.textContent = this.getFieldDisplayName(fieldType);
        field.dataset.field = fieldType;
        
        // 添加拖拽功能
        this.makeDraggable(field);
        
        // 添加调整大小功能
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        field.appendChild(resizeHandle);
        
        canvas.appendChild(field);
    }

    getFieldDisplayName(fieldType) {
        const names = {
            'eventName': '竞赛名称',
            'theme': '主题',
            'time': '时间',
            'username': '用户名',
            'award': '奖项'
        };
        return names[fieldType] || fieldType;
    }

    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left);
            startTop = parseInt(element.style.top);
            
            element.classList.add('selected');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('selected');
            }
        });

        // 添加双击删除功能
        element.addEventListener('dblclick', () => {
            if (confirm('确定要删除这个字段吗？')) {
                element.remove();
            }
        });
    }

    // 预览证书图片（用于创建模板）
    previewCertificateImage(input) {
        const file = input.files[0];
        const background = document.getElementById('createCertificateBackground');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                background.style.backgroundImage = `url(${e.target.result})`;
                background.style.backgroundSize = 'contain';
                background.style.backgroundRepeat = 'no-repeat';
                background.style.backgroundPosition = 'center';
                background.innerHTML = '';
            };
            reader.readAsDataURL(file);
        } else {
            background.style.backgroundImage = '';
            background.innerHTML = '<div class="certificate-placeholder">上传证书背景图片后，拖拽字段到此处</div>';
        }
    }

    // 保存模板时收集字段位置信息
    saveTemplate() {
        const modal = document.getElementById('templateModal');
        const name = document.getElementById('templateName').value;
        const fileInput = modal.querySelector('input[type="file"]');
        const canvas = document.getElementById('createCanvas');
        const fields = canvas.querySelectorAll('.draggable-field');

        if (!name.trim()) {
            alert('请输入模板名称');
            return;
        }

        // 收集字段位置信息
        const fieldPositions = {};
        fields.forEach(field => {
            const fieldType = field.dataset.field;
            fieldPositions[fieldType] = {
                x: parseInt(field.style.left),
                y: parseInt(field.style.top),
                width: field.offsetWidth,
                height: field.offsetHeight
            };
        });

        const newTemplate = {
            id: Date.now(),
            name: name.trim(),
            image: fileInput.files[0] || null,
            fields: fieldPositions
        };

        this.certificateTemplates.push(newTemplate);
        this.renderCertificateTemplatesList();
        this.closeTemplateModal();
        alert('证书模板保存成功！');
    }

    // 保存编辑的模板设计
    saveTemplateDesign() {
        const canvas = document.getElementById('editCanvas');
        const fields = canvas.querySelectorAll('.draggable-field');

        // 收集字段位置信息
        const fieldPositions = {};
        fields.forEach(field => {
            const fieldType = field.dataset.field;
            fieldPositions[fieldType] = {
                x: parseInt(field.style.left),
                y: parseInt(field.style.top),
                width: field.offsetWidth,
                height: field.offsetHeight
            };
        });

        // 这里应该更新对应的模板数据
        alert('证书模板保存成功！');
        this.closeTemplateEditModal();
        this.renderCertificateTemplatesList();
    }

    // 从创建模式预览模板
    previewTemplateFromCreate() {
        // 从创建模式切换到预览模式
        this.closeTemplateModal();
        setTimeout(() => {
            const modal = document.getElementById('templatePreviewModal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 200);
    }
}

 // 导出实例

 window.CertificateManager = new CertificateManager();
