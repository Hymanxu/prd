// 提交审核模块
class SubmissionManager {
    constructor() {
        this.modalManager = window.ModalManager;
        this.submissions = [
            {
                id: 1,
                commitId: 'abc123def456',
                username: '张三',
                problemId: 1,
                problemName: 'OpenHarmony内核漏洞挖掘',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                submitTime: '2024-01-22 15:30:00',
                type: '0day漏洞挖掘',
                score: 100,
                status: '待审核',
                description: '发现了一个严重的内核漏洞...',
                files: ['exploit.c', 'poc.py']
            },
            {
                id: 2,
                commitId: 'def456ghi789',
                username: '李四',
                problemId: 2,
                problemName: 'HarmonyOS应用安全测试',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                submitTime: '2024-01-23 09:15:00',
                type: '覆盖率提升',
                score: 80,
                status: '已通过',
                description: '提升了应用测试覆盖率...',
                files: ['test_cases.js', 'coverage_report.html']
            },
            {
                id: 3,
                commitId: 'ghi789jkl012',
                username: '王五',
                problemId: 1,
                problemName: 'OpenHarmony内核漏洞挖掘',
                eventId: 1,
                eventName: 'OpenHarmony 安全挑战赛',
                submitTime: '2024-01-23 14:20:00',
                type: '已知漏洞检测',
                score: 60,
                status: '已拒绝',
                description: '检测到已知漏洞CVE-2023-1234...',
                files: ['detection_script.py'],
                rejectReason: '提交的漏洞已经被修复'
            }
        ];
        this.selectedEventId = null;
        this.selectedProblemId = null;
        this.selectedStatus = null;
        this.selectedSubmissions = new Set();
        this.currentReviewId = null;
    }

    // 渲染提交列表
    renderSubmissionsList() {
        const tbody = document.querySelector('#submissionsTable tbody');
        if (!tbody) return;

        let filteredSubmissions = this.submissions;
        
        // 按竞赛筛选
        if (this.selectedEventId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.eventId == this.selectedEventId);
        }
        
