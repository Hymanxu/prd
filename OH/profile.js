document.addEventListener('DOMContentLoaded', function() {
    // 导航常驻效果
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.position = 'sticky';
        navbar.style.top = '0';
        navbar.style.zIndex = '1000';
    }

    // 菜单定位功能
    const menuItems = document.querySelectorAll('.menu-item');
    const sectionCards = document.querySelectorAll('.section-card, .profile-card');

    // 显示所有内容区域
    sectionCards.forEach(card => {
        card.style.display = 'block';
    });

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // 移除所有活动状态
            menuItems.forEach(menu => menu.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 滚动到目标区域
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 打开个人信息编辑弹窗
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 打开收款信息编辑弹窗
function openEditPaymentModal() {
    const modal = document.getElementById('editPaymentModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 打开更多提交记录弹窗
function openMoreSubmissionsModal() {
    const modal = document.getElementById('moreSubmissionsModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 打开证书预览弹窗
function openCertificateModal(certificateType) {
    const modal = document.getElementById('certificateModal');
    const certificateImage = document.getElementById('certificateImage');
    
    // 根据证书类型设置不同的图片
    let imageSrc = '';
    switch(certificateType) {
        case 'second':
            imageSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmOGZmIiBzdHJva2U9IiMwMDdiZmYiIHN0cm9rZS13aWR0aD0iNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YmZmIj7kuoznrYnlpZblhazkuaY8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+T3Blbkhhcm1vbnnnpL7ljLrliJvmlrDlpZblirHorqHliJIgNuaciOi1m+WFrOWFuOWQjeWQjTrluKDkuIk8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI3MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+MjAyNS0wNi0zMDwvdGV4dD4KPC9zdmc+';
            break;
        case 'third':
            imageSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmOGYwIiBzdHJva2U9IiNmZjY5MDAiIHN0cm9rZS13aWR0aD0iNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmY2OTAwIj7kuInnrYnlpZblhazkuaY8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+T3Blbkhhcm1vbnnnpL7ljLrliJvmlrDlpZblirHorqHliJIgN+aciOi1m+WFrOWFuOWQjeWQjTrluKDkuIk8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI3MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+MjAyNS0wNy0zMTwvdGV4dD4KPC9zdmc+';
            break;
        case 'participation':
            imageSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZmYwIiBzdHJva2U9IiMyOGE3NDUiIHN0cm9rZS13aWR0aD0iNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjhhNzQ1Ij7kvJjnp4Plj4LkuI7lpZY8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+T3Blbkhhcm1vbnnnpL7ljLrliJvmlrDlpZblirHorqHliJIgNeaciOi1m+WFrOWFuOWQjeWQjTrluKDkuIk8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI3MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiI+MjAyNS0wNS0zMTwvdGV4dD4KPC9zdmc+';
            break;
    }
    
    certificateImage.src = imageSrc;
    modal.style.display = 'block';
}

// 下载证书
function downloadCertificate() {
    const certificateImage = document.getElementById('certificateImage');
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = certificateImage.src;
    link.click();
}

// 关闭弹窗
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 发送验证码
function sendVerificationCode() {
    const btn = event.target;
    let countdown = 60;
    btn.disabled = true;
    btn.textContent = `${countdown}s后重发`;
    
    const timer = setInterval(() => {
        countdown--;
        btn.textContent = `${countdown}s后重发`;
        if (countdown <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.textContent = '发送验证码';
        }
    }, 1000);
}

// 保存个人信息
function saveProfile() {
    // 这里可以添加保存逻辑
    alert('个人信息保存成功！');
    closeModal('editProfileModal');
}

// 保存收款信息
function savePayment() {
    // 这里可以添加保存逻辑
    alert('收款信息保存成功！');
    closeModal('editPaymentModal');
}

// 绑定事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 关闭按钮事件
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // 取消按钮事件
    document.querySelectorAll('.btn-cancel').forEach(cancelBtn => {
        cancelBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // 保存按钮事件
    document.querySelectorAll('.btn-save').forEach(saveBtn => {
        saveBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal.id === 'editProfileModal') {
                saveProfile();
            } else if (modal.id === 'editPaymentModal') {
                savePayment();
            }
        });
    });

    // 下载按钮事件
    document.querySelector('.btn-download')?.addEventListener('click', downloadCertificate);

    // 验证码按钮事件
    document.querySelector('.verify-btn')?.addEventListener('click', sendVerificationCode);

    // 点击弹窗外部关闭
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});