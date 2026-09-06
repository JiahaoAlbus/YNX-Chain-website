import { DOCUMENT_LIBRARY } from './documentLibrary.js';

const LABEL_KEYS = ['title', 'lead', 'search', 'all', 'whitepapers', 'read', 'download', 'back', 'contents', 'version', 'updated', 'source', 'checksum', 'bytes', 'draft', 'archive', 'original', 'translationPending', 'readingNote', 'currentNetwork', 'notRecorded', 'noResults', 'reset', 'metadata', 'sourceLanguage', 'english', 'selectDocument', 'whitepaperLead', 'originalTitle'];
const LABELS = {
  en: ['Document library', 'Read complete source documents, technical drafts and archived references.', 'Search titles and descriptions', 'All documents', 'Whitepapers', 'Read document', 'Download original source', 'Back to documentation', 'On this page', 'Version', 'Last reviewed', 'Source snapshot', 'SHA-256', 'bytes', 'Technical draft', 'Source archive', 'Original text', 'Body translation pending', 'Before you read', 'Current public network', 'Not recorded in source', 'No matching documents', 'Clear search', 'Source and integrity', 'Body language', 'English', 'Choose a document', 'Four complete technical drafts, with their source versions and review status preserved.', 'Original source title'],
  'zh-CN': ['文档库', '直接阅读完整原稿、技术草案与历史参考资料。', '搜索标题和说明', '全部文档', '白皮书', '阅读文档', '下载原始文稿', '返回文档目录', '本页目录', '版本', '最后审阅', '来源快照', 'SHA-256', '字节', '技术草案', '原稿档案', '原文', '正文翻译待完成', '阅读前须知', '当前公共网络', '原稿未记录', '没有匹配的文档', '清除搜索', '来源与完整性', '正文语言', '英语', '选择文档', '完整阅读四份技术草案，保留来源版本和审阅状态。', '原稿标题'],
  'zh-TW': ['文件庫', '直接閱讀完整原稿、技術草案與歷史參考資料。', '搜尋標題與說明', '全部文件', '白皮書', '閱讀文件', '下載原始文稿', '返回文件目錄', '本頁目錄', '版本', '最後審閱', '來源快照', 'SHA-256', '位元組', '技術草案', '原稿檔案', '原文', '正文翻譯待完成', '閱讀前須知', '目前公共網路', '原稿未記錄', '沒有相符的文件', '清除搜尋', '來源與完整性', '正文語言', '英語', '選擇文件', '完整閱讀四份技術草案，保留來源版本與審閱狀態。', '原稿標題'],
  ja: ['ドキュメントライブラリ', '原文全文、技術草案、過去の参考資料を閲覧できます。', 'タイトルと説明を検索', 'すべての文書', 'ホワイトペーパー', '文書を読む', '原文をダウンロード', '文書一覧に戻る', 'このページの目次', 'バージョン', '最終レビュー', '出典スナップショット', 'SHA-256', 'バイト', '技術草案', '原文アーカイブ', '原文', '本文の翻訳は未完了', '読む前に', '現在の公開ネットワーク', '原文に記録なし', '一致する文書はありません', '検索をクリア', '出典と完全性', '本文の言語', '英語', '文書を選択', '4つの技術草案を、元のバージョンとレビュー状態を保ったまま全文で読めます。', '原文のタイトル'],
  ko: ['문서 라이브러리', '전체 원문, 기술 초안과 과거 참고 자료를 읽어 보세요.', '제목과 설명 검색', '모든 문서', '백서', '문서 읽기', '원본 다운로드', '문서 목록으로 돌아가기', '이 페이지의 목차', '버전', '최근 검토', '출처 스냅샷', 'SHA-256', '바이트', '기술 초안', '원문 보관 자료', '원문', '본문 번역 미완료', '읽기 전에', '현재 공개 네트워크', '원문에 기록 없음', '일치하는 문서가 없습니다', '검색 지우기', '출처 및 무결성', '본문 언어', '영어', '문서 선택', '출처 버전과 검토 상태를 유지한 기술 초안 4편을 전체 본문으로 읽을 수 있습니다.', '원문 제목'],
  es: ['Biblioteca de documentos', 'Lee fuentes completas, borradores técnicos y referencias archivadas.', 'Buscar títulos y descripciones', 'Todos los documentos', 'Libros blancos', 'Leer documento', 'Descargar fuente original', 'Volver a documentación', 'En esta página', 'Versión', 'Última revisión', 'Instantánea de origen', 'SHA-256', 'bytes', 'Borrador técnico', 'Archivo de fuentes', 'Texto original', 'Traducción del cuerpo pendiente', 'Antes de leer', 'Red pública actual', 'No consta en la fuente', 'No hay documentos coincidentes', 'Borrar búsqueda', 'Fuente e integridad', 'Idioma del cuerpo', 'Inglés', 'Elegir documento', 'Cuatro borradores técnicos completos conservan su versión de origen y estado de revisión.', 'Título de la fuente original'],
  fr: ['Bibliothèque documentaire', 'Consultez les sources intégrales, les projets techniques et les références archivées.', 'Rechercher titres et descriptions', 'Tous les documents', 'Livres blancs', 'Lire le document', 'Télécharger la source originale', 'Retour à la documentation', 'Sur cette page', 'Version', 'Dernière révision', 'Instantané source', 'SHA-256', 'octets', 'Projet technique', 'Archive source', 'Texte original', 'Traduction du corps en attente', 'Avant de lire', 'Réseau public actuel', 'Non indiqué dans la source', 'Aucun document correspondant', 'Effacer la recherche', 'Source et intégrité', 'Langue du corps', 'Anglais', 'Choisir un document', 'Quatre projets techniques intégraux, avec leur version source et leur statut de révision conservés.', 'Titre de la source originale'],
  de: ['Dokumentenbibliothek', 'Vollständige Quellen, technische Entwürfe und archivierte Referenzen lesen.', 'Titel und Beschreibungen suchen', 'Alle Dokumente', 'Whitepaper', 'Dokument lesen', 'Originalquelle herunterladen', 'Zur Dokumentation', 'Auf dieser Seite', 'Version', 'Zuletzt geprüft', 'Quellstand', 'SHA-256', 'Bytes', 'Technischer Entwurf', 'Quellarchiv', 'Originaltext', 'Übersetzung des Haupttextes ausstehend', 'Vor dem Lesen', 'Aktuelles öffentliches Netzwerk', 'In der Quelle nicht vermerkt', 'Keine passenden Dokumente', 'Suche löschen', 'Quelle und Integrität', 'Sprache des Haupttextes', 'Englisch', 'Dokument auswählen', 'Vier vollständige technische Entwürfe mit unveränderter Quellversion und dokumentiertem Prüfstatus.', 'Titel der Originalquelle'],
  pt: ['Biblioteca de documentos', 'Leia fontes completas, rascunhos técnicos e referências arquivadas.', 'Pesquisar títulos e descrições', 'Todos os documentos', 'Livros brancos', 'Ler documento', 'Baixar fonte original', 'Voltar à documentação', 'Nesta página', 'Versão', 'Última revisão', 'Instantâneo da fonte', 'SHA-256', 'bytes', 'Rascunho técnico', 'Arquivo de fontes', 'Texto original', 'Tradução do corpo pendente', 'Antes de ler', 'Rede pública atual', 'Não registrado na fonte', 'Nenhum documento encontrado', 'Limpar pesquisa', 'Fonte e integridade', 'Idioma do corpo', 'Inglês', 'Escolher documento', 'Quatro rascunhos técnicos completos preservam a versão de origem e o estado da revisão.', 'Título da fonte original'],
  ru: ['Библиотека документов', 'Читайте полные исходные документы, технические проекты и архивные материалы.', 'Поиск по названиям и описаниям', 'Все документы', 'Белые книги', 'Читать документ', 'Скачать оригинал', 'К документации', 'На этой странице', 'Версия', 'Последняя проверка', 'Снимок источника', 'SHA-256', 'байт', 'Технический проект', 'Архив источников', 'Исходный текст', 'Перевод основного текста не завершён', 'Перед чтением', 'Текущая публичная сеть', 'Не указано в источнике', 'Подходящих документов нет', 'Очистить поиск', 'Источник и целостность', 'Язык основного текста', 'Английский', 'Выбрать документ', 'Четыре полных технических проекта с сохранёнными версиями источников и статусами проверки.', 'Название оригинала'],
  ar: ['مكتبة الوثائق', 'اقرأ المصادر الكاملة والمسودات التقنية والمراجع المؤرشفة.', 'ابحث في العناوين والأوصاف', 'جميع الوثائق', 'الأوراق البيضاء', 'قراءة الوثيقة', 'تنزيل المصدر الأصلي', 'العودة إلى الوثائق', 'محتويات هذه الصفحة', 'الإصدار', 'آخر مراجعة', 'لقطة المصدر', 'SHA-256', 'بايت', 'مسودة تقنية', 'أرشيف المصادر', 'النص الأصلي', 'ترجمة المتن غير مكتملة', 'قبل القراءة', 'الشبكة العامة الحالية', 'غير مسجل في المصدر', 'لا توجد وثائق مطابقة', 'مسح البحث', 'المصدر وسلامة الملف', 'لغة المتن', 'الإنجليزية', 'اختر وثيقة', 'أربع مسودات تقنية كاملة مع الحفاظ على إصدار المصدر وحالة المراجعة.', 'عنوان المصدر الأصلي'],
  id: ['Pustaka dokumen', 'Baca sumber lengkap, draf teknis, dan referensi arsip.', 'Cari judul dan deskripsi', 'Semua dokumen', 'Buku putih', 'Baca dokumen', 'Unduh sumber asli', 'Kembali ke dokumentasi', 'Pada halaman ini', 'Versi', 'Terakhir ditinjau', 'Snapshot sumber', 'SHA-256', 'byte', 'Draf teknis', 'Arsip sumber', 'Teks asli', 'Terjemahan isi belum selesai', 'Sebelum membaca', 'Jaringan publik saat ini', 'Tidak tercatat di sumber', 'Tidak ada dokumen yang cocok', 'Hapus pencarian', 'Sumber dan integritas', 'Bahasa isi', 'Inggris', 'Pilih dokumen', 'Empat draf teknis lengkap dengan versi sumber dan status tinjauan yang dipertahankan.', 'Judul sumber asli'],
};