        // 按赛题筛选
        if (this.selectedProblemId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.problemId == this.selectedProblemId);
        }
        
        // 按状态筛选
        if (this.selectedStatus) {
            filteredSubmissions = filteredSubmissions.filter(s => s.status === this.selectedStatus);
        }

        tbody.innerHTML = filteredSubmissions.map((submission, index) => `
            <tr>
                <td>
                    <input type="checkbox" class="submission-checkbox" value="${submission.id}" 
                           onchange="toggleSubmissionSelection(${submission.id}, this.checked)">
                </td>
                <td>${index + 1}</td>
                <td>
                    <code class="commit-id">${submission.commitId}</code>
                </td>
                <td>${submission.username}</td>
                <td>${submission.problemName}</td>
                <td>${submission.submitTime}</td>
                <td>
                    <span class="type-badge type-${submission.type.replace(/\s+/g, '-')}">
                        ${submission.type}
                    </span>
                </td>
                <td>${submission.score}</td>
                <td>
                    <span class="status-badge ${submission.status === '已通过' ? 'status-published' : submission.status === '已拒绝' ? 'status-rejected' : 'status-draft'}">
                        ${submission.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="viewSubmissionDetail(${submission.id})">查看</button>
                        ${submission.status === '待审核' ? 
                            `<button class="btn btn-primary btn-sm" onclick="reviewSubmission(${submission.id})">审核</button>` :
                            ''
                        }
                    </div>
                </td>
            </tr>
        `).join('');

        // 更新批量操作按钮状态
        this.updateBatchButtons();
    }

    // 筛选功能
    filterSubmissionsByEvent(eventId) {
        this.selectedEventId = eventId;
        this.selectedProblemId = null; // 重置赛题筛选
        this.updateProblemOptions();
        this.renderSubmissionsList();
    }

    filterSubmissionsByProblem(problemId) {
        this.selectedProblemId = problemId;
        this.renderSubmissionsList();
    }

    filterSubmissionsByStatus(status) {
        this.selectedStatus = status;
        this.renderSubmissionsList();
    }

    // 更新赛题选项
    updateProblemOptions() {
        const problemSelect = document.getElementById('problemFilter');
        if (!problemSelect) return;

        const problemManager = window.ProblemManager;
        if (!problemManager) return;

        let problems = problemManager.problems;
        if (this.selectedEventId) {
            problems = problems.filter(p => p.eventId == this.selectedEventId);
        }

        problemSelect.innerHTML = '<option value="">全部赛题</option>' + 
            problems.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }

    // 选择提交记录
    toggleSubmissionSelection(id, checked) {
        if (checked) {
            this.selectedSubmissions.add(id);
        } else {
            this.selectedSubmissions.delete(id);
        }
        this.updateBatchButtons();
    }

    // 全选/取消全选
    toggleAllSubmissions(checked) {
        const checkboxes = document.querySelectorAll('.submission-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = checked;
            const id = parseInt(cb.value);
            if (checked) {
                this.selectedSubmissions.add(id);
            } else {
                this.selectedSubmissions.delete(id);
            }
        });
        this.updateBatchButtons();
    }

    // 更新批量操作按钮状态
    updateBatchButtons() {
        const batchApproveBtn = document.getElementById('batchApproveBtn');
        const batchRejectBtn = document.getElementById('batchRejectBtn');
        
        if (batchApproveBtn && batchRejectBtn) {
            const hasSelection = this.selectedSubmissions.size > 0;
            batchApproveBtn.disabled = !hasSelection;
            batchRejectBtn.disabled = !hasSelection;
        }
    }

    // 批量通过
    batchApproveSubmissions() {
        if (this.selectedSubmissions.size === 0) {
            alert('请先选择要操作的提交记录');
            return;
        }

        if (confirm(`确定要批量通过 ${this.selectedSubmissions.size} 个提交吗？`)) {
            this.selectedSubmissions.forEach(id => {
                const submission = this.submissions.find(s => s.id === id);
                if (submission && submission.status === '待审核') {
                    submission.status = '已通过';
                }
            });
            
            this.selectedSubmissions.clear();
            this.renderSubmissionsList();
            alert('批量审核通过成功！');
        }
    }

    // 批量拒绝
    batchRejectSubmissions() {
        if (this.selectedSubmissions.size === 0) {
            alert('请先选择要操作的提交记录');
            return;
        }

        const reason = prompt('请输入拒绝原因：');
        if (!reason) return;

        if (confirm(`确定要批量拒绝 ${this.selectedSubmissions.size} 个提交吗？`)) {
            this.selectedSubmissions.forEach(id => {
                const submission = this.submissions.find(s => s.id === id);
                if (submission && submission.status === '待审核') {
                    submission.status = '已拒绝';
                    submission.rejectReason = reason;
                }
            });
            
            this.selectedSubmissions.clear();
            this.renderSubmissionsList();
            alert('批量审核拒绝成功！');
        }
    }

    // 查看提交详情
    viewSubmissionDetail(id) {
        const submission = this.submissions.find(s => s.id === id);
        if (submission) {
            const modal = document.getElementById('submissionDetailModal');
            
            document.getElementById('detailCommitId').textContent = submission.commitId;
            document.getElementById('detailUsername').textContent = submission.username;
            document.getElementById('detailProblemName').textContent = submission.problemName;
            document.getElementById('detailSubmitTime').textContent = submission.submitTime;
            document.getElementById('detailType').textContent = submission.type;
            document.getElementById('detailScore').textContent = submission.score;
            document.getElementById('detailStatus').textContent = submission.status;
            document.getElementById('detailDescription').textContent = submission.description;
            
            // 显示文件列表
            const filesList = document.getElementById('detailFiles');
            filesList.innerHTML = submission.files.map(file => 
                `<li><a href="#" class="file-link">${file}</a></li>`
            ).join('');
            
            // 显示拒绝原因（如果有）
            const rejectReasonDiv = document.getElementById('detailRejectReason');
            if (submission.status === '已拒绝' && submission.rejectReason) {
                rejectReasonDiv.style.display = 'block';
                document.getElementById('rejectReasonText').textContent = submission.rejectReason;
            } else {
                rejectReasonDiv.style.display = 'none';
            }
            
            modal.style.display = 'block';
        }
    }

    closeSubmissionDetailModal() {
        document.getElementById('submissionDetailModal').style.display = 'none';
    }

    // 审核提交
    reviewSubmission(id) {
        this.currentReviewId = id;
        const submission = this.submissions.find(s => s.id === id);
        if (submission) {
            const modal = document.getElementById('reviewModal');
            
            document.getElementById('reviewCommitId').textContent = submission.commitId;
            document.getElementById('reviewUsername').textContent = submission.username;
            document.getElementById('reviewProblemName').textContent = submission.problemName;
            document.getElementById('reviewType').textContent = submission.type;
            document.getElementById('reviewDescription').textContent = submission.description;
            
            // 重置表单
            document.getElementById('reviewForm').reset();
            document.getElementById('reviewScore').value = submission.score;
            
            modal.style.display = 'block';
        }
    }

    closeReviewModal() {
        document.getElementById('reviewModal').style.display = 'none';
        this.currentReviewId = null;
    }

    // 提交审核结果
    submitReview() {
        const form = document.getElementById('reviewForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const result = form.reviewResult.value;
        const score = parseInt(form.reviewScore.value);
        const comment = form.reviewComment.value;

        const submission = this.submissions.find(s => s.id === this.currentReviewId);
        if (submission) {
            submission.status = result === 'approve' ? '已通过' : '已拒绝';
            submission.score = score;
            submission.reviewComment = comment;
            
            if (result === 'reject') {
                submission.rejectReason = comment;
            }
            
            this.renderSubmissionsList();
            this.closeReviewModal();
            alert(`审核${result === 'approve' ? '通过' : '拒绝'}成功！`);
        }
    }

    // 切换审核结果输入
    toggleReviewResult(result) {
        const scoreGroup = document.getElementById('scoreGroup');
        const commentLabel = document.getElementById('commentLabel');
        const commentTextarea = document.getElementById('reviewComment');
        
        if (result === 'approve') {
            scoreGroup.style.display = 'block';
            commentLabel.textContent = '审核意见：';
            commentTextarea.placeholder = '请输入审核意见（可选）';
            commentTextarea.required = false;
        } else {
            scoreGroup.style.display = 'none';
            commentLabel.textContent = '拒绝原因：';
            commentTextarea.placeholder = '请输入拒绝原因';
            commentTextarea.required = true;
        }
    }

    // 导出提交数据
    exportSubmissions() {
        let filteredSubmissions = this.submissions;
        
        if (this.selectedEventId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.eventId == this.selectedEventId);
        }
        
        if (this.selectedProblemId) {
            filteredSubmissions = filteredSubmissions.filter(s => s.problemId == this.selectedProblemId);
        }
        
        if (this.selectedStatus) {
            filteredSubmissions = filteredSubmissions.filter(s => s.status === this.selectedStatus);
        }

        const data = filteredSubmissions.map(s => ({
            'Commit ID': s.commitId,
            '用户名': s.username,
            '赛题': s.problemName,
            '提交时间': s.submitTime,
            '类型': s.type,
            '积分': s.score,
            '状态': s.status,
            '描述': s.description
        }));
        
        console.log('导出提交数据:', data);
        alert('提交数据导出成功！已下载到本地。');
    }

    // 重置筛选条件
    resetFilters() {
        this.selectedEventId = null;
        this.selectedProblemId = null;
        this.selectedStatus = null;
        
        // 重置表单
        const eventSelect = document.getElementById('eventFilter');
        const problemSelect = document.getElementById('problemFilter');
        const statusSelect = document.getElementById('statusFilter');
        
        if (eventSelect) eventSelect.value = '';
        if (problemSelect) problemSelect.value = '';
        if (statusSelect) statusSelect.value = '';
        
        this.updateProblemOptions();
        this.renderSubmissionsList();
    }
}

// 导出实例
window.SubmissionManager = new SubmissionManager();