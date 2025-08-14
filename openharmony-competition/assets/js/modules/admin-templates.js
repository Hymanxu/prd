// 证书模板功能模块
class AdminTemplates {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 绑定事件监听器
    }

    openTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeTemplateModal() {
        const modal = document.getElementById('templateModal');
        if (modal) {
            modal.classList.remove('show');
            const form = document.getElementById('templateForm');
            if (form) {
                form.reset();
            }
        }
    }

    saveTemplate() {
        const form = document.getElementById('templateForm');
        const formData = new FormData(form);

        console.log('保存证书模板:', Object.fromEntries(formData));
        alert('证书模板保存成功！');
        this.closeTemplateModal();
    }

    previewTemplate(id) {
        console.log('预览模板:', id);
        alert('预览模板功能开发中...');
    }

    editTemplate(id) {
        console.log('编辑模板:', id);
        this.openTemplateModal();
    }

    duplicateTemplate(id) {
        if (confirm('确定要复制这个模板吗？')) {
            console.log('复制模板:', id);
            alert('模板复制成功！');
        }
    }

    uploadCertificateImage(id) {
        console.log('上传证书图片:', id);
        const modal = document.getElementById('uploadCertificateModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeUploadCertificateModal() {
        const modal = document.getElementById('uploadCertificateModal');
        if (modal) {
            modal.classList.remove('show');
            // 重置预览
            document.getElementById('previewImage').style.display = 'none';
            document.getElementById('previewPlaceholder').style.display = 'block';
            document.getElementById('textOverlays').style.display = 'none';
        }
    }

    previewCertificateImage(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewImage = document.getElementById('previewImage');
                const placeholder = document.getElementById('previewPlaceholder');
                const textOverlays = document.getElementById('textOverlays');

                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                placeholder.style.display = 'none';
                textOverlays.style.display = 'block';

                // 初始化拖拽功能
                this.initDragAndDrop();
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    initDragAndDrop() {
        const textOverlays = document.querySelectorAll('.text-overlay');
        textOverlays.forEach(overlay => {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            overlay.addEventListener('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = overlay.getBoundingClientRect();
                const parentRect = overlay.parentElement.getBoundingClientRect();
                startLeft = rect.left - parentRect.left;
                startTop = rect.top - parentRect.top;

                overlay.style.zIndex = '1000';
                e.preventDefault();
            });

            document.addEventListener('mousemove', function (e) {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const newLeft = startLeft + deltaX;
                const newTop = startTop + deltaY;

                overlay.style.left = newLeft + 'px';
                overlay.style.top = newTop + 'px';
                overlay.style.transform = 'none';
            });

            document.addEventListener('mouseup', function () {
                if (isDragging) {
                    isDragging = false;
                    overlay.style.zIndex = '';
                }
            });
        });
    }

    saveCertificateTemplate() {
        // 收集文字位置信息
        const positions = {};
        document.querySelectorAll('.text-overlay').forEach(overlay => {
            const field = overlay.dataset.field;
            positions[field] = {
                left: overlay.style.left,
                top: overlay.style.top
            };
        });

        console.log('保存证书模板，文字位置:', positions);
        alert('证书模板保存成功！');
        this.closeUploadCertificateModal();
    }
}

// 导出模块
window.AdminTemplates = AdminTemplates;