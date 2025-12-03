import{_ as i,c as a,o as n,ah as l,aC as p,aD as e}from"./chunks/framework.0jKhQnHV.js";const E=JSON.parse('{"title":"Vitepress 部署","description":"","frontmatter":{},"headers":[],"relativePath":"share/deploy/vitepress.md","filePath":"share/deploy/vitepress.md"}'),t={name:"share/deploy/vitepress.md"};function h(k,s,r,g,d,c){return n(),a("div",null,[...s[0]||(s[0]=[l(`<h1 id="vitepress-部署" tabindex="-1">Vitepress 部署 <a class="header-anchor" href="#vitepress-部署" aria-label="Permalink to “Vitepress 部署”">​</a></h1><h2 id="场景" tabindex="-1">场景 <a class="header-anchor" href="#场景" aria-label="Permalink to “场景”">​</a></h2><ol><li>现有 github 组织 amyshengzr-fe 下的私人仓库 note</li><li>还有 github 组织 amyshengzr-fe 下的公开仓库 amyshengzr-fe.github.io</li><li>我希望在 github note 上提交代码到 main 分支，会自动触发构建</li><li>构建产物 dist 自动推送到 github 的 amyshengzr-fe.github.io 仓库</li></ol><h2 id="总体思路-简述" tabindex="-1">总体思路（简述） <a class="header-anchor" href="#总体思路-简述" aria-label="Permalink to “总体思路（简述）”">​</a></h2><ol><li>在 amyshengzr-fe/note 仓库里创建 GitHub Actions workflow，触发条件为 push 到 main 分支</li><li>workflow 会： <ul><li>checkout 源代码</li><li>安装依赖 / 执行构建（生成 dist 目录）</li><li>将 dist 目录的内容推送到目标公开仓库 amyshengzr-fe/amyshengzr-fe.github.io 的 main（或 gh-pages，但组织用户/项目 Pages 推荐 main 根目录）</li><li>目标仓库会被覆盖为 dist 内容（等同于把 Pages 的静态站点文件替换为最新构建），GitHub Pages 会自动发布。</li></ul></li></ol><h2 id="准备工作-必须" tabindex="-1">准备工作（必须） <a class="header-anchor" href="#准备工作-必须" aria-label="Permalink to “准备工作（必须）”">​</a></h2><ol><li><p>在组织 amyshengzr-fe 下创建目标公开仓库 amyshengzr-fe.github.io（如果已存在跳过）。</p></li><li><p>配置 amyshengzr-fe.github.io 仓库 Pages 设置：默认使用 main 分支的根（或你想用的分支）。</p></li><li><p>需求是推送到另一个仓库，默认的 <code>GITHUB_TOKEN</code> 只能推送到当前仓库，解决方案：使用 <code>PAT</code>，它允许 Actions 在 workflow 中访问另一个仓库，并且安全存储在 Secrets 里。</p><ul><li><strong>如何生成 PAT？</strong></li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>1. 登录 GitHub → 右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)</span></span>
<span class="line"><span>2. 选择 Expiration（有效期），例如 90 天或自定义</span></span>
<span class="line"><span>3. 选择 Scopes（权限）：勾选 repo（Full control of private repositories）或至少 repo:status, repo_deployment, public_repo, repo:invite 等能推送的权限。对于组织仓库，若使用组织内账号的 PAT，确保该账号对目标仓库有写权限。</span></span>
<span class="line"><span>4. 点击 Generate token，复制生成的字符串（只显示一次！）</span></span></code></pre></div><p><img src="`+p+`" alt="generate_pat" loading="lazy"></p></li><li><p>在 amyshengzr-fe/note 仓库设置一个 Secret，用于认证并向目标仓库推送：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>打开 note 仓库 → Settings → Secrets → Actions → New repository secret</span></span>
<span class="line"><span>名称：DEPLOY_TOKEN（名称同上面设置一致）</span></span>
<span class="line"><span>值：刚生成的 PAT</span></span>
<span class="line"><span>Workflow 中通过 \${{ secrets.DEPLOY_TOKEN }} 使用</span></span></code></pre></div><p><img src="`+e+`" alt="set_pat" loading="lazy"></p></li></ol><h2 id="代码配置" tabindex="-1">代码配置 <a class="header-anchor" href="#代码配置" aria-label="Permalink to “代码配置”">​</a></h2><p><strong>📁 项目结构</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>  ├── .github/          # GitHub 工作流配置</span></span>
<span class="line"><span>  ├── .vitepress/       # VitePress 配置和主题</span></span>
<span class="line"><span>  │   ├── config.mts    # 站点配置文件</span></span>
<span class="line"><span>  │   └── theme/        # 自定义主题</span></span>
<span class="line"><span>  ├── public/           # 静态资源</span></span>
<span class="line"><span>  ├── xxx/            # 文档文件夹</span></span>
<span class="line"><span>  └── xxx.md          # 网站首页</span></span></code></pre></div><ol><li><p>.vitepress -&gt; config.mts</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>export default defineConfig({</span></span>
<span class="line"><span> //决定了 HTML 文件中 CSS/JS 的引用路径,如果你没有设置 base，而 Pages URL 不是根路径 /，就会导致样式丢失</span></span>
<span class="line"><span> base: &quot;/&quot;,</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span>})</span></span></code></pre></div></li><li><p>.github -&gt; workflows -&gt; deploy.yml</p><div class="language-yml"><button title="Copy Code" class="copy"></button><span class="lang">yml</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Deploy VitePress site to GitHub Pages</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  push</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    branches</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">main</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 当 note 仓库的 main 分支有 push 时触发自动部署</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">permissions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  contents</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">write</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 允许 GitHub Actions 写入内容（推送代码、创建提交等）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">jobs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  deploy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    runs-on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">ubuntu-latest</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 使用 GitHub 提供的最新 Ubuntu 环境执行任务</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    steps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 1. Checkout 拉取当前 note 仓库源码</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">uses</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">actions/checkout@v3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 2. 安装 pnpm（Node 包管理器）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">uses</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">pnpm/action-setup@v2</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        with</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">          version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 3. 设置 Node.js 环境</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      #    同时支持 pnpm 缓存提升速度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">uses</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">actions/setup-node@v3</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        with</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">          node-version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">22</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">          cache</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;pnpm&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 4. 安装项目依赖（使用 pnpm）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">pnpm install</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 5. 构建 VitePress 网站</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      #    输出目录为 .vitepress/dist</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">pnpm run docs:build</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 6. 构建完成后，将 dist 推送到组织公开仓库：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      #    amyshengzr-fe/amyshengzr-fe.github.io（ GitHub Pages 仓库）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 注意：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # - 使用在 note 仓库 Secrets 中设置的 DEPLOY_TOKEN（PAT）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # - 这个 PAT 必须至少有 repo 权限</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Deploy to amyshengzr-fe.github.io</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        env</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">          GH_PAT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\${{ secrets.DEPLOY_TOKEN }}</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 从 note 仓库 Secrets 读取 PAT</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">        run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 进入构建后的 dist 目录</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          cd .vitepress/dist</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 初始化一个新的 git 仓库用于部署</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git init</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 确保存在 main 分支</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git checkout -b main</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 配置提交用户（GitHub Actions 专用）</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git config user.name &quot;github-actions&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git config user.email &quot;github-actions@github.com&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 添加 dist 中所有文件</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git add .</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 创建部署提交</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git commit -m &quot;Deploy from note&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 推送到公开仓库：amyshengzr-fe/amyshengzr-fe.github.io 的 main 分支</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          # 使用 PAT 作为密码进行认证</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">          git push --force &quot;https://x-access-token:\${GH_PAT}@github.com/amyshengzr-fe/amyshengzr-fe.github.io.git&quot; main</span></span></code></pre></div></li></ol>`,11)])])}const y=i(t,[["render",h]]);export{E as __pageData,y as default};
