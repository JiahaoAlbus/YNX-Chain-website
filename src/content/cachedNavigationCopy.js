const copy = {
  en: ["Offline cached page", "This is a previously cached page. When your connection returns, refresh to check the latest version.", "Refresh page"],
  "zh-CN": ["离线缓存页面", "当前显示的是此前缓存的页面。网络恢复后请刷新，以检查最新版本。", "刷新页面"],
  "zh-TW": ["離線快取頁面", "目前顯示的是先前快取的頁面。網路恢復後請重新整理，以檢查最新版本。", "重新整理頁面"],
  ja: ["オフラインのキャッシュページ", "以前に保存されたページを表示しています。接続が回復したら、更新して最新版を確認してください。", "ページを更新"],
  ko: ["오프라인 캐시 페이지", "이전에 저장된 페이지를 표시하고 있습니다. 연결이 복구되면 새로고침하여 최신 버전을 확인하세요.", "페이지 새로고침"],
  es: ["Página en caché sin conexión", "Se muestra una página guardada anteriormente. Cuando vuelva la conexión, actualiza para comprobar la versión más reciente.", "Actualizar página"],
  fr: ["Page hors ligne en cache", "Vous consultez une page enregistrée précédemment. Une fois la connexion rétablie, actualisez pour vérifier la dernière version.", "Actualiser la page"],
  de: ["Offline-Seite aus dem Cache", "Eine zuvor gespeicherte Seite wird angezeigt. Sobald die Verbindung wiederhergestellt ist, aktualisiere die Seite, um die neueste Version zu prüfen.", "Seite aktualisieren"],
  pt: ["Página em cache offline", "Esta é uma página guardada anteriormente. Quando a ligação voltar, atualize para verificar a versão mais recente.", "Atualizar página"],
  ru: ["Автономная страница из кеша", "Показана ранее сохранённая страница. Когда соединение восстановится, обновите её, чтобы проверить последнюю версию.", "Обновить страницу"],
  ar: ["صفحة محفوظة دون اتصال", "هذه صفحة محفوظة سابقًا. عند عودة الاتصال، حدّث الصفحة للتحقق من أحدث إصدار.", "تحديث الصفحة"],
  id: ["Halaman cache luring", "Ini adalah halaman yang tersimpan sebelumnya. Saat koneksi pulih, muat ulang untuk memeriksa versi terbaru.", "Muat ulang halaman"],
};

export function getCachedNavigationCopy(locale) {
  return copy[locale] || copy.en;
}
