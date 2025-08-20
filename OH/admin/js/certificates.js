// 证书管理模块
class CertificateManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.certificateRules = [
            {
                id: 1,
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                condition: '按排名',
                conditionValue: '前10名',
                templateId: 1,
                templateName: '金奖证书模板',
                issueTime: '2024-01-25 10:00:00',
                status: '已发放',
                recipientCount: 10
            },
            {
                id: 2,
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                condition: '按积分',
                conditionValue: '≥500分',
                templateId: 2,
                templateName: '参与证书模板',
                issueTime: '2024-01-26 15:30:00',
                status: '已发放',
                recipientCount: 45
            }
        ];

        this.certificateTemplates = [
            {
                id: 1,
                name: '金奖证书模板',
                image: null,
                fields: [
                    { name: '竞赛名称', x: 400, y: 200, width: 300, height: 40 },
                    { name: '用户名', x: 350, y: 300, width: 200, height: 40 },
                    { name: '奖项', x: 450, y: 350, width: 150, height: 40 }
                ],
                createTime: '2024-01-15 14:00:00',
                status: '启用'
            },
            {
                id: 2,
                name: '参与证书模板',
                image: null,
                fields: [
                    { name: '竞赛名称', x: 400, y: 180, width: 300, height: 40 },
                    { name: '用户名', x: 350, y: 280, width: 200, height: 40 },
                    { name: '时间', x: 400, y: 380, width: 250, height: 40 }
                ],
                createTime: '2024-01-16 09:30:00',
                status: '启用'
            }
        ];

        this.currentEditRuleId = null;
        this.currentEditTemplateId = null;
        this.selectedTemplate = null;
        this.isDragging = false;
        this.dragField = null;
    }

    // 渲染证书发放列表
    renderCertificateRulesList() {
        const tbody = document.querySelector('#certificateRulesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.certificateRules.map((rule, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${rule.eventName}</td>
                <td>${rule.condition}：${rule.conditionValue}</td>
                <td>${rule.templateName}</td>
                <td>${rule.issueTime}</td>
                <td>
                    <span class="status-badge ${rule.status === '已发放' ? 'status-published' : 'status-draft'}">
                        ${rule.status}
                    </span>
                </td>
                <td>${rule.recipientCount || 0}人</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editCertificateRule(${rule.id})">编辑</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCertificateRule(${rule.id})">删除</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 渲染证书模板列表
    renderCertificateTemplatesList() {
        const tbody = document.querySelector('#certificateTemplatesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.certificateTemplates.map((template, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${template.name}</td>
                <td>
                    <div class="template-preview" style="width: 80px; height: 45px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">
                        ${template.image ? '模板' : '暂无'}
                    </div>
                </td>
                <td>${template.fields.length}个字段</td>
                <td>${template.createTime}</td>
                <td>
                    <span class="status-badge ${template.status === '启用' ? 'status-published' : 'status-draft'}">
                        ${template.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editCertificateTemplate(${template.id})">编辑</button>
                        <button class="btn btn-outline btn-sm" onclick="previewTemplate(${template.id})">预览</button>
                        <button class="btn btn-outline btn-sm" onclick="duplicateTemplate(${template.id})">复制</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteCertificateTemplate(${template.id})">删除</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 证书发放规则管理
    openCertificateRuleModal(editId = null) {
        this.currentEditRuleId = editId;
        const modal = document.getElementById('certificateRuleModal');
        const form = document.getElementById('certificateRuleForm');
        
        if (editId) {
            const rule = this.certificateRules.find(r => r.id === editId);
            if (rule) {
                form.eventId.value = rule.eventId;
                form.conditionType.value = rule.condition;
                form.conditionValue.value = rule.conditionValue.replace(/[^\d]/g, '');
                form.templateId.value = rule.templateId;
                document.getElementById('ruleModalTitle').textContent = '编辑发放规则';
                this.toggleConditionInput(rule.condition);
            }
        } else {
            form.reset();
            document.getElementById('ruleModalTitle').textContent = '新建发放规则';
            this.toggleConditionInput('按排名');
        }
        
        modal.style.display = 'block';
    }

    closeCertificateRuleModal() {
        document.getElementById('certificateRuleModal').style.display = 'none';
        this.currentEditRuleId = null;
    }

    // 切换发放条件输入
    toggleConditionInput(type) {
        const valueInput = document.getElementById('conditionValue');
        const valueLabel = document.getElementById('conditionLabel');
        
        switch(type) {
            case '按排名':
                valueLabel.textContent = '排名范围：';
                valueInput.placeholder = '例如：10（前10名）';
                break;
            case '按积分':
                valueLabel.textContent = '最低积分：';
                valueInput.placeholder = '例如：500';
                break;
            case '按提交次数':
                valueLabel.textContent = '最少提交：';
                valueInput.placeholder = '例如：3';
                break;
        }
    }

    // 保存证书发放规则
    saveCertificateRule() {
        const form = document.getElementById('certificateRuleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const eventManager = window.EventManager;
        const event = eventManager.events.find(e => e.id == form.eventId.value);
        const template = this.certificateTemplates.find(t => t.id == form.templateId.value);
        
        const conditionType = form.conditionType.value;
        let conditionValue = form.conditionValue.value;
        
        // 格式化条件值显示
        switch(conditionType) {
            case '按排名':
                conditionValue = `前${conditionValue}名`;
                break;
            case '按积分':
                conditionValue = `≥${conditionValue}分`;
                break;
            case '按提交次数':
                conditionValue = `≥${conditionValue}次`;
                break;
        }

        const ruleData = {
            eventId: parseInt(form.eventId.value),
            eventName: event ? event.name : '未知竞赛',
            condition: conditionType,
            conditionValue: conditionValue,
            templateId: parseInt(form.templateId.value),
            templateName: template ? template.name : '未知模板'
        };

        if (this.currentEditRuleId) {
            // 编辑模式
            const ruleIndex = this.certificateRules.findIndex(r => r.id === this.currentEditRuleId);
            if (ruleIndex !== -1) {
                this.certificateRules[ruleIndex] = {
                    ...this.certificateRules[ruleIndex],
                    ...ruleData
                };
            }
        } else {
            // 新建模式
            const newRule = {
                id: Date.now(),
                ...ruleData,
                issueTime: '',
                status: '未发放',
                recipientCount: 0
            };
            this.certificateRules.push(newRule);
        }

        this.renderCertificateRulesList();
        this.closeCertificateRuleModal();
        alert('发放规则保存成功！');
    }

    // 编辑证书发放规则
    editCertificateRule(id) {
        this.openCertificateRuleModal(id);
    }

    // 删除证书发放规则
    deleteCertificateRule(id) {
        if (confirm('确定要删除这个发放规则吗？此操作不可恢复。')) {
            this.certificateRules = this.certificateRules.filter(r => r.id !== id);
            this.renderCertificateRulesList();
            alert('发放规则删除成功！');
        }
    }

    // 执行证书发放
    issueCertificates(ruleId) {
        const rule = this.certificateRules.find(r => r.id === ruleId);
        if (!rule) return;

        if (confirm(`确定要按照"${rule.condition}：${rule.conditionValue}"的条件发放证书吗？`)) {
            // 模拟发放逻辑
            let recipientCount = 0;
            switch(rule.condition) {
                case '按排名':
                    recipientCount = parseInt(rule.conditionValue.match(/\d+/)[0]);
                    break;
                case '按积分':
                    recipientCount = Math.floor(Math.random() * 50) + 10; // 模拟符合条件的人数
                    break;
                case '按提交次数':
                    recipientCount = Math.floor(Math.random() * 30) + 5;
                    break;
            }

            rule.status = '已发放';
            rule.issueTime = new Date().toLocaleString('zh-CN');
            rule.recipientCount = recipientCount;

            this.renderCertificateRulesList();
            alert(`证书发放成功！共发放给 ${recipientCount} 人。`);
        }
    }

    // 证书模板管理
    openTemplateModal(editId = null) {
        this.currentEditTemplateId = editId;
        const modal = document.getElementById('templateModal');
        const form = document.getElementById('templateForm');
        
        if (editId) {
            const template = this.certificateTemplates.find(t => t.id === editId);
            if (template) {
                form.templateName.value = template.name;
                document.getElementById('templateModalTitle').textContent = '编辑证书模板';
            }
        } else {
            form.reset();
            document.getElementById('templateModalTitle').textContent = '新建证书模板';
        }
        
        modal.style.display = 'block';
    }

    closeTemplateModal() {
        document.getElementById('templateModal').style.display = 'none';
        this.currentEditTemplateId = null;
    }

    // 保存证书模板
    saveTemplate() {
        const form = document.getElementById('templateForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const templateData = {
            name: form.templateName.value,
            image: form.templateImage.files[0] || null
        };

        if (this.currentEditTemplateId) {
            // 编辑模式
            const templateIndex = this.certificateTemplates.findIndex(t => t.id === this.currentEditTemplateId);
            if (templateIndex !== -1) {
                this.certificateTemplates[templateIndex] = {
                    ...this.certificateTemplates[templateIndex],
                    ...templateData
                };
            }
        } else {
            // 新建模式
            const newTemplate = {
                id: Date.now(),
                ...templateData,
                fields: [],
                createTime: new Date().toLocaleString('zh-CN'),
                status: '启用'
            };
            this.certificateTemplates.push(newTemplate);
        }

        this.renderCertificateTemplatesList();
        this.closeTemplateModal();
        alert('证书模板保存成功！');
    }

    // 编辑证书模板
    editCertificateTemplate(id) {
        const template = this.certificateTemplates.find(t => t.id === id);
        if (template) {
            this.selectedTemplate = template;
            this.openTemplateDesigner();
        }
    }

    // 打开模板设计器
    openTemplateDesigner() {
        const modal = document.getElementById('templateDesignerModal');
        const canvas = document.getElementById('templateCanvas');
        const fieldsPanel = document.getElementById('fieldsPanel');
        
        // 设置画布
        canvas.style.width = '800px';
        canvas.style.height = '600px';
        canvas.style.background = '#f0f0f0';
        canvas.style.position = 'relative';
        canvas.style.border = '1px solid #ddd';
        
        // 渲染字段
        this.renderTemplateFields();
        
        modal.style.display = 'block';
    }

    closeTemplateDesigner() {
        document.getElementById('templateDesignerModal').style.display = 'none';
        this.selectedTemplate = null;
    }

    // 渲染模板字段
    renderTemplateFields() {
        const canvas = document.getElementById('templateCanvas');
        const fieldsPanel = document.getElementById('fieldsPanel');
        
        if (!this.selectedTemplate) return;
        
        // 清空画布
        canvas.innerHTML = '';
        
        // 渲染字段到画布
        this.selectedTemplate.fields.forEach((field, index) => {
            const fieldElement = document.createElement('div');
            fieldElement.className = 'template-field';
            fieldElement.style.cssText = `
                position: absolute;
                left: ${field.x}px;
                top: ${field.y}px;
                width: ${field.width}px;
                height: ${field.height}px;
                border: 2px dashed #007bff;
                background: rgba(0, 123, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                font-size: 12px;
                color: #007bff;
            `;
            fieldElement.textContent = field.name;
            fieldElement.dataset.fieldIndex = index;
            
            // 添加拖拽事件
            fieldElement.addEventListener('mousedown', (e) => this.startDrag(e, index));
            
            canvas.appendChild(fieldElement);
        });
        
        // 渲染字段面板
        fieldsPanel.innerHTML = `
            <h4>可用字段</h4>
            <div class="available-fields">
                <div class="field-item" draggable="true" data-field="竞赛名称">竞赛名称</div>
                <div class="field-item" draggable="true" data-field="主题">主题</div>
                <div class="field-item" draggable="true" data-field="时间">时间</div>
                <div class="field-item" draggable="true" data-field="用户名">用户名</div>
                <div class="field-item" draggable="true" data-field="奖项">奖项</div>
            </div>
            <h4>已添加字段</h4>
            <div class="added-fields">
                ${this.selectedTemplate.fields.map((field, index) => `
                    <div class="added-field">
                        <span>${field.name}</span>
                        <button class="btn btn-sm btn-danger" onclick="removeTemplateField(${index})">删除</button>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 添加字段拖拽事件
        fieldsPanel.querySelectorAll('.field-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.field);
            });
        });
        
        // 画布接收拖拽
        canvas.addEventListener('dragover', (e) => e.preventDefault());
        canvas.addEventListener('drop', (e) => this.dropField(e));
    }

    // 开始拖拽字段
    startDrag(e, fieldIndex) {
        this.isDragging = true;
        this.dragField = fieldIndex;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        
        const field = this.selectedTemplate.fields[fieldIndex];
        this.dragStartLeft = field.x;
        this.dragStartTop = field.y;
        
        document.addEventListener('mousemove', this.handleDrag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        e.preventDefault();
    }

    // 处理拖拽
    handleDrag(e) {
        if (!this.isDragging || this.dragField === null) return;
        
        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;
        
        const field = this.selectedTemplate.fields[this.dragField];
        field.x = Math.max(0, this.dragStartLeft + deltaX);
        field.y = Math.max(0, this.dragStartTop + deltaY);
        
        this.renderTemplateFields();
    }

    // 结束拖拽
    endDrag() {
        this.isDragging = false;
        this.dragField = null;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.endDrag);
    }

    // 拖拽添加字段
    dropField(e) {
        e.preventDefault();
        const fieldName = e.dataTransfer.getData('text/plain');
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 检查是否已存在该字段
        if (this.selectedTemplate.fields.some(f => f.name === fieldName)) {
            alert('该字段已存在！');
            return;
        }
        
        const newField = {
            name: fieldName,
            x: Math.max(0, x - 75), // 居中
            y: Math.max(0, y - 20),
            width: 150,
            height: 40
        };
        
        this.selectedTemplate.fields.push(newField);
        this.renderTemplateFields();
    }

    // 删除模板字段
    removeTemplateField(index) {
        if (confirm('确定要删除这个字段吗？')) {
            this.selectedTemplate.fields.splice(index, 1);
            this.renderTemplateFields();
        }
    }

    // 保存模板设计
    saveTemplateDesign() {
        if (this.selectedTemplate) {
            alert('模板设计保存成功！');
            this.closeTemplateDesigner();
            this.renderCertificateTemplatesList();
        }
    }

    // 预览模板
    previewTemplate(id) {
        const template = this.certificateTemplates.find(t => t.id === id);
        if (template) {
            const modal = document.getElementById('templatePreviewModal');
            const preview = document.getElementById('templatePreview');
            
            // 生成预览HTML
            preview.innerHTML = `
                <div class="certificate-preview" style="width: 800px; height: 600px; background: #fff; border: 1px solid #ddd; position: relative; margin: 0 auto;">
                    <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-size: 24px; font-weight: bold;">证书预览</div>
                    ${template.fields.map(field => `
                        <div style="position: absolute; left: ${field.x}px; top: ${field.y}px; width: ${field.width}px; height: ${field.height}px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
                            ${field.name === '竞赛名称' ? 'OpenHarmony 安全挑战赛' :
                              field.name === '用户名' ? '张三' :
                              field.name === '奖项' ? '一等奖' :
                              field.name === '时间' ? '2024年1月' :
                              field.name === '主题' ? '系统安全与漏洞挖掘' : field.name}
                        </div>
                    `).join('')}
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    closeTemplatePreview() {
        document.getElementById('templatePreviewModal').style.display = 'none';
    }

    // 复制模板
    duplicateTemplate(id) {
        const template = this.certificateTemplates.find(t => t.id === id);
        if (template) {
            const newTemplate = {
                ...template,
                id: Date.now(),
                name: template.name + ' - 副本',
                createTime: new Date().toLocaleString('zh-CN'),
                fields: [...template.fields] // 深拷贝字段数组
            };
            
            this.certificateTemplates.push(newTemplate);
            this.renderCertificateTemplatesList();
            alert('模板复制成功！');
        }
    }

    // 删除证书模板
    deleteCertificateTemplate(id) {
        if (confirm('确定要删除这个证书模板吗？此操作不可恢复。')) {
            this.certificateTemplates = this.certificateTemplates.filter(t => t.id !== id);
            this.renderCertificateTemplatesList();
            alert('证书模板删除成功！');
        }
    }

    // 上传证书图片
    uploadCertificateImage(templateId) {
        const modal = document.getElementById('uploadCertificateModal');
        document.getElementById('uploadTemplateId').value = templateId;
        modal.style.display = 'block';
    }

    closeUploadCertificateModal() {
        document.getElementById('uploadCertificateModal').style.display = 'none';
    }

    // 预览证书图片
    previewCertificateImage(input) {
        const file = input.files[0];
        const preview = document.getElementById('certificateImagePreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<div class="upload-placeholder">点击上传证书背景图片<br><small>建议尺寸：800×600，PNG格式</small></div>';
        }
    }

    // 保存证书模板图片
    saveCertificateTemplate() {
        const form = document.getElementById('uploadCertificateForm');
        const templateId = parseInt(document.getElementById('uploadTemplateId').value);
        const file = form.certificateImage.files[0];
        
        if (!file) {
            alert('请选择要上传的图片');
            return;
        }
        
        const template = this.certificateTemplates.find(t => t.id === templateId);
        if (template) {
            template.image = file;
            this.renderCertificateTemplatesList();
            this.closeUploadCertificateModal();
            alert('证书背景图片上传成功！');
        }
    }
}

// 全局函数
window.removeTemplateField = function(index) {
    const certificateManager = window.CertificateManager;
    if (certificateManager) {
        certificateManager.removeTemplateField(index);
    }
};

// 导出实例
window.CertificateManager = new CertificateManager();