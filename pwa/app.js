// LocalStorageのキー
const PROJECT_NAME_KEY = 'scrapbox_project_name';
const INCLUDE_URL_KEY = 'scrapbox_include_url';
const DEFAULT_PROJECT_NAME = 'piyoryyta';

// プロジェクト名を取得
function getProjectName() {
    try {
        return localStorage.getItem(PROJECT_NAME_KEY) || DEFAULT_PROJECT_NAME;
    } catch (error) {
        console.error('LocalStorage読み込みエラー:', error);
        return DEFAULT_PROJECT_NAME;
    }
}

// プロジェクト名を保存
function saveProjectName(projectName) {
    try {
        localStorage.setItem(PROJECT_NAME_KEY, projectName);
        return true;
    } catch (error) {
        console.error('LocalStorage保存エラー:', error);
        return false;
    }
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
    try {
        const stored = localStorage.getItem(INCLUDE_URL_KEY);
        return stored === null ? true : stored === 'true';
    } catch (error) {
        console.error('LocalStorage読み込みエラー:', error);
        return true;
    }
}

// URLを含めるかどうかを保存
function saveIncludeUrl(includeUrl) {
    try {
        localStorage.setItem(INCLUDE_URL_KEY, includeUrl.toString());
        return true;
    } catch (error) {
        console.error('LocalStorage保存エラー:', error);
        return false;
    }
}

// Twitter URLかどうかを判定
function isTwitterUrl(url) {
    return url && (url.includes('twitter.com') || url.includes('x.com'));
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
                const success = saveProjectName(projectName);
                if (success) {
                    displayCurrentProject();
                    projectNameInput.value = '';
                    alert(`プロジェクト名を「${projectName}」に設定しました`);
                } else {
                    alert('プロジェクト名の保存に失敗しました');
                }
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
    try {
        const params = new URLSearchParams(window.location.search);
        const title = params.get('title');
        const text = params.get('text');
        const url = params.get('url');

        if (title || text || url) {
            // 共有データを受け取った場合
            const pageTitle = title || text || 'Untitled';
            const encodedTitle = encodeURIComponent(pageTitle);
            const projectName = getProjectName();

            // プロジェクト名の検証
            if (!projectName || projectName.trim() === '') {
                throw new Error('プロジェクト名が設定されていません');
            }

            // URLを含めるかどうかを判定
            let bodyContent = '';
            if (url && getIncludeUrl()) {
                if (isTwitterUrl(url)) {
                    // Twitterの場合：テキストとURLを両方含める
                    bodyContent = encodeURIComponent(`${text || ''}\n${url}`);
                } else {
                    // 通常の場合：URLのみ
                    bodyContent = encodeURIComponent(url);
                }
            }

            const scrapboxUrl = `https://scrapbox.io/${projectName}/${encodedTitle}?body=${bodyContent}`;

            document.getElementById('status').textContent = `"${pageTitle}" をScrapboxに送信中...`;

            // Scrapboxにリダイレクト
            window.location.href = scrapboxUrl;
        }
    } catch (error) {
        console.error('共有データ処理エラー:', error);
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = `エラーが発生しました: ${error.message}`;
            statusElement.style.backgroundColor = '#ffebee';
        }
    }
});
