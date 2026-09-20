import { getRuntimeCopy, loadRuntimeCopy } from "../content/runtimeLocaleContent.js";

export async function resolveRuntimeCopy(locale, load = loadRuntimeCopy, { timeoutMs = 5000 } = {}) {
  let timer;
  try {
    const immediate = getRuntimeCopy(locale);
    if (immediate) return { copy: immediate, failed: false };
    // Bound the page's wait without aborting a module import shared by other consumers.
    // Promise.race also observes a rejection arriving after the deadline.
    const pending = Promise.resolve().then(() => load(locale));
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Runtime language timed out")), timeoutMs);
    });
    const copy = await Promise.race([pending, deadline]);
    if (!copy) throw new Error("Runtime language unavailable");
    return { copy, failed: false };
  } catch {
    return { copy: getRuntimeCopy("en"), failed: true };
  } finally {
    clearTimeout(timer);
  }
}

const NOTICES = {
  en: ["Some interface text is temporarily in English because the language file could not load.", "Reload language"],
  "zh-CN": ["语言文件未能加载，部分界面文字暂以英文显示。", "重新加载语言"],
  "zh-TW": ["語言檔案未能載入，部分介面文字暫以英文顯示。", "重新載入語言"],
  ja: ["言語ファイルを読み込めなかったため、一部の表示は一時的に英語になっています。", "言語を再読み込み"],
  ko: ["언어 파일을 불러오지 못해 일부 화면이 일시적으로 영어로 표시됩니다.", "언어 다시 불러오기"],
  es: ["No se pudo cargar el archivo de idioma. Parte de la interfaz aparece temporalmente en inglés.", "Recargar idioma"],
  fr: ["Le fichier de langue n’a pas pu être chargé. Une partie de l’interface s’affiche temporairement en anglais.", "Recharger la langue"],
  de: ["Die Sprachdatei konnte nicht geladen werden. Teile der Oberfläche erscheinen vorübergehend auf Englisch.", "Sprache neu laden"],
  pt: ["Não foi possível carregar o idioma. Parte da interface aparece temporariamente em inglês.", "Recarregar idioma"],
  ru: ["Не удалось загрузить языковой файл. Часть интерфейса временно отображается на английском.", "Загрузить язык снова"],
  ar: ["تعذّر تحميل ملف اللغة. تظهر بعض نصوص الواجهة مؤقتًا بالإنجليزية.", "إعادة تحميل اللغة"],
  id: ["Berkas bahasa tidak dapat dimuat. Sebagian antarmuka sementara ditampilkan dalam bahasa Inggris.", "Muat ulang bahasa"],
};

export function getRuntimeLoadingNotice(locale) { return NOTICES[locale] || NOTICES.en; }
