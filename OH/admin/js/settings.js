// 网站配置管理模块
class SettingsManager {
    constructor() {
        this.currentTab = 'banner';
        this.banners = [
            {
                id: 1,
                title: '首页轮播图1',
                image: null,
                status: '启用',
                createTime: '2024-01-15 10:00:00'
            }
        ];
        
        this.introduction = {
            content: '<h2>OpenHarmony 社区创新奖励计划</h2><p>这是一个面向开发者的创新竞赛平台...</p>'
        };
        
        this.notices = [
            {
                id: 1,
                title: '竞赛报名开始通知',
                content: '第一届OpenHarmony安全挑战赛现已开放报名...',
                publishTime: '2024-01-20 14:00:00',
                status: '已发布'
            }
        ];
        
        this.faqs = [
            {
                id: 1,
                question: '如何参加竞赛？',
                answer: '首先需要注册账号，然后在竞赛页面点击报名...',
                status: '显示'
            }
        ];
    }

    // 切换配置标签
    switchConfigTab(tab) {
        this.currentTab = tab;
        
        // 更新标签状态
        document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // 显示对应内容
        document.querySelectorAll('.config-content').forEach(c => c.style.display = 'none');
        document.getElementById(`${tab}Config`).style.display = 'block';
        
        // 渲染对应内容
        switch(tab) {
            case 'banner':
                this.renderBannerList();
                break;
            case 'introduction':
                this.renderIntroduction();
                break;
            case 'notices':
                this.renderNoticesList();
                break;
            case 'faq':
                this.renderFAQList();
                break;
        }
    }

    // 渲染Banner列表
    renderBannerList() {
        const container = document.getElementById('bannerList');
        if (!container) return;

        container.innerHTML = this.banners.map(banner => `
            <div class="banner-item">
                <div class="banner-preview">
                    <div class="banner-placeholder" style="width: 200px; height: 66px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">
                        ${banner.image ? 'Banner图片' : '1920×630 PNG'}
                    </div>
                </div>
                <div class="banner-info">
                    <h4>${banner.title}</h4>
                    <p>创建时间：${banner.createTime}</p>
                    <p>状态：<span class="status-badge ${banner.status === '启用' ? 'status-published' : 'status-draft'}">${banner.status}</span></p>
                </div>
                <div class="banner-actions">
                    <button class="btn btn-outline btn-sm" onclick="editBannerImage(${banner.id})">编辑</button>
                    <button class="btn btn-outline btn-sm" onclick="toggleBannerStatus(${banner.id})">${banner.status === '启用' ? '禁用' : '启用'}</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBannerImage(${banner.id})">删除</button>
                </div>
            </div>
        `).join('');
    }

    // 渲染大赛介绍
    renderIntroduction() {
        const editor = document.getElementById('introductionEditor');
        if (editor) {
            editor.innerHTML = this.introduction.content;
        }
    }