// Each row corresponds to a source record, whose stable id and digest live in DOCUMENT_LIBRARY.
const TITLES = {
  en: DOCUMENT_LIBRARY.map(document => document.title),
  'zh-CN': 'YNX 执行与局部费用市场|YNX StreamBFT 规范|交易核心、UltraLiquidity 与 FairFlow|YNX Chain 技术白皮书|合约验证|水龙头指南|开发入门|Foundry 快速开始|Hardhat 快速开始|Remix 快速开始|RPC 参考|JavaScript SDK|Python SDK|SDK 发布完整性|YNX Shop 开发指南|YNX Card 指南|YNX Cloud 指南|YNX 开发者指南|YNX DEX 指南|YNX Exchange 集成指南|YNX Quant 指南|YNX 验证者指南|API 参考|YNX Chain 品牌指南|YNX Chain 常见问题|YNX 公共术语表|事件沟通计划|公共文档与测试网发布计划|本地化术语包|YNX 宣传声明证据矩阵|YNX Chain 媒体资料|YNX 公开品牌事实|支持、安全报告、争议与退款|YNX Chain 官网集成交接|YNX 开发者|YNX DEX|YNX 经济模型|YNX Exchange|YNX 产品|YNX Quant|YNX 安全|YNX Trust|YNX Wallet|什么是 YNXT？|什么是 YNX Chain？|什么是 YNX Web4？|YNX 测试网指南'.split('|'),
  'zh-TW': 'YNX 執行與局部費用市場|YNX StreamBFT 規範|交易核心、UltraLiquidity 與 FairFlow|YNX Chain 技術白皮書|合約驗證|水龍頭指南|開發入門|Foundry 快速開始|Hardhat 快速開始|Remix 快速開始|RPC 參考|JavaScript SDK|Python SDK|SDK 發佈完整性|YNX Shop 開發指南|YNX Card 指南|YNX Cloud 指南|YNX 開發者指南|YNX DEX 指南|YNX Exchange 整合指南|YNX Quant 指南|YNX 驗證者指南|API 參考|YNX Chain 品牌指南|YNX Chain 常見問題|YNX 公共術語表|事件溝通計畫|公共文件與測試網發佈計畫|在地化術語包|YNX 宣傳聲明證據矩陣|YNX Chain 媒體資料|YNX 公開品牌事實|支援、安全報告、爭議與退款|YNX Chain 官網整合交接|YNX 開發者|YNX DEX|YNX 經濟模型|YNX Exchange|YNX 產品|YNX Quant|YNX 安全|YNX Trust|YNX Wallet|什麼是 YNXT？|什麼是 YNX Chain？|什麼是 YNX Web4？|YNX 測試網指南'.split('|'),
  ja: 'YNX 実行とローカル手数料市場|YNX StreamBFT 仕様|取引コア、UltraLiquidity、FairFlow|YNX Chain 技術ホワイトペーパー|コントラクト検証|Faucet ガイド|開発入門|Foundry クイックスタート|Hardhat クイックスタート|Remix クイックスタート|RPC リファレンス|JavaScript SDK|Python SDK|SDK リリースの完全性|YNX Shop 開発ガイド|YNX Card ガイド|YNX Cloud ガイド|YNX 開発者ガイド|YNX DEX ガイド|YNX Exchange 統合ガイド|YNX Quant ガイド|YNX バリデータガイド|API リファレンス|YNX Chain ブランドガイド|YNX Chain よくある質問|YNX 公開用語集|インシデント連絡計画|公開文書と Testnet の公開計画|ローカライズ用語集|YNX 宣伝表現と証拠の対応表|YNX Chain プレスキット|YNX 公開ブランド情報|サポート、安全性報告、紛争、返金|YNX Chain サイト統合の引継ぎ|YNX 開発者|YNX DEX|YNX 経済モデル|YNX Exchange|YNX 製品|YNX Quant|YNX セキュリティ|YNX Trust|YNX Wallet|YNXT とは？|YNX Chain とは？|YNX Web4 とは？|YNX Testnet ガイド'.split('|'),
  ko: 'YNX 실행 및 로컬 수수료 시장|YNX StreamBFT 명세|트레이딩 코어, UltraLiquidity 및 FairFlow|YNX Chain 기술 백서|컨트랙트 검증|Faucet 가이드|개발 시작하기|Foundry 빠른 시작|Hardhat 빠른 시작|Remix 빠른 시작|RPC 참조|JavaScript SDK|Python SDK|SDK 릴리스 무결성|YNX Shop 개발 가이드|YNX Card 가이드|YNX Cloud 가이드|YNX 개발자 가이드|YNX DEX 가이드|YNX Exchange 통합 가이드|YNX Quant 가이드|YNX 검증자 가이드|API 참조|YNX Chain 브랜드 가이드|YNX Chain 자주 묻는 질문|YNX 공개 용어집|사고 소통 계획|공개 문서 및 Testnet 출시 계획|현지화 용어집|YNX 홍보 주장과 증거 매트릭스|YNX Chain 보도 자료|YNX 공개 브랜드 정보|지원, 보안 보고, 분쟁 및 환불|YNX Chain 웹사이트 통합 인계|YNX 개발자|YNX DEX|YNX 경제 모델|YNX Exchange|YNX 제품|YNX Quant|YNX 보안|YNX Trust|YNX Wallet|YNXT란 무엇인가요?|YNX Chain이란 무엇인가요?|YNX Web4란 무엇인가요?|YNX Testnet 가이드'.split('|'),
  es: 'Ejecución y mercados de comisiones locales de YNX|Especificación de YNX StreamBFT|Núcleo de negociación, UltraLiquidity y FairFlow|Libro blanco técnico de YNX Chain|Verificación de contratos|Guía del Faucet|Primeros pasos|Inicio rápido con Foundry|Inicio rápido con Hardhat|Inicio rápido con Remix|Referencia de RPC|SDK de JavaScript|SDK de Python|Integridad de versiones del SDK|Guía de desarrollo de YNX Shop|Guía de YNX Card|Guía de YNX Cloud|Guía para desarrolladores de YNX|Guía de YNX DEX|Guía de integración de YNX Exchange|Guía de YNX Quant|Guía de validadores de YNX|Referencia de API|Guía de marca de YNX Chain|Preguntas frecuentes de YNX Chain|Glosario público de YNX|Plan de comunicación de incidentes|Plan de documentación pública y lanzamiento de Testnet|Terminología de localización|Matriz de pruebas de afirmaciones comerciales de YNX|Material de prensa de YNX Chain|Datos públicos de la marca YNX|Soporte, informes de seguridad, disputas y reembolsos|Traspaso de integración del sitio de YNX Chain|Desarrollo en YNX|YNX DEX|Economía de YNX|YNX Exchange|Productos YNX|YNX Quant|Seguridad de YNX|YNX Trust|YNX Wallet|¿Qué es YNXT?|¿Qué es YNX Chain?|¿Qué es YNX Web4?|Guía de YNX Testnet'.split('|'),
  fr: 'Exécution et marchés locaux des frais de YNX|Spécification YNX StreamBFT|Moteur de négociation, UltraLiquidity et FairFlow|Livre blanc technique YNX Chain|Vérification des contrats|Guide du Faucet|Premiers pas|Démarrage rapide avec Foundry|Démarrage rapide avec Hardhat|Démarrage rapide avec Remix|Référence RPC|SDK JavaScript|SDK Python|Intégrité des versions du SDK|Guide de développement YNX Shop|Guide YNX Card|Guide YNX Cloud|Guide des développeurs YNX|Guide YNX DEX|Guide d’intégration YNX Exchange|Guide YNX Quant|Guide des validateurs YNX|Référence API|Guide de marque YNX Chain|Questions fréquentes sur YNX Chain|Glossaire public YNX|Plan de communication des incidents|Plan de documentation publique et de lancement Testnet|Terminologie de localisation|Matrice des preuves des affirmations marketing YNX|Dossier de presse YNX Chain|Informations publiques sur la marque YNX|Assistance, signalements de sécurité, litiges et remboursements|Transmission pour l’intégration du site YNX Chain|Développement YNX|YNX DEX|Économie YNX|YNX Exchange|Produits YNX|YNX Quant|Sécurité YNX|YNX Trust|YNX Wallet|Qu’est-ce que YNXT ?|Qu’est-ce que YNX Chain ?|Qu’est-ce que YNX Web4 ?|Guide YNX Testnet'.split('|'),
  de: 'YNX-Ausführung und lokale Gebührenmärkte|YNX-StreamBFT-Spezifikation|Handelskern, UltraLiquidity und FairFlow|Technisches Whitepaper zu YNX Chain|Vertragsverifizierung|Faucet-Leitfaden|Erste Schritte|Schnellstart mit Foundry|Schnellstart mit Hardhat|Schnellstart mit Remix|RPC-Referenz|JavaScript-SDK|Python-SDK|Integrität von SDK-Veröffentlichungen|YNX-Shop-Entwicklungsleitfaden|YNX-Card-Leitfaden|YNX-Cloud-Leitfaden|YNX-Entwicklerleitfaden|YNX-DEX-Leitfaden|YNX-Exchange-Integrationsleitfaden|YNX-Quant-Leitfaden|YNX-Validator-Leitfaden|API-Referenz|YNX-Chain-Markenleitfaden|Häufige Fragen zu YNX Chain|Öffentliches YNX-Glossar|Kommunikationsplan für Vorfälle|Plan für öffentliche Dokumentation und Testnet-Start|Terminologie für die Lokalisierung|Nachweismatrix für YNX-Marketingaussagen|YNX-Chain-Pressemappe|Öffentliche Fakten zur Marke YNX|Support, Sicherheitsmeldungen, Streitfälle und Erstattungen|Übergabe für die YNX-Chain-Websiteintegration|Entwicklung auf YNX|YNX DEX|YNX-Wirtschaftsmodell|YNX Exchange|YNX-Produkte|YNX Quant|YNX-Sicherheit|YNX Trust|YNX Wallet|Was ist YNXT?|Was ist YNX Chain?|Was ist YNX Web4?|YNX-Testnet-Leitfaden'.split('|'),
  pt: 'Execução e mercados de taxas locais da YNX|Especificação YNX StreamBFT|Núcleo de negociação, UltraLiquidity e FairFlow|Livro branco técnico da YNX Chain|Verificação de contratos|Guia do Faucet|Primeiros passos|Início rápido com Foundry|Início rápido com Hardhat|Início rápido com Remix|Referência RPC|SDK JavaScript|SDK Python|Integridade das versões do SDK|Guia de desenvolvimento YNX Shop|Guia YNX Card|Guia YNX Cloud|Guia de desenvolvimento YNX|Guia YNX DEX|Guia de integração YNX Exchange|Guia YNX Quant|Guia de validadores YNX|Referência da API|Guia da marca YNX Chain|Perguntas frequentes sobre YNX Chain|Glossário público YNX|Plano de comunicação de incidentes|Plano de documentação pública e lançamento da Testnet|Terminologia de localização|Matriz de evidências das alegações de marketing YNX|Kit de imprensa YNX Chain|Fatos públicos da marca YNX|Suporte, relatórios de segurança, disputas e reembolsos|Repasse da integração do site YNX Chain|Desenvolvimento YNX|YNX DEX|Economia YNX|YNX Exchange|Produtos YNX|YNX Quant|Segurança YNX|YNX Trust|YNX Wallet|O que é YNXT?|O que é YNX Chain?|O que é YNX Web4?|Guia YNX Testnet'.split('|'),
  ru: 'Исполнение YNX и локальные рынки комиссий|Спецификация YNX StreamBFT|Торговое ядро, UltraLiquidity и FairFlow|Техническая белая книга YNX Chain|Проверка контрактов|Руководство по Faucet|Начало работы|Быстрый старт с Foundry|Быстрый старт с Hardhat|Быстрый старт с Remix|Справочник RPC|JavaScript SDK|Python SDK|Целостность выпусков SDK|Руководство разработчика YNX Shop|Руководство YNX Card|Руководство YNX Cloud|Руководство разработчика YNX|Руководство YNX DEX|Руководство по интеграции YNX Exchange|Руководство YNX Quant|Руководство валидатора YNX|Справочник API|Руководство по бренду YNX Chain|Частые вопросы о YNX Chain|Публичный глоссарий YNX|План коммуникации при инцидентах|План публичной документации и запуска Testnet|Терминология локализации|Матрица доказательств маркетинговых заявлений YNX|Пресс-кит YNX Chain|Публичные факты о бренде YNX|Поддержка, сообщения о безопасности, споры и возвраты|Передача материалов для интеграции сайта YNX Chain|Разработка на YNX|YNX DEX|Экономика YNX|YNX Exchange|Продукты YNX|YNX Quant|Безопасность YNX|YNX Trust|YNX Wallet|Что такое YNXT?|Что такое YNX Chain?|Что такое YNX Web4?|Руководство YNX Testnet'.split('|'),
  ar: 'تنفيذ YNX وأسواق الرسوم المحلية|مواصفات YNX StreamBFT|نواة التداول وUltraLiquidity وFairFlow|الورقة البيضاء التقنية لـYNX Chain|التحقق من العقود|دليل الصنبور|البدء بالتطوير|البدء السريع باستخدام Foundry|البدء السريع باستخدام Hardhat|البدء السريع باستخدام Remix|مرجع RPC|حزمة JavaScript SDK|حزمة Python SDK|سلامة إصدارات SDK|دليل تطوير YNX Shop|دليل YNX Card|دليل YNX Cloud|دليل مطوري YNX|دليل YNX DEX|دليل تكامل YNX Exchange|دليل YNX Quant|دليل مدققي YNX|مرجع API|دليل علامة YNX Chain|الأسئلة الشائعة حول YNX Chain|مسرد YNX العام|خطة التواصل أثناء الحوادث|خطة الوثائق العامة وإطلاق Testnet|مصطلحات التوطين|مصفوفة أدلة الادعاءات التسويقية لـYNX|المواد الصحفية لـYNX Chain|حقائق العلامة العامة لـYNX|الدعم وتقارير الأمان والنزاعات والمبالغ المستردة|تسليم تكامل موقع YNX Chain|التطوير على YNX|YNX DEX|اقتصاد YNX|YNX Exchange|منتجات YNX|YNX Quant|أمان YNX|YNX Trust|YNX Wallet|ما هو YNXT؟|ما هي YNX Chain؟|ما هي YNX Web4؟|دليل YNX Testnet'.split('|'),
  id: 'Eksekusi YNX dan pasar biaya lokal|Spesifikasi YNX StreamBFT|Inti perdagangan, UltraLiquidity, dan FairFlow|Buku putih teknis YNX Chain|Verifikasi kontrak|Panduan Faucet|Memulai pengembangan|Mulai cepat dengan Foundry|Mulai cepat dengan Hardhat|Mulai cepat dengan Remix|Referensi RPC|SDK JavaScript|SDK Python|Integritas rilis SDK|Panduan pengembangan YNX Shop|Panduan YNX Card|Panduan YNX Cloud|Panduan pengembang YNX|Panduan YNX DEX|Panduan integrasi YNX Exchange|Panduan YNX Quant|Panduan validator YNX|Referensi API|Panduan merek YNX Chain|Pertanyaan umum YNX Chain|Glosarium publik YNX|Rencana komunikasi insiden|Rencana dokumentasi publik dan peluncuran Testnet|Terminologi pelokalan|Matriks bukti klaim pemasaran YNX|Kit pers YNX Chain|Fakta merek publik YNX|Dukungan, laporan keamanan, sengketa, dan pengembalian dana|Serah terima integrasi situs YNX Chain|Pengembangan YNX|YNX DEX|Ekonomi YNX|YNX Exchange|Produk YNX|YNX Quant|Keamanan YNX|YNX Trust|YNX Wallet|Apa itu YNXT?|Apa itu YNX Chain?|Apa itu YNX Web4?|Panduan YNX Testnet'.split('|'),
};

