const zhTwSteps = [
  ["1", "取得 Wallet 位址", "在本機建立或復原位址；YNX 產品永遠不需要你的復原短語。"],
  ["2", "領取測試網 YNXT", "透過 Faucet 取得僅供測試的 YNXT；它不代表任何貨幣價值。"],
  ["3", "發起測試網轉帳", "Wallet 核准前核對收款人、金額與目前 1 YNXT 的原生手續費。"],
  ["4", "在 Explorer 驗證", "搜尋交易雜湊，並比對 From、To、金額、手續費、狀態與區塊。"],
];

const jaSteps = [
  ["1", "Wallet アドレスを用意", "端末内でアドレスを作成または復元します。YNX 製品がリカバリーフレーズを求めることはありません。"],
  ["2", "Testnet YNXT を取得", "Faucet からテスト専用の YNXT を取得します。金銭的価値を表すものではありません。"],
  ["3", "Testnet で送金", "Wallet で承認する前に、宛先、金額、現在のネイティブ手数料 1 YNXT を確認します。"],
  ["4", "Explorer で検証", "トランザクションハッシュを検索し、From、To、金額、手数料、状態、ブロックを照合します。"],
];

const koSteps = [
  ["1", "Wallet 주소 준비", "기기에서 주소를 생성하거나 복원합니다. YNX 제품은 복구 문구를 요구하지 않습니다."],
  ["2", "Testnet YNXT 받기", "Faucet에서 테스트 전용 YNXT를 받습니다. 금전적 가치를 나타내지 않습니다."],
  ["3", "Testnet 전송", "Wallet 승인 전에 수신자, 금액, 현재 네이티브 수수료 1 YNXT를 확인합니다."],
  ["4", "Explorer에서 검증", "트랜잭션 해시를 검색하고 From, To, 금액, 수수료, 상태, 블록을 대조합니다."],
];

