// 赛题管理模块
class ProblemManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.problems = [
            {
                id: 1,
                name: 'OpenHarmony内核漏洞挖掘',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                difficulty: '困难',
                issueLink: 'https://github.com/example/issue/1',
                tags: ['内核安全', '漏洞挖掘'],
                description: '在OpenHarmony内核中发现并利用安全漏洞...',
                status: '已发布'
            },
            {
                id: 2,
                name: 'HarmonyOS应用安全测试',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                difficulty: '中等',
                issueLink: 'https://github.com/example/issue/2',
                tags: ['应用安全', '测试'],
                description: '对HarmonyOS应用进行全面的安全测试...',
                status: '草稿'
            }
        ];
        this.selectedEventId = null;
        this.currentEditId = null;
    }

    // 渲染赛题列表
    renderProblemsList() {
        const tbody = document.querySelector('#problemsTable tbody');
        if (!tbody) return;

        let filteredProblems = this.problems;
        if (this.selectedEventId) {
            filteredProblems = this.problems.filter(p => p.eventId == this.selectedEventId);
        }

        tbody.innerHTML = filteredProblems.map((problem, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${problem.name}</td>
                <td>${problem.eventName}</td>
                <td>
                    <span class="difficulty-badge difficulty-${problem.difficulty === '简单' ? 'easy' : problem.difficulty === '中等' ? 'medium' : 'hard'}">
                        ${problem.difficulty}
                    </span>
                </td>
                <td>
                    <a href="${problem.issueLink}" target="_blank" class="link">查看Issue</a>
                </td>
                <td>
                    <div class="tags">
                        ${problem.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editProblem(${problem.id})">编辑</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 按竞赛筛选赛题
    filterProblemsByEvent(eventId) {
        this.selectedEventId = eventId;
        this.renderProblemsList();
    }

    // 打开赛题弹窗
    openProblemModal(editId = null) {
        this.currentEditId = editId;
        const modal = document.getElementById('problemModal');
        const form = document.getElementById('problemForm');
        
        if (editId) {
            const problem = this.problems.find(p => p.id === editId);
            if (problem) {
                form.problemName.value = problem.name;
                form.eventId.value = problem.eventId;
                form.difficulty.value = problem.difficulty;
                form.issueLink.value = problem.issueLink;
                form.tags.value = problem.tags.join(', ');
                form.description.value = problem.description;
                document.getElementById('problemModalTitle').textContent = '编辑赛题';
            }
        } else {
            form.reset();
            document.getElementById('problemModalTitle').textContent = '创建赛题';
        }
        
        modal.style.display = 'block';
    }

    closeProblemModal() {
        document.getElementById('problemModal').style.display = 'none';
        this.currentEditId = null;
    }

    // 保存赛题
    saveProblem() {
        const form = document.getElementById('problemForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = {
            name: form.problemName.value,
            eventId: parseInt(form.eventId.value),
            difficulty: form.difficulty.value,
            issueLink: form.issueLink.value,
            tags: form.tags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
            description: form.description.value
        };

        // 获取竞赛名称
        const eventManager = window.EventManager;
        const event = eventManager.events.find(e => e.id === formData.eventId);
        formData.eventName = event ? event.name : '未知竞赛';

        if (this.currentEditId) {
            // 编辑模式
            const problemIndex = this.problems.findIndex(p => p.id === this.currentEditId);
            if (problemIndex !== -1) {
                this.problems[problemIndex] = {
                    ...this.problems[problemIndex],
                    ...formData
                };
            }
        } else {
            // 新建模式
            const newProblem = {
                id: Date.now(),
                ...formData,
                status: '草稿'
            };
            this.problems.push(newProblem);
        }

        this.renderProblemsList();
        this.closeProblemModal();
        alert('赛题保存成功！');
    }

    // 编辑赛题
    editProblem(id) {
        this.openProblemModal(id);
    }

    // 批量导入赛题
    batchImportProblems() {
        const modal = document.getElementById('batchImportModal');
        modal.style.display = 'block';
    }

    closeBatchImportModal() {
        document.getElementById('batchImportModal').style.display = 'none';
    }

    // 处理文件上传
    handleFileUpload(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.importProblemsData(data);
            } catch (error) {
                alert('文件格式错误，请上传有效的JSON文件');
            }
        };
        reader.readAsText(file);
    }

    // 导入赛题数据
    importProblemsData(data) {
        if (!Array.isArray(data)) {
            alert('数据格式错误，应为数组格式');
            return;
        }

        let importCount = 0;
        data.forEach(item => {
            if (item.name && item.eventId && item.difficulty) {
                const newProblem = {
                    id: Date.now() + importCount,
                    name: item.name,
                    eventId: parseInt(item.eventId),
                    eventName: item.eventName || '未知竞赛',
                    difficulty: item.difficulty,
                    issueLink: item.issueLink || '',
                    tags: Array.isArray(item.tags) ? item.tags : [],
                    description: item.description || '',
                    status: '草稿'
                };
                this.problems.push(newProblem);
                importCount++;
            }
        });

        this.renderProblemsList();
        this.closeBatchImportModal();
        alert(`成功导入 ${importCount} 个赛题！`);
    }

    // 下载导入模板
    downloadTemplate() {
        const template = [
            {
                name: "示例赛题1",
                eventId: 1,
                eventName: "示例竞赛",
                difficulty: "简单",
                issueLink: "https://github.com/example/issue/1",
                tags: ["标签1", "标签2"],
                description: "这是一个示例赛题的详细描述..."
            },
            {
                name: "示例赛题2",
                eventId: 1,
                eventName: "示例竞赛",
                difficulty: "中等",
                issueLink: "https://github.com/example/issue/2",
                tags: ["标签3", "标签4"],
                description: "这是另一个示例赛题的详细描述..."
            }
        ];

        const dataStr = JSON.stringify(template, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = '赛题导入模板.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // 发布赛题
    publishProblem(id) {
        if (confirm('确定要发布这个赛题吗？发布后参赛者即可看到。')) {
            const problem = this.problems.find(p => p.id === id);
            if (problem) {
                problem.status = '已发布';
                this.renderProblemsList();
                alert('赛题发布成功！');
            }
        }
    }

    // 取消发布赛题
    unpublishProblem(id) {
        if (confirm('确定要取消发布这个赛题吗？')) {
            const problem = this.problems.find(p => p.id === id);
            if (problem) {
                problem.status = '草稿';
                this.renderProblemsList();
                alert('赛题已取消发布！');
            }
        }
    }

    // 查看提交记录
    viewSubmissions(problemId) {
        console.log('查看赛题提交记录:', problemId);
        // 跳转到提交审核页面，并筛选该赛题
        const submissionsNav = document.querySelector('[data-section="submissions"]');
        if (submissionsNav) {
            submissionsNav.click();
            // 这里可以设置筛选条件
            setTimeout(() => {
                const submissionManager = window.SubmissionManager;
                if (submissionManager) {
                    submissionManager.filterSubmissionsByProblem(problemId);
                }
            }, 100);
        }
    }

    // 富文本编辑器功能
    formatDescription(cmd) {
        const editor = document.getElementById('descriptionEditor');
        if (editor) {
            document.execCommand(cmd, false, null);
            editor.focus();
        }
    }

    insertDescriptionLink() {
        const url = prompt('请输入链接地址:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    insertDescriptionImage() {
        const url = prompt('请输入图片地址:');
        if (url) {
            document.execCommand('insertImage', false, url);
        }
    }

    // 同步富文本编辑器内容到表单
    syncDescriptionContent() {
        const editor = document.getElementById('descriptionEditor');
        const textarea = document.getElementById('description');
        if (editor && textarea) {
            textarea.value = editor.innerHTML;
        }
    }
}

// 导出实例
window.ProblemManager = new ProblemManager();