const NOTES = {
  en: [
    'The public network currently uses one authoritative producer and authenticated read-only followers. Public four-validator CometBFT, permissionless admission, staking and reward distribution are not open.',
    'This source preserves a historical draft. Its designs, examples and release statements are not current operating instructions or proof of an available service.',
    'The complete body below is the English original. Titles and reading notes are translated; the source body has not yet been translated into this language.',
    'Old ynxd, staking and validator commands do not match the current learning-node entry point. Do not use this archive to join or configure a public validator.',
    'SDK examples require the verified repository build or downloadable package. A package name in the archive does not establish npm or PyPI publication.',
    'Local contract tooling does not establish public execution of arbitrary Ethereum contracts. Check current network support before deployment.',
    'Read the complete technical draft, including its assumptions, risks and activation conditions.',
    'Archived development reference. Check current tools and public execution support before using examples.',
    'Archived product or operator guide. Review the current operating instructions before following any steps.',
    'Original interface catalogue. A listed endpoint does not establish public availability.',
    'Project source reference for terminology, product boundaries and public communication.',
    'Whitepapers|Developer references|Archived guides|API references|Project references',
  ],
  'zh-CN': [
    '当前公共网络使用一个权威出块节点和经过认证的只读跟随节点。公开四验证者 CometBFT、无许可准入、质押和奖励分发尚未开放。',
    '这份原稿保留历史草案。设计、示例和发布声明不代表当前操作步骤，也不能证明某项服务已可用。',
    '下方完整正文为英语原文。标题和阅读提示已翻译，正文尚未翻译为当前语言。',
    '旧 ynxd、质押和验证者命令与当前教学节点入口不匹配。不要依据此档案加入或配置公共验证者。',
    'SDK 示例应使用经核验的仓库构建或下载包。档案中的包名不能证明已在 npm 或 PyPI 发布。',
    '本地合约工具不代表公网支持执行任意 Ethereum 合约。部署前先核对当前网络能力。',
    '完整技术草案，包含设计假设、风险与启用条件。',
    '历史开发参考；使用示例前核对当前工具与公网执行支持。',
    '历史产品或运维指南；执行步骤前先阅读当前操作说明。',
    '原始接口目录；列出接口不代表该接口已在公网开放。',
    '项目原稿参考，涵盖术语、产品边界和公开沟通。',
    '白皮书|开发参考|历史指南|API 参考|项目资料',
  ],
  'zh-TW': [
    '目前公共網路使用一個權威出塊節點和經過認證的唯讀跟隨節點。公開四驗證者 CometBFT、無許可准入、質押和獎勵分發尚未開放。',
    '這份原稿保留歷史草案。設計、範例和發佈聲明不代表目前操作步驟，也不能證明某項服務已可用。',
    '下方完整正文為英語原文。標題和閱讀提示已翻譯，正文尚未翻譯為目前語言。',
    '舊 ynxd、質押和驗證者命令與目前教學節點入口不相符。不要依據此檔案加入或設定公共驗證者。',
    'SDK 範例應使用經核驗的儲存庫建置或下載套件。檔案中的套件名稱不能證明已在 npm 或 PyPI 發佈。',
    '本地合約工具不代表公共網路支援執行任意 Ethereum 合約。部署前先核對目前網路能力。',
    '完整技術草案，包含設計假設、風險與啟用條件。',
    '歷史開發參考；使用範例前核對目前工具與公共網路執行支援。',
    '歷史產品或運維指南；執行步驟前先閱讀目前操作說明。',
    '原始介面目錄；列出介面不代表該介面已在公共網路開放。',
    '專案原稿參考，涵蓋術語、產品邊界與公開溝通。',
    '白皮書|開發參考|歷史指南|API 參考|專案資料',
  ],
  ja: [
    '現在の公開ネットワークは、単一の権威あるブロック生成ノードと、認証済みの読み取り専用追従ノードで動作します。公開4バリデータ CometBFT、無許可参加、ステーキング、報酬配布は未開放です。',
    'この原文は過去の草案です。設計、例、公開状況の記述は、現在の操作手順やサービス提供の証明ではありません。',
    '以下の本文全文は英語の原文です。タイトルと読書上の注意は翻訳済みですが、本文は選択言語に未翻訳です。',
    '過去の ynxd、ステーキング、バリデータのコマンドは現在の学習用ノードと一致しません。この資料で公開バリデータへの参加や設定を行わないでください。',
    'SDK の例には検証済みのリポジトリビルドか配布パッケージを使用してください。記載のパッケージ名は npm や PyPI での公開を証明しません。',
    'ローカルのコントラクトツールは、公開ネットワークで任意の Ethereum コントラクトを実行できることを意味しません。デプロイ前に対応状況を確認してください。',
    '設計上の前提、リスク、有効化条件を含む技術草案の全文です。',
    '過去の開発参考資料です。例を使う前に現在のツールと公開実行の対応状況を確認してください。',
    '過去の製品・運用ガイドです。手順を実行する前に現在の操作説明を確認してください。',
    '原文のインターフェース一覧です。記載があっても公開利用可能とは限りません。',
    '用語、製品の制約、公開コミュニケーションに関するプロジェクト資料です。',
    'ホワイトペーパー|開発参考資料|過去のガイド|API リファレンス|プロジェクト資料',
  ],
  ko: [
    '현재 공개 네트워크는 하나의 권위 있는 블록 생성 노드와 인증된 읽기 전용 추종 노드로 작동합니다. 공개 4개 검증자 CometBFT, 무허가 참여, 스테이킹과 보상 분배는 아직 개방되지 않았습니다.',
    '이 원문은 과거 초안을 보존합니다. 설계, 예제와 출시 설명은 현재 운영 절차나 서비스 이용 가능성의 증거가 아닙니다.',
    '아래 전체 본문은 영어 원문입니다. 제목과 읽기 안내는 번역되었지만 본문은 현재 언어로 아직 번역되지 않았습니다.',
    '과거 ynxd, 스테이킹 및 검증자 명령은 현재 학습 노드 진입점과 다릅니다. 이 자료로 공개 검증자에 참여하거나 설정하지 마세요.',
    'SDK 예제는 검증된 저장소 빌드나 다운로드 패키지를 사용해야 합니다. 문서의 패키지 이름은 npm 또는 PyPI 출시를 증명하지 않습니다.',
    '로컬 컨트랙트 도구가 공개 네트워크의 임의 Ethereum 컨트랙트 실행 지원을 의미하지 않습니다. 배포 전에 현재 지원 범위를 확인하세요.',
    '설계 가정, 위험 및 활성화 조건을 포함하는 전체 기술 초안입니다.',
    '과거 개발 참고 자료입니다. 예제 사용 전에 현재 도구와 공개 실행 지원을 확인하세요.',
    '과거 제품 또는 운영 가이드입니다. 단계를 실행하기 전에 현재 운영 지침을 확인하세요.',
    '원본 인터페이스 목록입니다. 목록에 있다는 사실만으로 공개 이용 가능성이 증명되지 않습니다.',
    '용어, 제품 범위와 공개 소통에 관한 프로젝트 원문 자료입니다.',
    '백서|개발 참고 자료|과거 가이드|API 참조|프로젝트 자료',
  ],
  es: [
    'La red pública usa un productor autorizado y seguidores autenticados de solo lectura. No están abiertos CometBFT público con cuatro validadores, la admisión sin permiso, el staking ni la distribución de recompensas.',
    'Esta fuente conserva un borrador histórico. Sus diseños, ejemplos y declaraciones de lanzamiento no son instrucciones actuales ni pruebas de disponibilidad.',
    'El cuerpo completo que sigue es el original en inglés. Los títulos y las notas están traducidos; el cuerpo aún no está traducido a este idioma.',
    'Los comandos antiguos de ynxd, staking y validadores no coinciden con el nodo de aprendizaje actual. No uses este archivo para unirte a un validador público ni configurarlo.',
    'Los ejemplos de SDK requieren una compilación verificada del repositorio o un paquete descargable. Un nombre de paquete no demuestra publicación en npm o PyPI.',
    'Las herramientas locales de contratos no demuestran ejecución pública de contratos Ethereum arbitrarios. Comprueba la compatibilidad actual antes del despliegue.',
    'Borrador técnico completo con sus supuestos, riesgos y condiciones de activación.',
    'Referencia de desarrollo archivada. Comprueba las herramientas y la ejecución pública antes de usar ejemplos.',
    'Guía archivada de producto u operación. Revisa las instrucciones actuales antes de seguir sus pasos.',
    'Catálogo original de interfaces. Una entrada no demuestra disponibilidad pública.',
    'Referencia original del proyecto sobre terminología, límites de productos y comunicación pública.',
    'Libros blancos|Referencias de desarrollo|Guías archivadas|Referencias de API|Referencias del proyecto',
  ],
  fr: [
    'Le réseau public utilise un producteur faisant autorité et des nœuds suiveurs authentifiés en lecture seule. Le CometBFT public à quatre validateurs, l’admission sans permission, le staking et la distribution de récompenses ne sont pas ouverts.',
    'Cette source conserve un projet historique. Ses conceptions, exemples et annonces ne constituent ni des instructions actuelles ni une preuve de disponibilité.',
    'Le corps intégral ci-dessous est l’original anglais. Les titres et notes de lecture sont traduits ; le corps ne l’est pas encore dans cette langue.',
    'Les anciennes commandes ynxd, staking et validateur ne correspondent pas au nœud pédagogique actuel. N’utilisez pas cette archive pour rejoindre ou configurer un validateur public.',
    'Les exemples SDK nécessitent une compilation vérifiée du dépôt ou un paquet téléchargeable. Un nom de paquet ne prouve pas sa publication sur npm ou PyPI.',
    'Les outils locaux de contrats ne prouvent pas l’exécution publique de contrats Ethereum arbitraires. Vérifiez la prise en charge avant tout déploiement.',
    'Projet technique intégral avec ses hypothèses, risques et conditions d’activation.',
    'Référence de développement archivée. Vérifiez les outils et l’exécution publique avant d’utiliser les exemples.',
    'Guide produit ou opérationnel archivé. Consultez les instructions actuelles avant de suivre les étapes.',
    'Catalogue original des interfaces. Une interface répertoriée n’est pas forcément disponible publiquement.',
    'Référence source du projet sur la terminologie, les limites des produits et la communication publique.',
    'Livres blancs|Références de développement|Guides archivés|Références API|Références du projet',
  ],
  de: [
    'Das öffentliche Netzwerk nutzt einen maßgeblichen Blockproduzenten und authentifizierte schreibgeschützte Folgeknoten. Öffentliches CometBFT mit vier Validatoren, erlaubnisfreier Beitritt, Staking und Belohnungsverteilung sind nicht freigeschaltet.',
    'Diese Quelle bewahrt einen historischen Entwurf. Designs, Beispiele und Veröffentlichungsangaben sind keine aktuellen Betriebsanweisungen oder Verfügbarkeitsnachweise.',
    'Der vollständige Haupttext unten ist das englische Original. Titel und Lesehinweise sind übersetzt; der Haupttext liegt in dieser Sprache noch nicht vor.',
    'Alte ynxd-, Staking- und Validatorbefehle entsprechen nicht dem aktuellen Lernknoten. Verwenden Sie dieses Archiv nicht zur Teilnahme oder Konfiguration eines öffentlichen Validators.',
    'SDK-Beispiele benötigen einen geprüften Repository-Build oder ein Downloadpaket. Ein Paketname beweist keine Veröffentlichung auf npm oder PyPI.',
    'Lokale Vertragstools belegen keine öffentliche Ausführung beliebiger Ethereum-Verträge. Prüfen Sie die aktuelle Unterstützung vor einer Bereitstellung.',
    'Vollständiger technischer Entwurf mit Annahmen, Risiken und Aktivierungsbedingungen.',
    'Archivierte Entwicklungsreferenz. Prüfen Sie aktuelle Werkzeuge und öffentliche Ausführung vor der Nutzung von Beispielen.',
    'Archivierter Produkt- oder Betriebsleitfaden. Lesen Sie vor der Ausführung die aktuellen Anweisungen.',
    'Ursprünglicher Schnittstellenkatalog. Ein aufgeführter Endpunkt belegt keine öffentliche Verfügbarkeit.',
    'Projektquelle zu Terminologie, Produktgrenzen und öffentlicher Kommunikation.',
    'Whitepaper|Entwicklungsreferenzen|Archivierte Leitfäden|API-Referenzen|Projektreferenzen',
  ],
  pt: [
    'A rede pública usa um produtor autorizado e seguidores autenticados somente para leitura. CometBFT público com quatro validadores, adesão sem permissão, staking e distribuição de recompensas não estão abertos.',
    'Esta fonte preserva um rascunho histórico. Seus projetos, exemplos e declarações de lançamento não são instruções atuais nem provas de disponibilidade.',
    'O corpo completo abaixo é o original em inglês. Os títulos e as notas estão traduzidos; o corpo ainda não foi traduzido para este idioma.',
    'Os comandos antigos de ynxd, staking e validadores não correspondem ao nó de aprendizado atual. Não use este arquivo para ingressar ou configurar um validador público.',
    'Os exemplos do SDK exigem uma compilação verificada do repositório ou pacote para download. Um nome de pacote não comprova publicação no npm ou PyPI.',
    'Ferramentas locais de contratos não comprovam execução pública de contratos Ethereum arbitrários. Verifique o suporte atual antes da implantação.',
    'Rascunho técnico completo com hipóteses, riscos e condições de ativação.',
    'Referência de desenvolvimento arquivada. Confira ferramentas e execução pública antes de usar os exemplos.',
    'Guia arquivado de produto ou operação. Leia as instruções atuais antes de seguir as etapas.',
    'Catálogo original de interfaces. Um endpoint listado não comprova disponibilidade pública.',
    'Referência original do projeto sobre terminologia, limites dos produtos e comunicação pública.',
    'Livros brancos|Referências de desenvolvimento|Guias arquivados|Referências da API|Referências do projeto',
  ],
  ru: [
    'Публичная сеть использует один авторитетный узел выпуска блоков и аутентифицированные узлы-последователи только для чтения. Публичный CometBFT с четырьмя валидаторами, свободный допуск, стейкинг и распределение наград не открыты.',
    'Этот источник сохраняет исторический проект. Его конструкции, примеры и сведения о выпусках не являются актуальными инструкциями или доказательством доступности.',
    'Полный текст ниже — английский оригинал. Названия и примечания переведены; основной текст на выбранный язык ещё не переведён.',
    'Старые команды ynxd, стейкинга и валидаторов не соответствуют текущему учебному узлу. Не используйте архив для подключения или настройки публичного валидатора.',
    'Примеры SDK требуют проверенной сборки репозитория или загружаемого пакета. Название пакета не подтверждает публикацию в npm или PyPI.',
    'Локальные инструменты контрактов не подтверждают публичное исполнение произвольных контрактов Ethereum. Перед развёртыванием проверьте поддержку сети.',
    'Полный технический проект с предпосылками, рисками и условиями активации.',
    'Архивный справочник разработчика. Перед использованием примеров проверьте инструменты и публичное исполнение.',
    'Архивное руководство по продукту или эксплуатации. Перед выполнением шагов прочтите актуальные инструкции.',
    'Исходный каталог интерфейсов. Наличие адреса в списке не доказывает публичную доступность.',
    'Исходные материалы проекта о терминологии, границах продуктов и публичной коммуникации.',
    'Белые книги|Справочники разработчика|Архивные руководства|Справочники API|Материалы проекта',
  ],
  ar: [
    'تستخدم الشبكة العامة منتج كتل واحدًا معتمدًا وعُقدًا تابعة موثقة للقراءة فقط. لم تُفتح شبكة CometBFT عامة بأربعة مدققين ولا الانضمام دون إذن أو التحصيص أو توزيع المكافآت.',
    'يحفظ هذا المصدر مسودة تاريخية. التصاميم والأمثلة وبيانات الإصدار ليست تعليمات تشغيل حالية ولا دليلًا على توفر الخدمة.',
    'المتن الكامل أدناه هو الأصل الإنجليزي. تُرجمت العناوين وملاحظات القراءة؛ ولم يُترجم المتن بعد إلى هذه اللغة.',
    'أوامر ynxd والتحصيص والمدققين القديمة لا تطابق نقطة بدء عقدة التعلم الحالية. لا تستخدم هذا الأرشيف للانضمام إلى مدقق عام أو تهيئته.',
    'تتطلب أمثلة SDK بناءً موثقًا من المستودع أو حزمة قابلة للتنزيل. اسم الحزمة في الأرشيف لا يثبت نشرها على npm أو PyPI.',
    'أدوات العقود المحلية لا تثبت دعم تنفيذ عقود Ethereum العامة العشوائية. تحقق من دعم الشبكة الحالي قبل النشر.',
    'مسودة تقنية كاملة تتضمن الافتراضات والمخاطر وشروط التفعيل.',
    'مرجع تطوير مؤرشف. تحقق من الأدوات الحالية ودعم التنفيذ العام قبل استخدام الأمثلة.',
    'دليل منتج أو تشغيل مؤرشف. راجع التعليمات الحالية قبل اتباع الخطوات.',
    'كتالوج الواجهات الأصلي. إدراج نقطة اتصال لا يثبت إتاحتها للعامة.',
    'مرجع مصدر للمشروع حول المصطلحات وحدود المنتجات والتواصل العام.',
    'الأوراق البيضاء|مراجع التطوير|الأدلة المؤرشفة|مراجع API|مراجع المشروع',
  ],
  id: [
    'Jaringan publik memakai satu produsen blok berotoritas dan pengikut terautentikasi hanya-baca. CometBFT publik dengan empat validator, penerimaan tanpa izin, staking, dan pembagian hadiah belum dibuka.',
    'Sumber ini mempertahankan draf historis. Desain, contoh, dan pernyataan rilisnya bukan petunjuk operasi saat ini atau bukti ketersediaan layanan.',
    'Isi lengkap di bawah adalah sumber asli berbahasa Inggris. Judul dan catatan bacaan diterjemahkan; isi belum diterjemahkan ke bahasa ini.',
    'Perintah ynxd, staking, dan validator lama tidak sesuai dengan titik masuk node pembelajaran saat ini. Jangan gunakan arsip ini untuk bergabung atau menyiapkan validator publik.',
    'Contoh SDK memerlukan build repositori terverifikasi atau paket unduhan. Nama paket di arsip tidak membuktikan publikasi di npm atau PyPI.',
    'Alat kontrak lokal tidak membuktikan eksekusi publik kontrak Ethereum sembarang. Periksa dukungan jaringan sebelum melakukan deployment.',
    'Draf teknis lengkap yang mencakup asumsi, risiko, dan syarat aktivasi.',
    'Referensi pengembangan arsip. Periksa alat dan dukungan eksekusi publik sebelum memakai contoh.',
    'Panduan produk atau operasi arsip. Baca petunjuk terkini sebelum mengikuti langkahnya.',
    'Katalog antarmuka asli. Endpoint yang tercantum tidak membuktikan ketersediaan publik.',
    'Referensi sumber proyek tentang istilah, batas produk, dan komunikasi publik.',
    'Buku putih|Referensi pengembangan|Panduan arsip|Referensi API|Referensi proyek',
  ],
};

