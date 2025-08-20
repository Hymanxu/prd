// 提交审核管理模块
class SubmissionManager {
    constructor() {
        this.submissions = [
            {
                id: 1,
                commitId: 'a7b3c9',
                username: '张三',
                problemName: '内核缓冲区溢出检测',
                submitTime: '2025-01-15 14:30',
                type: '覆盖率提升',
                score: 85,
                status: '待审核'
            }
        ];
        this.selectedSubmissions = new Set();
    }

    // 渲染提交列表
    renderSubmissionsList() {
        const tbody = document.querySelector('#submissions .table tbody');
        if (!tbody) return;

        tbody.innerHTML = this.submissions.map(submission => `
            <tr>
                <td><input type="checkbox" onchange="toggleSubmissionSelection(${submission.id}, this.checked)"></td>
                <td><code>${submission.commitId}</code></td>
                <td>${submission.username}</td>
                <td>${submission.problemName}</td>
                <td>${submission.submitTime}</td>
                <td><span class="status-badge">${submission.type}</span></td>
                <td>${submission.score}</td>
                <td><span class="status-badge ${submission.status === '待审核' ? 'status-pending' : 'status-active'}">${submission.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="viewSubmissionDetail(${submission.id})">查看</button>
                    <button class="btn btn-outline btn-sm" onclick="reviewSubmission(${submission.id})">审核</button>
                </td>
            </tr>
        `).join('');
    }

    // 按竞赛筛选
    filterSubmissionsByEvent(eventId) {
        console.log('按竞赛筛选:', eventId);
        this.renderSubmissionsList();
    }

    // 按赛题筛选
    filterSubmissionsByProblem(problemId) {
        console.log('按赛题筛选:', problemId);
        this.renderSubmissionsList();
    }

    // 按状态筛选
    filterSubmissionsByStatus(status) {
        console.log('按状态筛选:', status);
        this.renderSubmissionsList();
    }

    // 切换提交选择
    toggleSubmissionSelection(id, checked) {
        if (checked) {
            this.selectedSubmissions.add(id);
        } else {
            this.selectedSubmissions.delete(id);
        }
    }

    // 全选/取消全选
    toggleAllSubmissions(checked) {
        const checkboxes = document.querySelectorAll('#submissions .table tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const id = parseInt(checkbox.getAttribute('onchange').match(/\d+/)[0]);
            this.toggleSubmissionSelection(id, checked);
        });
    }

    // 批量通过
    batchApproveSubmissions() {
        if (this.selectedSubmissions.size === 0) {
            alert('请选择要操作的提交');
            return;
        }
        
        if (confirm(`确定要批量通过选中的 ${this.selectedSubmissions.size} 个提交吗？`)) {
            this.selectedSubmissions.forEach(id => {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    submission.status = '已通过';
                }
            });
            this.selectedSubmissions.clear();
            this.renderSubmissionsList();
            alert('批量通过成功！');
        }
    }

    // 批量拒绝
    batchRejectSubmissions() {
        if (this.selectedSubmissions.size === 0) {
            alert('请选择要操作的提交');
            return;
        }
        
        if (confirm(`确定要批量拒绝选中的 ${this.selectedSubmissions.size} 个提交吗？`)) {
            this.selectedSubmissions.forEach(id => {
                const submission = this.submissions.find(s => s.id === id);
                if (submission) {
                    submission.status = '已拒绝';
                }
            });
            this.selectedSubmissions.clear();
            this.renderSubmissionsList();
            alert('批量拒绝成功！');
        }
    }

    // 查看提交详情
    viewSubmissionDetail(id) {
        const submission = this.submissions.find(s => s.id === id);
        if (submission) {
            const modal = document.getElementById('submissionDetailModal');
            // 填充详情信息
            document.getElementById('detailCommitId').textContent = submission.commitId;
            document.getElementById('detailUsername').textContent = submission.username;
            document.getElementById('detailProblem').textContent = submission.problemName;
            document.getElementById('detailSubmitTime').textContent = submission.submitTime;
            document.getElementById('detailType').textContent = submission.type;
            document.getElementById('detailScore').textContent = submission.score;
            
            modal.classList.add('show');
        }
    }

    // 关闭提交详情弹窗
    closeSubmissionDetailModal() {
        document.getElementById('submissionDetailModal').classList.remove('show');
    }

    // 从详情页面进入审核
    reviewSubmissionFromDetail() {
        this.closeSubmissionDetailModal();
        // 延迟一下再打开审核弹窗
        setTimeout(() => {
            const modal = document.getElementById('reviewModal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 200);
    }

    // 审核提交
    reviewSubmission(id) {
        const modal = document.getElementById('reviewModal');
        if (modal) {
            const submission = this.submissions.find(s => s.id === id);
            if (submission) {
                // 填充审核信息
                const infoItems = modal.querySelectorAll('.info-item span');
                if (infoItems.length >= 3) {
                    infoItems[0].textContent = submission.commitId;
                    infoItems[1].textContent = submission.username;
                    infoItems[2].textContent = submission.problemName;
                }
                modal.classList.add('show');
            }
        }
    }

    // 关闭审核弹窗
    closeReviewModal() {
        document.getElementById('reviewModal').classList.remove('show');
    }

    // 切换审核结果
    toggleReviewResult(result) {
        console.log('审核结果:', result);
    }

    // 提交审核
    submitReview() {
        const modal = document.getElementById('reviewModal');
        const scoreInput = modal.querySelector('input[type="number"]');
        const commentTextarea = modal.querySelector('textarea');
        const approvedRadio = modal.querySelector('input[value="approved"]');
        
        if (!scoreInput.value) {
            alert('请输入积分');
            return;
        }

        const result = approvedRadio.checked ? '已通过' : '已拒绝';
        alert(`审核${result}，积分：${scoreInput.value}`);
        this.closeReviewModal();
    }

    // 更新赛题选项
    updateProblemOptions() {
        const problemSelect = document.querySelector('#submissions select[onchange*="filterSubmissionsByProblem"]');
        if (problemSelect && window.ProblemManager) {
            // 清空现有选项
            problemSelect.innerHTML = '<option value="">全部赛题</option>';
            
            // 添加赛题选项
            if (window.ProblemManager.problems) {
                window.ProblemManager.problems.forEach(problem => {
                    const option = document.createElement('option');
                    option.value = problem.id;
                    option.textContent = problem.title;
                    problemSelect.appendChild(option);
                });
            }
        }
    }

    // 导出提交记录
    exportSubmissions() {
        console.log('导出提交记录');
        alert('导出功能开发中...');
    }

    // 重置筛选条件
    resetFilters() {
        const selects = document.querySelectorAll('#submissions select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });
        this.renderSubmissionsList();
    }
}

// 导出实例
window.SubmissionManager = new SubmissionManager();