export const DOCS_UI_CJK = {
  "zh-TW": {
    eyebrow: "從這裡開始 · YNX 文件", title: "先理解 YNX，再開始使用。", lead: "無需下載。完整官方手冊、網路規則與產品邏輯都可直接在本頁閱讀。", start: "10 分鐘入門", read: "閱讀完整手冊",
    introEyebrow: "用直白語言介紹 YNX", introTitle: "這個專案是什麼，又不是什麼", network: "網路", chainId: "Chain ID", asset: "原生資產", explorer: "區塊瀏覽器", explorerLink: "開啟即時資料",
    manualsEyebrow: "完整官方手冊", manualsTitle: "在這裡閱讀每一份手冊", manualsLead: "在左側選擇手冊，右側會顯示完整權威正文；無需下載 ZIP 或前往 GitHub。", search: "搜尋 YNX 文件", nav: "官方手冊", official: "官方手冊", noMatch: "沒有相符的手冊", noMatchLead: "可嘗試 Wallet、驗證者、轉帳、Testnet、SDK、Pay 或 Explorer。",
    ecosystemEyebrow: "生態產品指南", ecosystemTitle: "產品指南翻譯狀態", ecosystemLead: "本批次只發布權威文件譯文；產品指南尚未完成繁中翻譯，因此不以英文冒充繁中內容。", how: "運作方式", rules: "規則與邊界", open: "開啟", details: "詳情", guidesAvailable: false,
    runtimeEyebrow: "Wallet/Auth 執行證據 · P0", runtimeTitle: "公開 Wallet/Auth 服務記錄及其限制", runtimeLead: "Wallet/Auth 服務已從精確 runtime source 回讀。這些是 Gateway 事實，不代表已安裝 Wallet 或交易能力。", runtimeRecord: "開啟執行記錄", evidence: "開啟精確證據",
    safetyTitle: "全生態統一規則", safetyLead: "健康檢查、候選建置、模擬結果或本機工件不會被表述為公開生產能力；未知狀態保持未知。", exportTitle: "需要離線封存或完整性稽核？", exportLead: "同一套完整手冊可選擇匯出為已驗證 ZIP；一般使用者不必下載。", exportLink: "下載文件原始碼封存",
    startSteps: zhTwSteps,
    coreFacts: [["YNX 是什麼", "公開測試網鏈，以及圍繞使用者控制的 Wallet 身分協同運作的應用生態。"], ["為何不同", "應用共享可驗證鏈上證據；Wallet 核准始終與 AI 和產品邏輯分離。"], ["最終目標", "建立成熟 Web4 平台，讓人們無需把無限制控制權交給每個服務，也能溝通、支付、開發、交易、創作及管理資料。"], ["目前邊界", "這是測試網候選生態，不是 Mainnet、銀行、交易所上幣、已發行卡片或金融回報承諾。"]],
    truths: [["交易與區塊", "區塊是 finalized transaction 容器，不等於 1 個 YNXT；空區塊不會自動產生獎勵。"], ["歷史區塊修改", "finality 後不可修改；任何已 finalize 區塊都不能事後加入交易。"], ["節點維運", "先以同步 observer 加入，候選審查前驗證高度、雜湊、peer、儲存、監控、備份與復原。"], ["驗證者候選", "測試網准入需要審查並由 operator 控制；文件不等於核准，signer 不確定時必須 fail closed。"], ["出塊事實", "YNX Testnet 使用輪替驗證者與 block producer，不是 GPU 或 ASIC 工作量證明挖礦。"], ["Bridge 證據", "目前 Bridge 可證明 YNX 來源交易與本機 relayer 生命週期；外部提交已停用。"]],
  },
  ja: {
    eyebrow: "ここから開始 · YNX ドキュメント", title: "YNX を理解してから使い始める。", lead: "ダウンロードは不要です。公式マニュアル、ネットワーク規則、製品ロジックをこのページで直接読めます。", start: "10 分で始める", read: "完全版マニュアルを読む",
    introEyebrow: "平易な言葉で説明する YNX", introTitle: "このプロジェクトが何であり、何ではないか", network: "ネットワーク", chainId: "Chain ID", asset: "ネイティブ資産", explorer: "Explorer", explorerLink: "ライブデータを開く",
    manualsEyebrow: "公式マニュアル完全版", manualsTitle: "すべてのマニュアルをここで読む", manualsLead: "左でマニュアルを選ぶと、右に権威ある全文が表示されます。ZIP の取得や GitHub への移動は不要です。", search: "YNX ドキュメントを検索", nav: "公式マニュアル", official: "公式マニュアル", noMatch: "一致するマニュアルがありません", noMatchLead: "Wallet、バリデータ、送金、Testnet、SDK、Pay、Explorer を試してください。",
    ecosystemEyebrow: "エコシステム製品ガイド", ecosystemTitle: "製品ガイドの翻訳状況", ecosystemLead: "このリリースで公開するのは権威文書の翻訳です。製品ガイドは日本語化が未完了のため、英語を日本語として表示しません。", how: "仕組み", rules: "規則と境界", open: "開く", details: "詳細", guidesAvailable: false,
    runtimeEyebrow: "Wallet/Auth ランタイム証拠 · P0", runtimeTitle: "公開 Wallet/Auth サービス記録と制約", runtimeLead: "Wallet/Auth サービスは正確な runtime source から読み戻されています。これは Gateway の事実であり、Wallet のインストールや取引能力の証明ではありません。", runtimeRecord: "ランタイム記録を開く", evidence: "正確な証拠を開く",
    safetyTitle: "エコシステム共通の原則", safetyLead: "ヘルスチェック、候補ビルド、模擬結果、ローカル成果物を公開本番能力として扱いません。不明な状態は不明のまま示します。", exportTitle: "オフライン保存または完全性監査が必要ですか？", exportLead: "同じ完全版マニュアルを検証済み ZIP として任意に出力できます。通常の利用にダウンロードは不要です。", exportLink: "ドキュメントのソースアーカイブを取得",
    startSteps: jaSteps,
    coreFacts: [["YNX とは", "公開 Testnet チェーンと、利用者が管理する Wallet アイデンティティを中心に連携するアプリケーションエコシステムです。"], ["何が異なるか", "アプリは検証可能なチェーン証拠を共有し、Wallet 承認は AI や製品ロジックから分離されます。"], ["最終目標", "各サービスに無制限の権限を渡さず、通信、決済、開発、取引、制作、データ管理を行える成熟した Web4 基盤です。"], ["現在の境界", "Testnet 候補エコシステムであり、Mainnet、銀行、取引所上場、発行済みカード、収益の約束ではありません。"]],
    truths: [["取引とブロック", "ブロックは finalized transaction の容器で、1 YNXT そのものではありません。空ブロックに自動報酬はありません。"], ["過去ブロックの変更", "finality 後は不可能です。finalize 済みブロックへ後から取引を追加できません。"], ["ノード運用", "まず同期 observer として参加し、高さ、ハッシュ、peer、ストレージ、監視、バックアップ、復元を検証します。"], ["バリデータ候補", "Testnet 参加には審査と operator の管理が必要です。文書は承認ではなく、signer が不明なら fail closed です。"], ["ブロック生成", "YNX Testnet は交代制のバリデータと block producer を使い、GPU/ASIC の proof-of-work mining ではありません。"], ["Bridge の証拠", "現在の Bridge は YNX 送信元取引とローカル relayer のライフサイクルを証明できますが、外部送信は無効です。"]],
  },
  ko: {
    eyebrow: "여기서 시작 · YNX 문서", title: "YNX를 이해한 뒤 사용하세요.", lead: "다운로드가 필요 없습니다. 공식 매뉴얼, 네트워크 규칙, 제품 로직을 이 페이지에서 직접 읽을 수 있습니다.", start: "10분 안에 시작", read: "전체 매뉴얼 읽기",
    introEyebrow: "쉬운 말로 설명하는 YNX", introTitle: "이 프로젝트가 무엇이며 무엇이 아닌가", network: "네트워크", chainId: "Chain ID", asset: "네이티브 자산", explorer: "Explorer", explorerLink: "실시간 데이터 열기",
    manualsEyebrow: "전체 공식 매뉴얼", manualsTitle: "모든 매뉴얼을 여기서 읽기", manualsLead: "왼쪽에서 매뉴얼을 선택하면 오른쪽에 권위 있는 전체 내용이 표시됩니다. ZIP 다운로드나 GitHub 방문이 필요 없습니다.", search: "YNX 문서 검색", nav: "공식 매뉴얼", official: "공식 매뉴얼", noMatch: "일치하는 매뉴얼이 없습니다", noMatchLead: "Wallet, 검증자, 전송, Testnet, SDK, Pay 또는 Explorer를 검색해 보세요.",
    ecosystemEyebrow: "생태계 제품 가이드", ecosystemTitle: "제품 가이드 번역 상태", ecosystemLead: "이번 배치는 권위 문서 번역만 공개합니다. 제품 가이드는 한국어 번역이 완료되지 않아 영어를 한국어인 것처럼 표시하지 않습니다.", how: "작동 방식", rules: "규칙과 경계", open: "열기", details: "상세", guidesAvailable: false,
    runtimeEyebrow: "Wallet/Auth 런타임 증거 · P0", runtimeTitle: "공개 Wallet/Auth 서비스 기록과 한계", runtimeLead: "Wallet/Auth 서비스는 정확한 runtime source에서 다시 확인되었습니다. 이는 Gateway 사실이며 설치된 Wallet이나 거래 기능을 증명하지 않습니다.", runtimeRecord: "런타임 기록 열기", evidence: "정확한 증거 열기",
    safetyTitle: "생태계 공통 원칙", safetyLead: "상태 확인, 후보 빌드, 모의 결과 또는 로컬 산출물을 공개 프로덕션 기능으로 표현하지 않습니다. 알 수 없는 상태는 그대로 표시합니다.", exportTitle: "오프라인 보관이나 무결성 감사가 필요한가요?", exportLead: "동일한 전체 매뉴얼을 검증된 ZIP으로 선택 내보낼 수 있습니다. 일반 사용자는 다운로드할 필요가 없습니다.", exportLink: "문서 소스 아카이브 다운로드",
    startSteps: koSteps,
    coreFacts: [["YNX란", "공개 Testnet 체인과 사용자가 제어하는 Wallet 정체성을 중심으로 협력하는 애플리케이션 생태계입니다."], ["차이점", "앱은 검증 가능한 체인 증거를 공유하며 Wallet 승인은 AI 및 제품 로직과 분리됩니다."], ["최종 목표", "각 서비스에 무제한 제어권을 주지 않고 소통, 결제, 개발, 거래, 창작, 데이터 관리를 할 수 있는 성숙한 Web4 플랫폼입니다."], ["현재 경계", "Testnet 후보 생태계이며 Mainnet, 은행, 거래소 상장, 발급 카드 또는 금융 수익 약속이 아닙니다."]],
    truths: [["트랜잭션과 블록", "블록은 finalized transaction 컨테이너이며 1 YNXT 자체가 아닙니다. 빈 블록에는 자동 보상이 없습니다."], ["과거 블록 변경", "finality 이후에는 불가능합니다. finalize된 블록에 나중에 트랜잭션을 추가할 수 없습니다."], ["노드 운영", "먼저 동기화된 observer로 참여하고 높이, 해시, peer, 저장소, 모니터링, 백업, 복원을 검증합니다."], ["검증자 후보", "Testnet 참여는 심사와 operator 통제가 필요합니다. 문서는 승인이 아니며 signer가 불확실하면 fail closed합니다."], ["블록 생성 사실", "YNX Testnet은 순환 검증자와 block producer를 사용하며 GPU/ASIC proof-of-work mining이 아닙니다."], ["Bridge 증거", "현재 Bridge는 YNX 원본 트랜잭션과 로컬 relayer 수명주기를 증명하지만 외부 제출은 비활성화되어 있습니다."]],
  },
};
