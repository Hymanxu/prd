// 生成100个赛题数据的函数
function generateContestData() {
    const titles = [
        "内核缓冲区溢出检测", "应用权限提升测试", "网络协议安全测试", "系统服务接口测试", "文件系统安全测试",
        "驱动程序安全测试", "图形子系统安全测试", "多媒体框架安全测试", "进程间通信安全测试", "输入法框架安全测试",
        "蓝牙协议栈测试", "WiFi驱动安全测试", "USB接口安全测试", "音频子系统测试", "相机框架安全测试",
        "传感器数据安全测试", "电源管理安全测试", "内存管理器测试", "任务调度器安全测试", "中断处理安全测试",
        "设备树解析测试", "启动加载器安全测试", "固件更新安全测试", "加密算法实现测试", "随机数生成器测试",
        "证书验证机制测试", "数字签名验证测试", "密钥管理系统测试", "安全启动链测试", "TEE接口安全测试",
        "HiLog日志系统测试", "性能监控框架测试", "调试接口安全测试", "开发者选项安全测试", "ADB接口安全测试",
        "Shell命令注入测试", "配置文件解析测试", "环境变量安全测试", "临时文件安全测试", "符号链接攻击测试",
        "竞态条件检测", "死锁检测测试", "资源泄露检测", "栈溢出检测", "堆溢出检测",
        "格式化字符串漏洞测试", "整数溢出检测", "空指针解引用测试", "野指针访问检测", "双重释放检测",
        "内存越界访问测试", "缓冲区下溢检测", "类型混淆漏洞测试", "返回导向编程测试", "代码注入检测",
        "SQL注入防护测试", "XSS攻击防护测试", "CSRF攻击防护测试", "点击劫持防护测试", "会话固定攻击测试",
        "身份验证绕过测试", "授权机制绕过测试", "会话管理安全测试", "密码策略安全测试", "账户锁定机制测试",
        "API接口安全测试", "RESTful服务安全测试", "GraphQL接口安全测试", "WebSocket安全测试", "gRPC接口安全测试",
        "数据库连接安全测试", "ORM注入攻击测试", "NoSQL注入测试", "LDAP注入测试", "XML注入测试",
        "JSON解析安全测试", "XML解析安全测试", "YAML解析安全测试", "序列化安全测试", "反序列化攻击测试",
        "文件上传安全测试", "文件下载安全测试", "目录遍历攻击测试", "文件包含漏洞测试", "代码执行漏洞测试",
        "命令执行漏洞测试", "模板注入攻击测试", "SSTI攻击测试", "CSTI攻击测试", "表达式注入测试",
        "业务逻辑漏洞测试", "支付逻辑安全测试", "订单处理安全测试", "优惠券机制测试", "积分系统安全测试",
        "短信验证码安全测试", "邮箱验证安全测试", "图形验证码安全测试", "滑动验证安全测试", "生物识别安全测试"
    ];

    const descriptions = [
        "设计Fuzz测试用例，检测OpenHarmony内核中的缓冲区溢出漏洞，重点关注内存管理和系统调用功...",
        "构建测试用例，发现应用层权限管理漏洞，包括权限绕过和非法权限获取等安全问题...",
        "针对OpenHarmony网络协议栈进行Fuzz测试，发现协议解析和网络通信中的安全漏洞...",
        "对OpenHarmony系统服务接口进行Fuzz测试，发现服务间通信和权限验证的安全问题...",
        "针对文件系统操作进行Fuzz测试，检测文件访问控制、路径遍历等安全漏洞...",
        "对驱动程序进行Fuzz测试，发现驱动层接口和硬件交互中的安全风险...",
        "针对图形渲染和显示子系统进行Fuzz测试，发现图形处理中的内存安全问题...",
        "对音视频编解码和多媒体处理框架进行Fuzz测试，发现媒体文件解析中的安全漏洞...",
        "针对IPC机制进行Fuzz测试，发现进程间通信中的权限验证和数据泄露问题...",
        "对输入法框架进行Fuzz测试，检测输入处理和权限管理中的安全问题..."
    ];

    const difficulties = ["简单", "中等", "困难"];
    const categories = ["内核安全", "应用安全", "网络安全", "系统服务", "驱动安全", "多媒体安全", "通信安全", "存储安全"];

    const contests = [];
    
    for (let i = 0; i < 100; i++) {
        const submissions = Math.floor(Math.random() * 80) + 20; // 20-100人提交
        const passed = Math.floor(submissions * (Math.random() * 0.6 + 0.1)); // 10%-70%通过率
        const passRate = ((passed / submissions) * 100).toFixed(1) + "%";
        
        contests.push({
            id: i + 1,
            title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''),
            description: descriptions[i % descriptions.length],
            difficulty: difficulties[i % difficulties.length],
            category: categories[i % categories.length],
            submissions: submissions,
            passed: passed,
            passRate: passRate
        });
    }
    
    return contests;
}

// 生成赛题HTML的函数
function generateContestHTML(contests, startIndex = 0, count = 20) {
    let html = '';
    const endIndex = Math.min(startIndex + count, contests.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const contest = contests[i];
        const difficultyClass = contest.difficulty === '困难' ? 'tag-difficulty' : 
                               contest.difficulty === '中等' ? 'tag-medium' : 'tag-easy';
        
        html += `
            <div class="topic-item">
                <div class="topic-main">
                    <h3 class="topic-title">${contest.title}</h3>
                    <p class="topic-description">${contest.description}</p>
                    <div class="topic-tags">
                        <span class="tag ${difficultyClass}">${contest.difficulty}</span>
                    </div>
                </div>
                <div class="topic-stats">
                    <div class="stat-item">
                        <span class="stat-label">提交:</span>
                        <span class="stat-value">${contest.submissions}人</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">通过:</span>
                        <span class="stat-value">${contest.passed}人</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    return html;
}

// 为contests.html生成HTML的函数
function generateContestHTMLForContests(contests, startIndex = 0, count = 20) {
    let html = '';
    const endIndex = Math.min(startIndex + count, contests.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const contest = contests[i];
        const difficultyClass = contest.difficulty === '困难' ? 'tag-difficulty' : 
                               contest.difficulty === '中等' ? 'tag-medium' : 'tag-easy';
        
        html += `
            <div class="contest-item">
                <div class="contest-main">
                    <h3 class="contest-title">${contest.title}</h3>
                    <p class="contest-description">${contest.description}</p>
                    <div class="contest-tags">
                        <span class="tag ${difficultyClass}">${contest.difficulty}</span>
                    </div>
                </div>
                <div class="contest-stats">
                    <div class="stat-item">
                        <span class="stat-label">提交:</span>
                        <span class="stat-value">${contest.submissions}人</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">通过:</span>
                        <span class="stat-value">${contest.passed}人</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    return html;
}

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateContestData, generateContestHTML, generateContestHTMLForContests };
}