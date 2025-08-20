/**
 * 模板加载器 - 负责动态加载和渲染HTML模板
 */
class TemplateLoader {
    constructor() {
        this.templates = new Map();
        this.loadedTemplates = new Set();
    }

    /**
     * 加载模板文件
     * @param {string} templateName 模板名称
     * @param {string} templatePath 模板路径
     */
    async loadTemplate(templateName, templatePath) {
        if (this.loadedTemplates.has(templateName)) {
            return this.templates.get(templateName);
        }

        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${templatePath}`);
            }
            
            const html = await response.text();
            this.templates.set(templateName, html);
            this.loadedTemplates.add(templateName);
            
            return html;
        } catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            return '';
        }
    }

    /**
     * 渲染模板到指定容器
     * @param {string} templateName 模板名称
     * @param {string} containerId 容器ID
     * @param {Object} data 数据对象
     */
    async renderTemplate(templateName, containerId, data = {}) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }

        const template = this.templates.get(templateName);
        if (!template) {
            console.error(`Template not found: ${templateName}`);
            return;
        }

        // 简单的模板变量替换
        let html = template;
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });

        container.innerHTML = html;
    }

    /**
     * 批量加载模板
     * @param {Array} templateConfigs 模板配置数组
     */
    async loadTemplates(templateConfigs) {
        const promises = templateConfigs.map(config => 
            this.loadTemplate(config.name, config.path)
        );
        
        await Promise.all(promises);
    }

    /**
     * 获取模板HTML
     * @param {string} templateName 模板名称
     */
    getTemplate(templateName) {
        return this.templates.get(templateName) || '';
    }

    /**
     * 创建DOM元素从模板
     * @param {string} templateName 模板名称
     * @param {Object} data 数据对象
     */
    createElement(templateName, data = {}) {
        const template = this.getTemplate(templateName);
        if (!template) return null;

        // 简单的模板变量替换
        let html = template;
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });

        const div = document.createElement('div');
        div.innerHTML = html;
        return div.firstElementChild;
    }
}

// 全局模板加载器实例
window.templateLoader = new TemplateLoader();