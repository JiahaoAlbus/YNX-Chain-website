const copy = {
  en: ["Connect YNX Wallet", "YNX Wallet not detected", "Install or open YNX Wallet to connect. You can browse this website without an account.", "Get YNX Wallet"],
  "zh-CN": ["连接 YNX Wallet", "未检测到 YNX Wallet", "请安装或打开 YNX Wallet 后连接。无需账号也可以浏览官网。", "获取 YNX Wallet"],
  "zh-TW": ["連接 YNX Wallet", "未偵測到 YNX Wallet", "請安裝或開啟 YNX Wallet 後連接。無需帳號也可以瀏覽官網。", "取得 YNX Wallet"],
  ja: ["YNX Wallet を接続", "YNX Wallet が見つかりません", "YNX Wallet をインストールするか開いて接続してください。サイトの閲覧にはアカウントは不要です。", "YNX Wallet を入手"],
  ko: ["YNX Wallet 연결", "YNX Wallet이 감지되지 않음", "YNX Wallet을 설치하거나 열어 연결하세요. 계정 없이도 웹사이트를 둘러볼 수 있습니다.", "YNX Wallet 받기"],
  es: ["Conectar YNX Wallet", "YNX Wallet no detectado", "Instala o abre YNX Wallet para conectarte. Puedes explorar la web sin una cuenta.", "Obtener YNX Wallet"],
  fr: ["Connecter YNX Wallet", "YNX Wallet non détecté", "Installez ou ouvrez YNX Wallet pour vous connecter. Vous pouvez consulter le site sans compte.", "Obtenir YNX Wallet"],
  de: ["YNX Wallet verbinden", "YNX Wallet nicht erkannt", "Installiere oder öffne YNX Wallet, um dich zu verbinden. Die Website ist ohne Konto zugänglich.", "YNX Wallet herunterladen"],
  pt: ["Conectar YNX Wallet", "YNX Wallet não detectada", "Instale ou abra a YNX Wallet para conectar. Você pode navegar no site sem conta.", "Obter YNX Wallet"],
  ru: ["Подключить YNX Wallet", "YNX Wallet не обнаружен", "Установите или откройте YNX Wallet для подключения. Просматривать сайт можно без аккаунта.", "Получить YNX Wallet"],
  ar: ["ربط YNX Wallet", "لم يتم العثور على YNX Wallet", "ثبّت YNX Wallet أو افتحه للاتصال. يمكنك تصفح الموقع دون حساب.", "احصل على YNX Wallet"],
  id: ["Hubungkan YNX Wallet", "YNX Wallet tidak terdeteksi", "Instal atau buka YNX Wallet untuk terhubung. Anda dapat menjelajahi situs tanpa akun.", "Dapatkan YNX Wallet"],
};
const modes = {
  en: ["Other wallets · basic connection", "Basic mode", "External wallets support basic connection and only the services that explicitly support them. Use YNX Wallet for the full ecosystem account experience."],
  "zh-CN": ["其他钱包 · 基础连接", "基础模式", "外部钱包可进行基础连接，并使用明确支持它们的部分服务。完整生态账户体验请使用 YNX Wallet。"],
  "zh-TW": ["其他錢包 · 基礎連接", "基礎模式", "外部錢包可進行基礎連接，並使用明確支援它們的部分服務。完整生態帳戶體驗請使用 YNX Wallet。"],
  ja: ["その他のウォレット・基本接続", "基本モード", "外部ウォレットは基本接続と明示的に対応するサービスのみ利用できます。エコシステムの全アカウント機能には YNX Wallet をご利用ください。"],
  ko: ["다른 지갑 · 기본 연결", "기본 모드", "외부 지갑은 기본 연결과 명시적으로 지원되는 서비스만 이용할 수 있습니다. 전체 생태계 계정 기능에는 YNX Wallet을 사용하세요."],
  es: ["Otras carteras · conexión básica", "Modo básico", "Las carteras externas permiten una conexión básica y solo los servicios que las admiten expresamente. Usa YNX Wallet para la experiencia completa de cuenta del ecosistema."],
  fr: ["Autres portefeuilles · connexion de base", "Mode de base", "Les portefeuilles externes donnent accès à la connexion de base et aux services qui les prennent explicitement en charge. Utilisez YNX Wallet pour l’ensemble des fonctions de compte de l’écosystème."],
  de: ["Andere Wallets · Basisverbindung", "Basismodus", "Externe Wallets ermöglichen eine Basisverbindung und ausdrücklich unterstützte Dienste. Für alle Kontofunktionen des Ökosystems nutze YNX Wallet."],
  pt: ["Outras carteiras · conexão básica", "Modo básico", "Carteiras externas permitem conexão básica e apenas os serviços que as aceitam explicitamente. Use YNX Wallet para a experiência completa de conta no ecossistema."],
  ru: ["Другие кошельки · базовое подключение", "Базовый режим", "Внешние кошельки поддерживают базовое подключение и только явно совместимые сервисы. Для всех функций аккаунта экосистемы используйте YNX Wallet."],
  ar: ["محافظ أخرى · اتصال أساسي", "الوضع الأساسي", "تدعم المحافظ الخارجية الاتصال الأساسي والخدمات التي تدعمها صراحة فقط. استخدم YNX Wallet للاستفادة من جميع وظائف حساب المنظومة."],
  id: ["Dompet lain · koneksi dasar", "Mode dasar", "Dompet eksternal mendukung koneksi dasar dan hanya layanan yang secara jelas mendukungnya. Gunakan YNX Wallet untuk seluruh pengalaman akun ekosistem."],
};
export const getWalletEntryCopy = locale => {
  const [connect, unavailable, help, download] = copy[locale] || copy.en;
  const [other, basic, limits] = modes[locale] || modes.en;
  return { connect, unavailable, help, download, other, basic, limits };
};
