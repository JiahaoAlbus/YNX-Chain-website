const step = (title, text, action, href) => ({ title, text, action, href });
const tab = (label, title, description, steps) => ({ label, title, description, steps });
const term = (term, definition) => ({ term, definition });

const WALLET_GUIDE = "/dapp/wallet/open-download";
const FAUCET = "https://faucet.ynxweb4.com";
const EXPLORER = "https://explorer.ynxweb4.com";

export const HOME_EXPERIENCE_COPY = {
  en: {
    eyebrow: "Explore YNX",
    title: "Your next step starts here.",
    lead: "Choose what brings you here. Follow a few practical steps, then explore at your own pace.",
    tabs: [
      tab("Explore the ecosystem", "Start with the essentials.", "Get familiar with the public Testnet, from a wallet to an app you want to try.", [
        step("Set up your wallet", "Choose a supported platform and follow its installation guide. Review the release details before trying the Testnet.", "Installation guide", WALLET_GUIDE),
        step("Get test YNXT", "Request YNXT from the Faucet for test gas and fees. Availability and request limits apply.", "Open Faucet", FAUCET),
        step("Find an app to try", "Browse ecosystem apps and check each app’s access options and current Testnet status.", "Explore apps", "/dapp"),
      ]),
      tab("Build applications", "Use the tools you already know.", "Bring EVM tools to YNX. Start with the documentation and validate your work on the public Testnet.", [
        step("Connect to the network", "Read the network guide and configure your EVM tools for chain ID 6423. Check the supported methods before integrating.", "Read the docs", "/docs"),
        step("Work with the SDK", "Follow the published API and SDK guides. Test requests and responses against the capabilities of the current release.", "View API and SDK", "/api"),
        step("Inspect the results", "Look up transactions, receipts and network records in Explorer. Confirm outcomes using the returned data.", "Open Explorer", EXPLORER),
      ]),
      tab("Understand AI", "From an idea to a reviewed action.", "See how AI proposals, your approval and audit records fit together. The AI interface shows its current capabilities.", [
        step("Explore a proposal", "Visit the AI interface to see what it currently supports. Treat a proposal as something to review before acting.", "Explore YNX AI", "/dapp/ai"),
        step("Review before approving", "Check the proposed action and its permissions. Signing or sending a transaction requires your explicit approval.", "Read the guide", "/docs"),
        step("Check what happened", "Review execution results and available audit records. Find current Testnet capabilities and remaining limits in the progress overview.", "View Testnet progress", "/readiness"),
      ]),
    ],
    glossaryTitle: "A few things to know.",
    glossary: [
      term("Layer 1", "The base blockchain that records transactions and maintains shared network state. YNX is currently a public Testnet."),
      term("EVM compatibility", "Support for Ethereum-style tools, smart contracts and JSON-RPC. The documentation describes the behavior currently supported by YNX."),
      term("YNXT", "The Testnet asset used for gas and network fees. Test YNXT has no monetary value."),
      term("ynx1 addresses", "YNX’s native address format. Its corresponding 0x address encodes the same 20-byte account identifier."),
    ],
  },
  "zh-CN": {
    eyebrow: "探索 YNX",
    title: "你的下一步，从这里开始。",
    lead: "选择你感兴趣的方向，跟着几个实用步骤开始，再按自己的节奏深入探索。",
    tabs: [
      tab("体验生态", "从基础开始，逐步体验。", "从设置钱包到寻找应用，认识 YNX 公开测试网。", [
        step("设置你的钱包", "选择支持的平台，按指南完成安装。体验测试网前，先了解对应版本的发布信息。", "安装指南", WALLET_GUIDE),
        step("领取测试 YNXT", "通过水龙头申请 YNXT，用于测试 Gas 与网络手续费。领取受服务可用性和频率限制影响。", "打开水龙头", FAUCET),
        step("寻找想体验的应用", "浏览生态应用，了解每款应用的访问方式与当前测试网进展。", "探索应用", "/dapp"),
      ]),
      tab("开发应用", "用你熟悉的工具开始。", "将 EVM 工具带到 YNX。从开发文档开始，在公开测试网上验证你的实现。", [
        step("接入网络", "阅读网络指南，将 EVM 工具配置为链 ID 6423。集成前，了解当前支持的方法。", "阅读文档", "/docs"),
        step("使用 SDK", "按照已发布的 API 与 SDK 指南，结合当前版本支持的能力测试请求与响应。", "查看 API 与 SDK", "/api"),
        step("查看执行结果", "在区块浏览器中查看交易、收据与网络记录，根据返回数据确认结果。", "打开区块浏览器", EXPLORER),
      ]),
      tab("了解 AI", "从一个想法，到一次确认后的操作。", "了解 AI 提案、你的批准与审计记录如何衔接。具体支持的能力以 AI 界面当前状态为准。", [
        step("了解 AI 提案", "进入 AI 界面，查看目前支持的功能。把提案作为待审阅的内容，再决定是否执行。", "探索 YNX AI", "/dapp/ai"),
        step("审阅后再批准", "确认拟执行的操作及其权限。签名或发送交易需要你的明确批准。", "阅读指南", "/docs"),
        step("查看实际结果", "检查执行结果与可用的审计记录，在进展概览中了解当前测试网能力和待完善项。", "查看测试网进展", "/readiness"),
      ]),
    ],
    glossaryTitle: "先了解几个概念。",
    glossary: [
      term("Layer 1", "记录交易、维护共享网络状态的基础区块链。YNX 目前处于公开测试网阶段。"),
      term("EVM 兼容", "支持以太坊生态的工具、智能合约与 JSON-RPC。YNX 当前支持的具体行为可在文档中查看。"),
      term("YNXT", "用于测试网 Gas 与网络手续费的测试资产。测试 YNXT 不具有货币价值。"),
      term("ynx1 地址", "YNX 的原生地址格式，与对应的 0x 地址表示相同的 20 字节账户标识。"),
    ],
  },
  "zh-TW": {
    eyebrow: "探索 YNX",
    title: "你的下一步，從這裡開始。",
    lead: "選擇你感興趣的方向，跟著幾個實用步驟開始，再依自己的步調深入探索。",
    tabs: [
      tab("體驗生態系", "從基礎開始，逐步體驗。", "從設定錢包到尋找應用程式，認識 YNX 公開測試網。", [
        step("設定你的錢包", "選擇支援的平台，按照指南完成安裝。體驗測試網前，先了解對應版本的發布資訊。", "安裝指南", WALLET_GUIDE),
        step("領取測試 YNXT", "透過水龍頭申請 YNXT，用於測試 Gas 與網路手續費。領取受服務可用性及頻率限制影響。", "開啟水龍頭", FAUCET),
        step("尋找想體驗的應用程式", "瀏覽生態系應用程式，了解各項存取方式與目前測試網進展。", "探索應用程式", "/dapp"),
      ]),
      tab("開發應用程式", "用你熟悉的工具開始。", "將 EVM 工具帶到 YNX。從開發文件開始，在公開測試網上驗證你的實作。", [
        step("連接網路", "閱讀網路指南，將 EVM 工具設定為鏈 ID 6423。整合前，先了解目前支援的方法。", "閱讀文件", "/docs"),
        step("使用 SDK", "依照已發布的 API 與 SDK 指南，根據目前版本支援的能力測試請求與回應。", "查看 API 與 SDK", "/api"),
        step("查看執行結果", "在區塊瀏覽器中查看交易、收據與網路記錄，根據回傳資料確認結果。", "開啟區塊瀏覽器", EXPLORER),
      ]),
      tab("了解 AI", "從一個想法，到一次確認後的操作。", "了解 AI 提案、你的核准與稽核記錄如何銜接。實際支援的能力以 AI 介面目前狀態為準。", [
        step("了解 AI 提案", "進入 AI 介面，查看目前支援的功能。先審閱提案，再決定是否執行。", "探索 YNX AI", "/dapp/ai"),
        step("審閱後再核准", "確認預計執行的操作及其權限。簽署或傳送交易需要你的明確核准。", "閱讀指南", "/docs"),
        step("查看實際結果", "檢查執行結果與可用的稽核記錄，在進展概覽中了解目前測試網能力和待完善項目。", "查看測試網進展", "/readiness"),
      ]),
    ],
    glossaryTitle: "先了解幾個概念。",
    glossary: [
      term("Layer 1", "記錄交易、維護共享網路狀態的基礎區塊鏈。YNX 目前處於公開測試網階段。"),
      term("EVM 相容", "支援以太坊生態系的工具、智慧合約與 JSON-RPC。YNX 目前支援的具體行為可在文件中查看。"),
      term("YNXT", "用於測試網 Gas 與網路手續費的測試資產。測試 YNXT 不具有貨幣價值。"),
      term("ynx1 地址", "YNX 的原生地址格式，與對應的 0x 地址表示相同的 20 位元組帳戶識別碼。"),
    ],
  },
  ja: {
    eyebrow: "YNX を探索",
    title: "次の一歩は、ここから。",
    lead: "興味のあるテーマを選び、いくつかのステップで始めましょう。その先は、自分のペースで。",
    tabs: [
      tab("エコシステムを体験", "基本から、ひとつずつ。", "ウォレットの準備からアプリの体験まで。公開テストネットに触れてみましょう。", [
        step("ウォレットを準備", "対応プラットフォームを選び、ガイドに沿ってインストールします。テストネットを試す前に、リリース情報を確認してください。", "インストールガイド", WALLET_GUIDE),
        step("テスト YNXT を取得", "Faucet でテスト用のガスや手数料に使う YNXT を申請します。サービスの稼働状況と申請上限が適用されます。", "Faucet を開く", FAUCET),
        step("試したいアプリを探す", "エコシステムのアプリを見て、アクセス方法と現在のテストネット対応状況を確認します。", "アプリを探す", "/dapp"),
      ]),
      tab("アプリを開発", "使い慣れたツールで始めよう。", "EVM ツールを YNX でも。ドキュメントを読み、公開テストネットで実装を検証しましょう。", [
        step("ネットワークに接続", "ネットワークガイドを読み、EVM ツールをチェーン ID 6423 に設定します。連携前に対応メソッドを確認してください。", "ドキュメントを読む", "/docs"),
        step("SDK を使う", "公開されている API・SDK ガイドに沿って、現行リリースの対応機能でリクエストとレスポンスをテストします。", "API と SDK を見る", "/api"),
        step("結果を確認", "Explorer でトランザクション、レシート、ネットワーク記録を検索し、返されたデータから結果を確認します。", "Explorer を開く", EXPLORER),
      ]),
      tab("AI を知る", "アイデアから、確認を経た操作へ。", "AI の提案、ユーザーの承認、監査記録のつながりを知りましょう。対応機能は AI 画面の現在の状況をご確認ください。", [
        step("AI の提案を知る", "AI 画面で現在の対応機能を確認します。提案はまず内容を検討し、実行するかどうかを判断してください。", "YNX AI を見る", "/dapp/ai"),
        step("確認してから承認", "提案された操作と権限を確認します。署名やトランザクションの送信には、あなたの明示的な承認が必要です。", "ガイドを読む", "/docs"),
        step("実際の結果を確認", "実行結果と取得できる監査記録を確認します。進捗ページでは、現在のテストネットの機能と制限を確認できます。", "テストネットの進捗を見る", "/readiness"),
      ]),
    ],
    glossaryTitle: "知っておきたい、いくつかのこと。",
    glossary: [
      term("Layer 1", "トランザクションを記録し、共有ネットワーク状態を維持する基盤ブロックチェーン。YNX は現在、公開テストネットです。"),
      term("EVM 互換", "Ethereum 系のツール、スマートコントラクト、JSON-RPC への対応。YNX の現在の対応範囲はドキュメントで確認できます。"),
      term("YNXT", "テストネットのガスとネットワーク手数料に使うテスト資産。テスト YNXT に金銭的価値はありません。"),
      term("ynx1 アドレス", "YNX のネイティブアドレス形式。対応する 0x アドレスも同じ 20 バイトのアカウント識別子を表します。"),
    ],
  },
  ko: {
    eyebrow: "YNX 알아보기",
    title: "다음 단계는 여기서 시작하세요.",
    lead: "관심 있는 방향을 선택하고 몇 가지 실용적인 단계로 시작하세요. 그다음은 나만의 속도로 탐색해 보세요.",
    tabs: [
      tab("생태계 경험하기", "기본부터 하나씩 시작하세요.", "지갑 준비부터 앱 경험까지, 공개 테스트넷을 알아보세요.", [
        step("지갑 설정하기", "지원되는 플랫폼을 선택하고 가이드에 따라 설치하세요. 테스트넷을 이용하기 전에 해당 버전의 릴리스 정보를 확인하세요.", "설치 가이드", WALLET_GUIDE),
        step("테스트 YNXT 받기", "Faucet에서 테스트 Gas와 수수료에 사용할 YNXT를 신청하세요. 서비스 가용성과 요청 한도가 적용됩니다.", "Faucet 열기", FAUCET),
        step("경험할 앱 찾기", "생태계 앱을 둘러보고 각 앱의 접속 방법과 현재 테스트넷 지원 현황을 확인하세요.", "앱 둘러보기", "/dapp"),
      ]),
      tab("앱 개발하기", "익숙한 도구로 시작하세요.", "YNX에서도 EVM 도구를 사용하세요. 문서를 읽고 공개 테스트넷에서 구현을 검증하세요.", [
        step("네트워크 연결하기", "네트워크 가이드를 읽고 EVM 도구의 체인 ID를 6423으로 설정하세요. 연동 전에 지원되는 메서드를 확인하세요.", "문서 읽기", "/docs"),
        step("SDK 사용하기", "공개된 API와 SDK 가이드에 따라 현재 릴리스가 지원하는 기능의 요청과 응답을 테스트하세요.", "API와 SDK 보기", "/api"),
        step("결과 확인하기", "탐색기에서 트랜잭션, 영수증, 네트워크 기록을 조회하고 반환된 데이터로 결과를 확인하세요.", "탐색기 열기", EXPLORER),
      ]),
      tab("AI 이해하기", "아이디어에서 검토를 거친 실행으로.", "AI 제안, 사용자 승인, 감사 기록이 어떻게 이어지는지 알아보세요. 현재 지원 기능은 AI 화면에서 확인할 수 있습니다.", [
        step("AI 제안 살펴보기", "AI 화면에서 현재 지원하는 기능을 확인하세요. 제안을 먼저 검토한 다음 실행 여부를 결정하세요.", "YNX AI 알아보기", "/dapp/ai"),
        step("검토 후 승인하기", "제안된 작업과 권한을 확인하세요. 서명하거나 트랜잭션을 보내려면 사용자의 명시적인 승인이 필요합니다.", "가이드 읽기", "/docs"),
        step("실제 결과 확인하기", "실행 결과와 제공되는 감사 기록을 검토하세요. 진행 상황에서 현재 테스트넷 기능과 남은 제한 사항을 확인하세요.", "테스트넷 진행 상황 보기", "/readiness"),
      ]),
    ],
    glossaryTitle: "알아두면 좋은 몇 가지 개념.",
    glossary: [
      term("Layer 1", "트랜잭션을 기록하고 공유 네트워크 상태를 유지하는 기반 블록체인입니다. YNX는 현재 공개 테스트넷입니다."),
      term("EVM 호환", "이더리움 계열 도구, 스마트 계약, JSON-RPC를 지원한다는 뜻입니다. YNX의 현재 지원 범위는 문서에서 확인할 수 있습니다."),
      term("YNXT", "테스트넷 Gas와 네트워크 수수료에 사용하는 테스트 자산입니다. 테스트 YNXT에는 금전적 가치가 없습니다."),
      term("ynx1 주소", "YNX의 기본 주소 형식입니다. 대응하는 0x 주소도 동일한 20바이트 계정 식별자를 나타냅니다."),
    ],
  },
  es: {
    eyebrow: "Explora YNX",
    title: "Tu próximo paso empieza aquí.",
    lead: "Elige lo que te interesa. Empieza con unos pasos prácticos y sigue explorando a tu ritmo.",
    tabs: [
      tab("Explorar el ecosistema", "Empieza por lo esencial.", "Conoce la testnet pública, desde el monedero hasta una app que quieras probar.", [
        step("Prepara tu monedero", "Elige una plataforma compatible y sigue su guía de instalación. Revisa los detalles de la versión antes de probar la testnet.", "Guía de instalación", WALLET_GUIDE),
        step("Obtén YNXT de prueba", "Solicita YNXT en el Faucet para gas y comisiones de prueba. Se aplican condiciones de disponibilidad y límites de solicitudes.", "Abrir Faucet", FAUCET),
        step("Encuentra una app", "Explora las apps del ecosistema y consulta sus opciones de acceso y su estado actual en la testnet.", "Explorar apps", "/dapp"),
      ]),
      tab("Desarrollar aplicaciones", "Usa las herramientas que ya conoces.", "Lleva tus herramientas EVM a YNX. Empieza con la documentación y valida tu trabajo en la testnet pública.", [
        step("Conecta con la red", "Lee la guía de red y configura tus herramientas EVM con el ID de cadena 6423. Comprueba los métodos compatibles antes de integrar.", "Leer la documentación", "/docs"),
        step("Trabaja con el SDK", "Sigue las guías publicadas de API y SDK. Prueba las solicitudes y respuestas con las funciones de la versión actual.", "Ver API y SDK", "/api"),
        step("Comprueba los resultados", "Consulta transacciones, recibos y registros de red en el explorador. Confirma los resultados con los datos devueltos.", "Abrir el explorador", EXPLORER),
      ]),
      tab("Entender la IA", "De una idea a una acción revisada.", "Descubre cómo se relacionan las propuestas de IA, tu aprobación y los registros de auditoría. La interfaz de IA muestra sus funciones actuales.", [
        step("Explora una propuesta", "Visita la interfaz de IA para ver qué admite actualmente. Revisa cada propuesta antes de decidir si actuar.", "Explorar YNX AI", "/dapp/ai"),
        step("Revisa antes de aprobar", "Comprueba la acción propuesta y sus permisos. Firmar o enviar una transacción requiere tu aprobación explícita.", "Leer la guía", "/docs"),
        step("Comprueba qué ocurrió", "Revisa los resultados y los registros de auditoría disponibles. Consulta las funciones actuales y los límites pendientes en el resumen de avances.", "Ver avances de la testnet", "/readiness"),
      ]),
    ],
    glossaryTitle: "Algunos conceptos para empezar.",
    glossary: [
      term("Layer 1", "La cadena de bloques base que registra transacciones y mantiene el estado compartido de la red. YNX es actualmente una testnet pública."),
      term("Compatibilidad EVM", "Soporte para herramientas de Ethereum, contratos inteligentes y JSON-RPC. La documentación describe el comportamiento que YNX admite actualmente."),
      term("YNXT", "El activo de la testnet para gas y comisiones de red. El YNXT de prueba no tiene valor monetario."),
      term("Direcciones ynx1", "El formato de dirección nativo de YNX. Su dirección 0x correspondiente representa el mismo identificador de cuenta de 20 bytes."),
    ],
  },
  fr: {
    eyebrow: "Explorez YNX",
    title: "Votre prochaine étape commence ici.",
    lead: "Choisissez ce qui vous intéresse. Suivez quelques étapes pratiques, puis explorez à votre rythme.",
    tabs: [
      tab("Explorer l’écosystème", "Commencez par l’essentiel.", "Découvrez le testnet public, du portefeuille à l’app que vous souhaitez essayer.", [
        step("Préparez votre portefeuille", "Choisissez une plateforme prise en charge et suivez son guide d’installation. Consultez les détails de la version avant d’essayer le testnet.", "Guide d’installation", WALLET_GUIDE),
        step("Obtenez des YNXT de test", "Demandez des YNXT au Faucet pour le gas et les frais de test. La disponibilité du service et les limites de demande s’appliquent.", "Ouvrir le Faucet", FAUCET),
        step("Trouvez une app à essayer", "Parcourez les apps de l’écosystème et consultez leurs accès et leur état actuel sur le testnet.", "Explorer les apps", "/dapp"),
      ]),
      tab("Développer des applications", "Utilisez vos outils familiers.", "Retrouvez vos outils EVM sur YNX. Commencez par la documentation et validez votre travail sur le testnet public.", [
        step("Connectez-vous au réseau", "Lisez le guide réseau et configurez vos outils EVM avec l’ID de chaîne 6423. Vérifiez les méthodes prises en charge avant l’intégration.", "Lire la documentation", "/docs"),
        step("Utilisez le SDK", "Suivez les guides publiés pour l’API et le SDK. Testez les requêtes et les réponses avec les fonctions de la version actuelle.", "Voir l’API et le SDK", "/api"),
        step("Vérifiez les résultats", "Consultez les transactions, reçus et enregistrements réseau dans l’explorateur. Confirmez les résultats à partir des données renvoyées.", "Ouvrir l’explorateur", EXPLORER),
      ]),
      tab("Comprendre l’IA", "De l’idée à une action examinée.", "Découvrez le lien entre les propositions IA, votre approbation et les journaux d’audit. L’interface IA présente ses fonctions actuelles.", [
        step("Explorez une proposition", "Consultez l’interface IA pour connaître les fonctions disponibles. Examinez une proposition avant de décider d’agir.", "Explorer YNX AI", "/dapp/ai"),
        step("Examinez avant d’approuver", "Vérifiez l’action proposée et ses permissions. Signer ou envoyer une transaction exige votre approbation explicite.", "Lire le guide", "/docs"),
        step("Vérifiez ce qui s’est passé", "Examinez les résultats et les journaux d’audit disponibles. Retrouvez les fonctions actuelles et les limites restantes dans le suivi du testnet.", "Voir les avancées du testnet", "/readiness"),
      ]),
    ],
    glossaryTitle: "Quelques notions pour commencer.",
    glossary: [
      term("Layer 1", "La blockchain de base qui enregistre les transactions et maintient l’état partagé du réseau. YNX est actuellement un testnet public."),
      term("Compatibilité EVM", "La prise en charge des outils Ethereum, des contrats intelligents et de JSON-RPC. La documentation précise les comportements actuellement pris en charge par YNX."),
      term("YNXT", "L’actif de testnet utilisé pour le gas et les frais réseau. Les YNXT de test n’ont aucune valeur monétaire."),
      term("Adresses ynx1", "Le format d’adresse natif de YNX. L’adresse 0x correspondante représente le même identifiant de compte de 20 octets."),
    ],
  },
  de: {
    eyebrow: "YNX entdecken",
    title: "Dein nächster Schritt beginnt hier.",
    lead: "Wähle, was dich interessiert. Starte mit ein paar praktischen Schritten und erkunde YNX in deinem Tempo.",
    tabs: [
      tab("Ökosystem entdecken", "Beginne mit den Grundlagen.", "Lerne das öffentliche Testnet kennen – von der Wallet bis zur App, die du ausprobieren möchtest.", [
        step("Richte deine Wallet ein", "Wähle eine unterstützte Plattform und folge der Installationsanleitung. Prüfe die Versionshinweise, bevor du das Testnet ausprobierst.", "Installationsanleitung", WALLET_GUIDE),
        step("Hole dir Test-YNXT", "Fordere im Faucet YNXT für Test-Gas und Gebühren an. Dabei gelten die Verfügbarkeit des Dienstes und die Anfragelimits.", "Faucet öffnen", FAUCET),
        step("Finde eine App", "Erkunde die Apps im Ökosystem und prüfe ihre Zugangswege sowie ihren aktuellen Testnet-Status.", "Apps entdecken", "/dapp"),
      ]),
      tab("Anwendungen entwickeln", "Nutze die Tools, die du kennst.", "Verwende deine EVM-Tools auf YNX. Starte mit der Dokumentation und prüfe deine Arbeit im öffentlichen Testnet.", [
        step("Verbinde dich mit dem Netzwerk", "Lies den Netzwerkleitfaden und stelle deine EVM-Tools auf die Chain-ID 6423 ein. Prüfe vor der Integration die unterstützten Methoden.", "Dokumentation lesen", "/docs"),
        step("Arbeite mit dem SDK", "Folge den veröffentlichten API- und SDK-Anleitungen. Teste Anfragen und Antworten anhand der Funktionen der aktuellen Version.", "API und SDK ansehen", "/api"),
        step("Prüfe die Ergebnisse", "Suche im Explorer nach Transaktionen, Belegen und Netzwerkdaten. Bestätige Ergebnisse anhand der zurückgegebenen Daten.", "Explorer öffnen", EXPLORER),
      ]),
      tab("KI verstehen", "Von einer Idee zur geprüften Aktion.", "Erfahre, wie KI-Vorschläge, deine Zustimmung und Prüfprotokolle zusammenhängen. Die KI-Oberfläche zeigt ihre aktuellen Funktionen.", [
        step("Sieh dir einen Vorschlag an", "Öffne die KI-Oberfläche, um die derzeitigen Funktionen kennenzulernen. Prüfe einen Vorschlag, bevor du dich für eine Aktion entscheidest.", "YNX AI entdecken", "/dapp/ai"),
        step("Prüfe vor der Zustimmung", "Kontrolliere die vorgeschlagene Aktion und ihre Berechtigungen. Das Signieren oder Senden einer Transaktion erfordert deine ausdrückliche Zustimmung.", "Anleitung lesen", "/docs"),
        step("Prüfe, was passiert ist", "Sieh dir die Ausführungsergebnisse und verfügbaren Prüfprotokolle an. Die Fortschrittsübersicht nennt aktuelle Testnet-Funktionen und verbleibende Grenzen.", "Testnet-Fortschritt ansehen", "/readiness"),
      ]),
    ],
    glossaryTitle: "Ein paar Begriffe zum Einstieg.",
    glossary: [
      term("Layer 1", "Die grundlegende Blockchain, die Transaktionen erfasst und den gemeinsamen Netzwerkzustand verwaltet. YNX ist derzeit ein öffentliches Testnet."),
      term("EVM-Kompatibilität", "Unterstützung für Ethereum-Tools, Smart Contracts und JSON-RPC. Die Dokumentation beschreibt das derzeit von YNX unterstützte Verhalten."),
      term("YNXT", "Das Testnet-Asset für Gas und Netzwerkgebühren. Test-YNXT hat keinen Geldwert."),
      term("ynx1-Adressen", "Das native Adressformat von YNX. Die zugehörige 0x-Adresse steht für dieselbe 20-Byte-Kontokennung."),
    ],
  },
  pt: {
    eyebrow: "Explore a YNX",
    title: "Seu próximo passo começa aqui.",
    lead: "Escolha o que interessa a você. Comece com alguns passos práticos e explore no seu ritmo.",
    tabs: [
      tab("Explorar o ecossistema", "Comece pelo essencial.", "Conheça a testnet pública, da carteira ao app que você quer experimentar.", [
        step("Configure sua carteira", "Escolha uma plataforma compatível e siga o guia de instalação. Confira os detalhes da versão antes de experimentar a testnet.", "Guia de instalação", WALLET_GUIDE),
        step("Obtenha YNXT de teste", "Solicite YNXT no Faucet para gas e taxas de teste. A disponibilidade do serviço e os limites de solicitação se aplicam.", "Abrir Faucet", FAUCET),
        step("Encontre um app", "Explore os apps do ecossistema e confira as formas de acesso e o status atual de cada um na testnet.", "Explorar apps", "/dapp"),
      ]),
      tab("Desenvolver aplicativos", "Use as ferramentas que você conhece.", "Traga suas ferramentas EVM para a YNX. Comece pela documentação e valide seu trabalho na testnet pública.", [
        step("Conecte-se à rede", "Leia o guia de rede e configure suas ferramentas EVM com o ID de cadeia 6423. Confira os métodos compatíveis antes da integração.", "Ler a documentação", "/docs"),
        step("Trabalhe com o SDK", "Siga os guias publicados de API e SDK. Teste solicitações e respostas com os recursos da versão atual.", "Ver API e SDK", "/api"),
        step("Confira os resultados", "Consulte transações, recibos e registros de rede no explorador. Confirme os resultados usando os dados retornados.", "Abrir explorador", EXPLORER),
      ]),
      tab("Entender a IA", "De uma ideia a uma ação revisada.", "Entenda como propostas de IA, sua aprovação e registros de auditoria se conectam. A interface de IA mostra seus recursos atuais.", [
        step("Explore uma proposta", "Visite a interface de IA para conhecer os recursos disponíveis. Revise uma proposta antes de decidir agir.", "Explorar YNX AI", "/dapp/ai"),
        step("Revise antes de aprovar", "Confira a ação proposta e suas permissões. Assinar ou enviar uma transação exige sua aprovação explícita.", "Ler o guia", "/docs"),
        step("Confira o que aconteceu", "Revise os resultados da execução e os registros de auditoria disponíveis. Veja os recursos atuais e os limites restantes no progresso da testnet.", "Ver progresso da testnet", "/readiness"),
      ]),
    ],
    glossaryTitle: "Alguns conceitos para começar.",
    glossary: [
      term("Layer 1", "A blockchain base que registra transações e mantém o estado compartilhado da rede. A YNX é atualmente uma testnet pública."),
      term("Compatibilidade EVM", "Suporte a ferramentas do Ethereum, contratos inteligentes e JSON-RPC. A documentação descreve os comportamentos atualmente compatíveis com a YNX."),
      term("YNXT", "O ativo da testnet usado para gas e taxas de rede. O YNXT de teste não tem valor monetário."),
      term("Endereços ynx1", "O formato de endereço nativo da YNX. O endereço 0x correspondente representa o mesmo identificador de conta de 20 bytes."),
    ],
  },
  ru: {
    eyebrow: "Откройте YNX",
    title: "Ваш следующий шаг начинается здесь.",
    lead: "Выберите то, что вам интересно. Начните с нескольких практических шагов и изучайте YNX в своём темпе.",
    tabs: [
      tab("Изучить экосистему", "Начните с основ.", "Познакомьтесь с публичной тестовой сетью — от настройки кошелька до приложения, которое хочется попробовать.", [
        step("Настройте кошелёк", "Выберите поддерживаемую платформу и следуйте руководству по установке. Перед работой в тестовой сети изучите сведения о версии.", "Руководство по установке", WALLET_GUIDE),
        step("Получите тестовые YNXT", "Запросите YNXT в Faucet для тестового газа и комиссий. Действуют ограничения запросов; получение зависит от доступности сервиса.", "Открыть Faucet", FAUCET),
        step("Найдите приложение", "Просмотрите приложения экосистемы, способы доступа и текущий статус каждого в тестовой сети.", "Смотреть приложения", "/dapp"),
      ]),
      tab("Разрабатывать приложения", "Используйте знакомые инструменты.", "Работайте с EVM-инструментами в YNX. Начните с документации и проверьте реализацию в публичной тестовой сети.", [
        step("Подключитесь к сети", "Изучите руководство по сети и настройте EVM-инструменты на ID цепи 6423. Перед интеграцией проверьте поддерживаемые методы.", "Читать документацию", "/docs"),
        step("Используйте SDK", "Следуйте опубликованным руководствам API и SDK. Проверяйте запросы и ответы с учётом возможностей текущей версии.", "Смотреть API и SDK", "/api"),
        step("Проверьте результаты", "Найдите транзакции, квитанции и записи сети в обозревателе. Подтверждайте результаты по полученным данным.", "Открыть обозреватель", EXPLORER),
      ]),
      tab("Разобраться в ИИ", "От идеи к проверенному действию.", "Узнайте, как связаны предложения ИИ, ваше одобрение и журналы аудита. Текущие возможности представлены в интерфейсе ИИ.", [
        step("Изучите предложение", "Откройте интерфейс ИИ и узнайте о доступных функциях. Сначала рассмотрите предложение, затем решите, стоит ли действовать.", "Открыть YNX AI", "/dapp/ai"),
        step("Проверьте перед одобрением", "Изучите предложенное действие и его разрешения. Для подписи или отправки транзакции требуется ваше явное одобрение.", "Читать руководство", "/docs"),
        step("Узнайте, что произошло", "Проверьте результаты выполнения и доступные журналы аудита. Текущие возможности и оставшиеся ограничения описаны в обзоре прогресса тестовой сети.", "Смотреть прогресс тестовой сети", "/readiness"),
      ]),
    ],
    glossaryTitle: "Несколько понятий для начала.",
    glossary: [
      term("Layer 1", "Базовая блокчейн-сеть, которая записывает транзакции и поддерживает общее состояние сети. YNX сейчас работает как публичная тестовая сеть."),
      term("Совместимость с EVM", "Поддержка инструментов Ethereum, смарт-контрактов и JSON-RPC. Текущее поведение, поддерживаемое YNX, описано в документации."),
      term("YNXT", "Тестовый актив для оплаты газа и сетевых комиссий. Тестовые YNXT не имеют денежной стоимости."),
      term("Адреса ynx1", "Нативный формат адреса YNX. Соответствующий адрес 0x представляет тот же 20-байтовый идентификатор аккаунта."),
    ],
  },
  ar: {
    eyebrow: "استكشف YNX",
    title: "خطوتك التالية تبدأ هنا.",
    lead: "اختر ما يهمك. ابدأ ببضع خطوات عملية، ثم استكشف بالوتيرة التي تناسبك.",
    tabs: [
      tab("استكشاف المنظومة", "ابدأ بالأساسيات.", "تعرّف إلى شبكة الاختبار العامة، من إعداد المحفظة إلى التطبيق الذي تريد تجربته.", [
        step("أعدّ محفظتك", "اختر منصة مدعومة واتبع دليل التثبيت. راجع تفاصيل الإصدار قبل تجربة شبكة الاختبار.", "دليل التثبيت", WALLET_GUIDE),
        step("احصل على YNXT تجريبية", "اطلب YNXT من صنبور الاختبار لدفع رسوم الغاز والشبكة التجريبية. يخضع الطلب لتوفر الخدمة وحدود الاستخدام.", "فتح صنبور الاختبار", FAUCET),
        step("ابحث عن تطبيق لتجربته", "تصفّح تطبيقات المنظومة وتحقّق من طرق الوصول إلى كل تطبيق وحالته الحالية على شبكة الاختبار.", "استكشاف التطبيقات", "/dapp"),
      ]),
      tab("تطوير التطبيقات", "استخدم الأدوات التي تعرفها.", "استخدم أدوات EVM على YNX. ابدأ بالوثائق واختبر عملك على شبكة الاختبار العامة.", [
        step("اتصل بالشبكة", "اقرأ دليل الشبكة واضبط أدوات EVM على معرّف السلسلة 6423. تحقّق من الطرق المدعومة قبل التكامل.", "قراءة الوثائق", "/docs"),
        step("استخدم حزمة SDK", "اتبع أدلة API وSDK المنشورة. اختبر الطلبات والاستجابات وفق إمكانات الإصدار الحالي.", "عرض API وSDK", "/api"),
        step("افحص النتائج", "ابحث عن المعاملات والإيصالات وسجلات الشبكة في المستكشف. أكّد النتائج بالاعتماد على البيانات المُعادة.", "فتح المستكشف", EXPLORER),
      ]),
      tab("فهم الذكاء الاصطناعي", "من فكرة إلى إجراء تراجعه.", "تعرّف إلى العلاقة بين مقترحات الذكاء الاصطناعي وموافقتك وسجلات التدقيق. تعرض واجهة الذكاء الاصطناعي إمكاناتها الحالية.", [
        step("استكشف مقترحًا", "زر واجهة الذكاء الاصطناعي لمعرفة الوظائف المتاحة حاليًا. راجع المقترح أولًا، ثم قرّر إن كنت تريد تنفيذه.", "استكشاف YNX AI", "/dapp/ai"),
        step("راجع قبل الموافقة", "تحقّق من الإجراء المقترح وصلاحياته. يتطلب التوقيع أو إرسال معاملة موافقتك الصريحة.", "قراءة الدليل", "/docs"),
        step("تحقّق مما حدث", "راجع نتائج التنفيذ وسجلات التدقيق المتاحة. تعرّف إلى إمكانات شبكة الاختبار الحالية وحدودها المتبقية في صفحة التقدّم.", "عرض تقدّم شبكة الاختبار", "/readiness"),
      ]),
    ],
    glossaryTitle: "مفاهيم تساعدك على البدء.",
    glossary: [
      term("الطبقة الأولى", "شبكة البلوك تشين الأساسية التي تسجّل المعاملات وتحافظ على الحالة المشتركة للشبكة. تعمل YNX حاليًا كشبكة اختبار عامة."),
      term("التوافق مع EVM", "دعم أدوات إيثيريوم والعقود الذكية وJSON-RPC. توضّح الوثائق السلوك الذي تدعمه YNX حاليًا."),
      term("YNXT", "أصل تجريبي يُستخدم لرسوم الغاز والشبكة على شبكة الاختبار. لا تملك YNXT التجريبية قيمة نقدية."),
      term("عناوين ynx1", "صيغة العنوان الأصلية في YNX. يمثّل عنوان 0x المقابل معرّف الحساب نفسه المكوّن من 20 بايت."),
    ],
  },
  id: {
    eyebrow: "Jelajahi YNX",
    title: "Langkah berikutnya dimulai di sini.",
    lead: "Pilih yang menarik bagi Anda. Mulai dengan beberapa langkah praktis, lalu jelajahi sesuai ritme Anda.",
    tabs: [
      tab("Jelajahi ekosistem", "Mulai dari hal mendasar.", "Kenali testnet publik, dari menyiapkan dompet hingga menemukan aplikasi untuk dicoba.", [
        step("Siapkan dompet Anda", "Pilih platform yang didukung dan ikuti panduan instalasinya. Periksa detail rilis sebelum mencoba testnet.", "Panduan instalasi", WALLET_GUIDE),
        step("Dapatkan YNXT uji", "Minta YNXT dari Faucet untuk gas dan biaya uji. Ketersediaan layanan dan batas permintaan berlaku.", "Buka Faucet", FAUCET),
        step("Temukan aplikasi", "Jelajahi aplikasi ekosistem dan periksa cara akses serta status testnet masing-masing saat ini.", "Jelajahi aplikasi", "/dapp"),
      ]),
      tab("Kembangkan aplikasi", "Gunakan alat yang sudah Anda kenal.", "Bawa alat EVM Anda ke YNX. Mulai dari dokumentasi dan validasi pekerjaan Anda di testnet publik.", [
        step("Hubungkan ke jaringan", "Baca panduan jaringan dan atur alat EVM untuk chain ID 6423. Periksa metode yang didukung sebelum melakukan integrasi.", "Baca dokumentasi", "/docs"),
        step("Gunakan SDK", "Ikuti panduan API dan SDK yang dipublikasikan. Uji permintaan dan respons sesuai kemampuan rilis saat ini.", "Lihat API dan SDK", "/api"),
        step("Periksa hasilnya", "Cari transaksi, tanda terima, dan catatan jaringan di Explorer. Pastikan hasilnya berdasarkan data yang dikembalikan.", "Buka Explorer", EXPLORER),
      ]),
      tab("Pahami AI", "Dari ide menuju tindakan yang ditinjau.", "Pahami hubungan antara usulan AI, persetujuan Anda, dan catatan audit. Antarmuka AI menampilkan kemampuannya saat ini.", [
        step("Kenali sebuah usulan", "Kunjungi antarmuka AI untuk melihat fitur yang tersedia. Tinjau usulan terlebih dahulu sebelum memutuskan untuk bertindak.", "Jelajahi YNX AI", "/dapp/ai"),
        step("Tinjau sebelum menyetujui", "Periksa tindakan yang diusulkan dan izinnya. Penandatanganan atau pengiriman transaksi memerlukan persetujuan eksplisit Anda.", "Baca panduan", "/docs"),
        step("Periksa apa yang terjadi", "Tinjau hasil eksekusi dan catatan audit yang tersedia. Lihat kemampuan testnet saat ini dan batasan yang tersisa di halaman progres.", "Lihat progres testnet", "/readiness"),
      ]),
    ],
    glossaryTitle: "Beberapa konsep untuk memulai.",
    glossary: [
      term("Layer 1", "Blockchain dasar yang mencatat transaksi dan menjaga status jaringan bersama. YNX saat ini merupakan testnet publik."),
      term("Kompatibilitas EVM", "Dukungan untuk alat Ethereum, kontrak pintar, dan JSON-RPC. Dokumentasi menjelaskan perilaku yang saat ini didukung oleh YNX."),
      term("YNXT", "Aset testnet untuk gas dan biaya jaringan. YNXT uji tidak memiliki nilai moneter."),
      term("Alamat ynx1", "Format alamat native YNX. Alamat 0x yang setara mewakili pengenal akun 20 byte yang sama."),
    ],
  },
};

export function getHomeExperienceCopy(locale) {
  return Object.hasOwn(HOME_EXPERIENCE_COPY, locale)
    ? HOME_EXPERIENCE_COPY[locale]
    : HOME_EXPERIENCE_COPY.en;
}