const CATEGORY_KEYS = ['whitepaper', 'developers', 'guides', 'api', 'public'];
const LOAD_LABELS = {
  en: ['Loading document…', 'The document could not be loaded. Check your connection and try again.', 'Try again'],
  'zh-CN': ['正在加载文档…', '文档加载失败。请检查网络连接后重试。', '重试'],
  'zh-TW': ['正在載入文件…', '文件載入失敗。請檢查網路連線後重試。', '重試'],
  ja: ['文書を読み込み中…', '文書を読み込めませんでした。接続を確認して再試行してください。', '再試行'],
  ko: ['문서 불러오는 중…', '문서를 불러오지 못했습니다. 연결을 확인하고 다시 시도하세요.', '다시 시도'],
  es: ['Cargando documento…', 'No se pudo cargar el documento. Comprueba la conexión e inténtalo de nuevo.', 'Reintentar'],
  fr: ['Chargement du document…', 'Impossible de charger le document. Vérifiez la connexion et réessayez.', 'Réessayer'],
  de: ['Dokument wird geladen…', 'Das Dokument konnte nicht geladen werden. Prüfen Sie die Verbindung und versuchen Sie es erneut.', 'Erneut versuchen'],
  pt: ['Carregando documento…', 'Não foi possível carregar o documento. Verifique a conexão e tente novamente.', 'Tentar novamente'],
  ru: ['Загрузка документа…', 'Не удалось загрузить документ. Проверьте соединение и повторите попытку.', 'Повторить'],
  ar: ['جارٍ تحميل الوثيقة…', 'تعذر تحميل الوثيقة. تحقق من الاتصال وحاول مجددًا.', 'إعادة المحاولة'],
  id: ['Memuat dokumen…', 'Dokumen tidak dapat dimuat. Periksa koneksi dan coba lagi.', 'Coba lagi'],
};
const CACHE = new Map();
export function getDocumentLibraryCopy(requestedLocale = 'en') {
  const locale = Object.hasOwn(LABELS, requestedLocale) ? requestedLocale : 'en';
  if (CACHE.has(locale)) return CACHE.get(locale);
  const labels = Object.fromEntries(LABEL_KEYS.map((key, index) => [key, LABELS[locale][index]]));
  const notes = NOTES[locale];
  const categoryNames = notes[11].split('|');
  const categories = Object.fromEntries(CATEGORY_KEYS.map((key, index) => [key, categoryNames[index]]));
  const documents = Object.fromEntries(DOCUMENT_LIBRARY.map((document, index) => {
    const title = TITLES[locale][index];
    const readingNotes = [notes[0], notes[1]];
    if (document.capabilityFlags.includes('historical-commands')) readingNotes.push(notes[3]);
    if (document.capabilityFlags.includes('package-release-check-required')) readingNotes.push(notes[4]);
    if (document.capabilityFlags.includes('public-evm-execution-unavailable')) readingNotes.push(notes[5]);
    const description = `${title} — ${notes[6 + CATEGORY_KEYS.indexOf(document.category)]}`;
    return [document.id, {title, description, readingNotice: readingNotes.join(' '), readingNotes}];
  }));
  const [loading, loadError, retry] = LOAD_LABELS[locale];
  const result = {...labels, locale, categories, documents, networkNotice:notes[0], archiveNotice:notes[1], originalBodyNotice:notes[2], loading, loadError, retry};
  CACHE.set(locale,result);
  return result;
}
