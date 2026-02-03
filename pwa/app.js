// LocalStorageのキー
const PROJECT_NAME_KEY = 'scrapbox_project_name';
const INCLUDE_URL_KEY = 'scrapbox_include_url';
const DEFAULT_PROJECT_NAME = 'piyoryyta';

// プロジェクト名を取得
function getProjectName() {
    return localStorage.getItem(PROJECT_NAME_KEY) || DEFAULT_PROJECT_NAME;
}

// プロジェクト名を保存
function saveProjectName(projectName) {
    localStorage.setItem(PROJECT_NAME_KEY, projectName);
}

// 現在のプロジェクト名を表示
function displayCurrentProject() {
    const projectName = getProjectName();
    const currentProjectElement = document.getElementById('currentProject');
    if (currentProjectElement) {
        currentProjectElement.textContent = projectName;
    }
}

// URLを含めるかどうかを取得
function getIncludeUrl() {
    const stored = localStorage.getItem(INCLUDE_URL_KEY);
    return stored === null ? true : stored === 'true';
}

// URLを含めるかどうかを保存
function saveIncludeUrl(includeUrl) {
    localStorage.setItem(INCLUDE_URL_KEY, includeUrl.toString());
}

// Service Workerの登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('Service Worker registered', reg))
        .catch(err => console.log('Service Worker registration failed', err));
}

// 共有データを受け取る
window.addEventListener('DOMContentLoaded', () => {
    // 現在のプロジェクト名を表示
    displayCurrentProject();

    // プロジェクト名保存ボタンのイベント
    const saveButton = document.getElementById('saveProject');
    const projectNameInput = document.getElementById('projectName');

    if (saveButton && projectNameInput) {
        saveButton.addEventListener('click', () => {
            const projectName = projectNameInput.value.trim();
            if (projectName) {
                saveProjectName(projectName);
                displayCurrentProject();
                projectNameInput.value = '';
                alert(`プロジェクト名を「${projectName}」に設定しました`);
            } else {
                alert('プロジェクト名を入力してください');
            }
        });
    }

    // URLを含めるトグルの初期化
    const includeUrlCheckbox = document.getElementById('includeUrl');
    if (includeUrlCheckbox) {
        includeUrlCheckbox.checked = getIncludeUrl();
        includeUrlCheckbox.addEventListener('change', (e) => {
            saveIncludeUrl(e.target.checked);
        });
    }

    // 共有データの処理
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const text = params.get('text');
    const url = params.get('url');

    if (title || text || url) {
        // 共有データを受け取った場合
        const pageTitle = title || text || 'Untitled';
        const encodedTitle = encodeURIComponent(pageTitle);
        const projectName = getProjectName();

        // URLを含めるかどうかを判定
        let bodyContent = '';
        if (url && getIncludeUrl()) {
            bodyContent = encodeURIComponent(url);
        }

        const scrapboxUrl = `https://scrapbox.io/${projectName}/${encodedTitle}?body=${bodyContent}`;

        document.getElementById('status').textContent = `"${pageTitle}" をScrapboxに送信中...`;

        // Scrapboxにリダイレクト
        window.location.href = scrapboxUrl;
    }
});