    // 渲染通知公告列表
    renderNoticesList() {
        const tbody = document.querySelector('#noticesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.notices.map((notice, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${notice.title}</td>
                <td>${notice.publishTime}</td>
                <td>
                    <span class="status-badge ${notice.status === '已发布' ? 'status-published' : 'status-draft'}">
                        ${notice.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editNotice(${notice.id})">编辑</button>
                        ${notice.status === '已发布' ? 
                            `<button class="btn btn-outline btn-sm" onclick="unpublishNotice(${notice.id})">取消发布</button>` :
                            `<button class="btn btn-primary btn-sm" onclick="publishNotice(${notice.id})">发布</button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // 渲染FAQ列表
    renderFAQList() {
        const tbody = document.querySelector('#faqTable tbody');
        if (!tbody) return;

        tbody.innerHTML = this.faqs.map((faq, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${faq.question}</td>
                <td>${faq.answer.substring(0, 50)}${faq.answer.length > 50 ? '...' : ''}</td>
                <td>
                    <span class="status-badge ${faq.status === '显示' ? 'status-published' : 'status-draft'}">
                        ${faq.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="editFAQ(${faq.id})">编辑</button>
                        ${faq.status === '显示' ? 
                            `<button class="btn btn-outline btn-sm" onclick="hideFAQ(${faq.id})">隐藏</button>` :
                            `<button class="btn btn-primary btn-sm" onclick="showFAQ(${faq.id})">显示</button>`
                        }
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Banner管理功能
    addBannerImage() {
        const modal = document.getElementById('bannerModal');
        document.getElementById('bannerModalTitle').textContent = '添加Banner';
        document.getElementById('bannerForm').reset();
        document.getElementById('bannerPreview').innerHTML = '<div class="upload-placeholder">点击上传Banner图片<br><small>建议尺寸：1920×630，PNG格式</small></div>';
        modal.style.display = 'block';
        this.currentEditBannerId = null;
    }

    editBannerImage(id) {
        const banner = this.banners.find(b => b.id === id);
        if (banner) {
            const modal = document.getElementById('bannerModal');
            document.getElementById('bannerModalTitle').textContent = '编辑Banner';
            document.getElementById('bannerTitle').value = banner.title;
            modal.style.display = 'block';
            this.currentEditBannerId = id;
        }
    }

    deleteBannerImage(id) {
        if (confirm('确定要删除这个Banner吗？')) {
            this.banners = this.banners.filter(b => b.id !== id);
            this.renderBannerList();
            alert('Banner删除成功！');
        }
    }

    toggleBannerStatus(id) {
        const banner = this.banners.find(b => b.id === id);
        if (banner) {
            banner.status = banner.status === '启用' ? '禁用' : '启用';
            this.renderBannerList();
            alert(`Banner已${banner.status}！`);
        }
    }

    closeBannerModal() {
        document.getElementById('bannerModal').style.display = 'none';
    }

    previewBannerImage(input) {
        const file = input.files[0];
        const preview = document.getElementById('bannerPreview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 4px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = '<div class="upload-placeholder">点击上传Banner图片<br><small>建议尺寸：1920×630，PNG格式</small></div>';
        }
    }

    saveBanner() {
        const form = document.getElementById('bannerForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const bannerData = {
            title: form.bannerTitle.value,
            image: form.bannerImage.files[0] || null
        };

        if (this.currentEditBannerId) {
            // 编辑模式
            const bannerIndex = this.banners.findIndex(b => b.id === this.currentEditBannerId);
            if (bannerIndex !== -1) {
                this.banners[bannerIndex] = {
                    ...this.banners[bannerIndex],
                    ...bannerData
                };
            }
        } else {
            // 新建模式
            const newBanner = {
                id: Date.now(),
                ...bannerData,
                status: '启用',
                createTime: new Date().toLocaleString('zh-CN')
            };
            this.banners.push(newBanner);
        }

        this.renderBannerList();
        this.closeBannerModal();
        alert('Banner保存成功！');
    }

    // 富文本编辑器功能
    formatText(cmd) {
        document.execCommand(cmd, false, null);
        document.getElementById('introductionEditor').focus();
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
        const content = document.getElementById('introductionEditor').innerHTML;
        this.introduction.content = content;
        alert('大赛介绍保存成功！');
    }

    previewIntroduction() {
        const content = document.getElementById('introductionEditor').innerHTML;
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <html>
                <head><title>大赛介绍预览</title></head>
                <body style="padding: 20px; font-family: Arial, sans-serif;">
                    ${content}
                </body>
            </html>
        `);
    }

    // 通知公告管理
    addNotice() {
        const modal = document.getElementById('noticeModal');
        document.getElementById('noticeModalTitle').textContent = '添加通知';
        document.getElementById('noticeForm').reset();
        modal.style.display = 'block';
        this.currentEditNoticeId = null;
    }

    editNotice(id) {
        const notice = this.notices.find(n => n.id === id);
        if (notice) {
            const modal = document.getElementById('noticeModal');
            document.getElementById('noticeModalTitle').textContent = '编辑通知';
            document.getElementById('noticeTitle').value = notice.title;
            document.getElementById('noticeContent').value = notice.content;
            modal.style.display = 'block';
            this.currentEditNoticeId = id;
        }
    }

    unpublishNotice(id) {
        if (confirm('确定要取消发布这个通知吗？')) {
            const notice = this.notices.find(n => n.id === id);
            if (notice) {
                notice.status = '草稿';
                this.renderNoticesList();
                alert('通知已取消发布！');
            }
        }
    }

    publishNotice(id) {
        const notice = this.notices.find(n => n.id === id);
        if (notice) {
            notice.status = '已发布';
            notice.publishTime = new Date().toLocaleString('zh-CN');
            this.renderNoticesList();
            alert('通知发布成功！');
        }
    }

    closeNoticeModal() {
        document.getElementById('noticeModal').style.display = 'none';
    }

    saveNotice() {
        const form = document.getElementById('noticeForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const noticeData = {
            title: form.noticeTitle.value,
            content: form.noticeContent.value
        };

        if (this.currentEditNoticeId) {
            // 编辑模式
            const noticeIndex = this.notices.findIndex(n => n.id === this.currentEditNoticeId);
            if (noticeIndex !== -1) {
                this.notices[noticeIndex] = {
                    ...this.notices[noticeIndex],
                    ...noticeData
                };
            }
        } else {
            // 新建模式
            const newNotice = {
                id: Date.now(),
                ...noticeData,
                status: '草稿',
                publishTime: ''
            };
            this.notices.push(newNotice);
        }

        this.renderNoticesList();
        this.closeNoticeModal();
        alert('通知保存成功！');
    }

    // FAQ管理
    addFAQ() {
        const modal = document.getElementById('faqModal');
        document.getElementById('faqModalTitle').textContent = '添加FAQ';
        document.getElementById('faqForm').reset();
        modal.style.display = 'block';
        this.currentEditFAQId = null;
    }

    editFAQ(id) {
        const faq = this.faqs.find(f => f.id === id);
        if (faq) {
            const modal = document.getElementById('faqModal');
            document.getElementById('faqModalTitle').textContent = '编辑FAQ';
            document.getElementById('faqQuestion').value = faq.question;
            document.getElementById('faqAnswer').value = faq.answer;
            modal.style.display = 'block';
            this.currentEditFAQId = id;
        }
    }

    hideFAQ(id) {
        const faq = this.faqs.find(f => f.id === id);
        if (faq) {
            faq.status = '隐藏';
            this.renderFAQList();
            alert('FAQ已隐藏！');
        }
    }

    showFAQ(id) {
        const faq = this.faqs.find(f => f.id === id);
        if (faq) {
            faq.status = '显示';
            this.renderFAQList();
            alert('FAQ已显示！');
        }
    }

    closeFAQModal() {
        document.getElementById('faqModal').style.display = 'none';
    }

    saveFAQ() {
        const form = document.getElementById('faqForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const faqData = {
            question: form.faqQuestion.value,
            answer: form.faqAnswer.value
        };

        if (this.currentEditFAQId) {
            // 编辑模式
            const faqIndex = this.faqs.findIndex(f => f.id === this.currentEditFAQId);
            if (faqIndex !== -1) {
                this.faqs[faqIndex] = {
                    ...this.faqs[faqIndex],
                    ...faqData
                };
            }
        } else {
            // 新建模式
            const newFAQ = {
                id: Date.now(),
                ...faqData,
                status: '显示'
            };
            this.faqs.push(newFAQ);
        }

        this.renderFAQList();
        this.closeFAQModal();
        alert('FAQ保存成功！');
    }

    // 退出登录
    handleLogout() {
        if (confirm('确定要退出登录吗？')) {
            // 这里可以添加退出登录的逻辑
            alert('已退出登录');
            window.location.href = '../index.html';
        }
    }
}

// 导出实例
window.SettingsManager = new SettingsManager();