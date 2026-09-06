export const SCENE_MODULES = Object.freeze(["transaction", "execution", "block", "network"]);

const COPY = {
  en: {
    title: "A blockchain, layer by layer", badge: "Interactive model · not live data", hint: "Drag to rotate · tap a layer", keyboard: "Use arrow keys to rotate and Home to reset. The buttons below also select each layer.",
    explode: "Separate layers", assemble: "Assemble layers", demo: "Follow a transaction", next: "Next step", restart: "Replay walkthrough", pause: "Pause motion", resume: "Resume motion", reset: "Reset view", rotateLeft: "Rotate left", rotateRight: "Rotate right", static: "Static model", selectLabel: "Explore each layer", stepLabel: "Step", complete: "Walkthrough complete. No transaction was submitted.",
    names: ["Transaction", "Execution", "Block", "Network"],
    details: ["A signed instruction asks the network to change its state.", "Execution checks the rules and computes the resulting state.", "A block groups ordered transactions and their results.", "Peers exchange blocks to maintain a shared history."],
    steps: ["Start with a signed instruction: the transaction.", "Apply the rules and calculate the state change.", "Group the transaction and its result into a block.", "Share the block with peers across the network."],
  },
  "zh-CN": {
    title: "一层一层，理解区块链", badge: "交互模型 · 非实时数据", hint: "拖动旋转 · 点选任意层", keyboard: "使用方向键旋转，Home 重置视角；也可用下方按钮选择各层。",
    explode: "拆解层次", assemble: "重组模块", demo: "跟随一笔交易", next: "下一步", restart: "重新演示", pause: "暂停动态", resume: "继续动态", reset: "重置视角", rotateLeft: "向左旋转", rotateRight: "向右旋转", static: "静态模型", selectLabel: "探索各层", stepLabel: "步骤", complete: "示意流程已完成，未提交任何真实交易。",
    names: ["交易", "执行", "区块", "网络"],
    details: ["一条经过签名的指令，请求网络改变状态。", "执行环节检查规则，并计算指令带来的状态变化。", "区块将有序的交易及其结果组织在一起。", "节点相互交换区块，共同维护一份历史记录。"],
    steps: ["从一条已签名的指令开始，这就是交易。", "依照规则执行，计算状态变化。", "将交易及其结果组织进区块。", "让网络中的节点共享区块。"],
  },
  "zh-TW": {
    title: "一層一層，理解區塊鏈", badge: "互動模型 · 非即時資料", hint: "拖曳旋轉 · 點選任意層", keyboard: "使用方向鍵旋轉，Home 重設視角；也可用下方按鈕選擇各層。",
    explode: "拆解層次", assemble: "重組模組", demo: "跟隨一筆交易", next: "下一步", restart: "重新示範", pause: "暫停動態", resume: "繼續動態", reset: "重設視角", rotateLeft: "向左旋轉", rotateRight: "向右旋轉", static: "靜態模型", selectLabel: "探索各層", stepLabel: "步驟", complete: "示意流程已完成，未提交任何真實交易。",
    names: ["交易", "執行", "區塊", "網路"],
    details: ["一條經過簽署的指令，請求網路改變狀態。", "執行環節檢查規則，並計算指令帶來的狀態變化。", "區塊將有序的交易及其結果組織在一起。", "節點互相交換區塊，共同維護一份歷史紀錄。"],
    steps: ["從一條已簽署的指令開始，這就是交易。", "依照規則執行，計算狀態變化。", "將交易及其結果組織進區塊。", "讓網路中的節點共享區塊。"],
  },
  ja: {
    title: "ブロックチェーンを、層ごとに", badge: "操作できる模型 · 実際のデータではありません", hint: "ドラッグで回転 · 層をタップ", keyboard: "矢印キーで回転、Home キーで表示をリセットします。下のボタンでも各層を選べます。",
    explode: "層を分解", assemble: "層を組み立て", demo: "取引の流れを見る", next: "次のステップ", restart: "もう一度見る", pause: "動きを停止", resume: "動きを再開", reset: "表示をリセット", rotateLeft: "左へ回転", rotateRight: "右へ回転", static: "静的な模型", selectLabel: "各層を調べる", stepLabel: "ステップ", complete: "説明は完了です。実際の取引は送信されていません。",
    names: ["取引", "実行", "ブロック", "ネットワーク"],
    details: ["署名された命令が、ネットワークの状態変更を要求します。", "実行処理がルールを確認し、変更後の状態を計算します。", "ブロックは順序付けられた取引とその結果をまとめます。", "ノードがブロックを交換し、共通の履歴を維持します。"],
    steps: ["署名された命令、つまり取引から始まります。", "ルールに従って実行し、状態の変化を計算します。", "取引とその結果をブロックにまとめます。", "ネットワーク内のノードとブロックを共有します。"],
  },
  ko: {
    title: "한 층씩 살펴보는 블록체인", badge: "체험용 모형 · 실시간 데이터 아님", hint: "드래그하여 회전 · 층을 눌러 선택", keyboard: "방향키로 회전하고 Home 키로 초기화하세요. 아래 버튼으로도 각 층을 선택할 수 있습니다.",
    explode: "층 분리", assemble: "층 조립", demo: "거래 흐름 보기", next: "다음 단계", restart: "다시 보기", pause: "움직임 일시 정지", resume: "움직임 재개", reset: "보기 초기화", rotateLeft: "왼쪽으로 회전", rotateRight: "오른쪽으로 회전", static: "정적 모형", selectLabel: "각 층 살펴보기", stepLabel: "단계", complete: "설명이 끝났습니다. 실제 거래는 전송되지 않았습니다.",
    names: ["거래", "실행", "블록", "네트워크"],
    details: ["서명된 명령이 네트워크의 상태 변경을 요청합니다.", "실행 과정은 규칙을 확인하고 변경될 상태를 계산합니다.", "블록은 순서가 정해진 거래와 그 결과를 묶습니다.", "노드들은 블록을 교환하여 공통의 기록을 유지합니다."],
    steps: ["서명된 명령인 거래에서 시작합니다.", "규칙에 따라 실행하고 상태 변화를 계산합니다.", "거래와 그 결과를 블록에 묶습니다.", "네트워크의 노드들과 블록을 공유합니다."],
  },
  es: {
    title: "Una cadena de bloques, capa a capa", badge: "Modelo interactivo · datos ilustrativos", hint: "Arrastra para girar · toca una capa", keyboard: "Usa las flechas para girar e Inicio para restablecer la vista. También puedes seleccionar las capas con los botones.",
    explode: "Separar capas", assemble: "Unir capas", demo: "Seguir una transacción", next: "Siguiente paso", restart: "Repetir recorrido", pause: "Pausar movimiento", resume: "Reanudar movimiento", reset: "Restablecer vista", rotateLeft: "Girar a la izquierda", rotateRight: "Girar a la derecha", static: "Modelo estático", selectLabel: "Explorar cada capa", stepLabel: "Paso", complete: "Recorrido terminado. No se ha enviado ninguna transacción.",
    names: ["Transacción", "Ejecución", "Bloque", "Red"],
    details: ["Una instrucción firmada pide a la red que cambie su estado.", "La ejecución comprueba las reglas y calcula el estado resultante.", "Un bloque agrupa transacciones ordenadas y sus resultados.", "Los nodos intercambian bloques para mantener un historial compartido."],
    steps: ["Todo comienza con una instrucción firmada: la transacción.", "Se aplican las reglas y se calcula el cambio de estado.", "La transacción y su resultado se agrupan en un bloque.", "El bloque se comparte con otros nodos de la red."],
  },
  fr: {
    title: "La blockchain, couche par couche", badge: "Modèle interactif · données illustratives", hint: "Glissez pour tourner · touchez une couche", keyboard: "Utilisez les flèches pour tourner et Origine pour réinitialiser la vue. Les boutons sélectionnent aussi les couches.",
    explode: "Séparer les couches", assemble: "Assembler les couches", demo: "Suivre une transaction", next: "Étape suivante", restart: "Revoir le parcours", pause: "Suspendre le mouvement", resume: "Reprendre le mouvement", reset: "Réinitialiser la vue", rotateLeft: "Tourner à gauche", rotateRight: "Tourner à droite", static: "Modèle statique", selectLabel: "Explorer chaque couche", stepLabel: "Étape", complete: "Parcours terminé. Aucune transaction n’a été envoyée.",
    names: ["Transaction", "Exécution", "Bloc", "Réseau"],
    details: ["Une instruction signée demande au réseau de modifier son état.", "L’exécution vérifie les règles et calcule le nouvel état.", "Un bloc regroupe des transactions ordonnées et leurs résultats.", "Les nœuds échangent des blocs pour maintenir un historique commun."],
    steps: ["Le parcours débute par une instruction signée : la transaction.", "Les règles sont appliquées et le changement d’état est calculé.", "La transaction et son résultat sont réunis dans un bloc.", "Le bloc est partagé avec les autres nœuds du réseau."],
  },
  de: {
    title: "Blockchain, Schicht für Schicht", badge: "Interaktives Modell · keine Live-Daten", hint: "Ziehen zum Drehen · Schicht antippen", keyboard: "Mit den Pfeiltasten drehen, mit Pos1 zurücksetzen. Die Schichten lassen sich auch über die Schaltflächen auswählen.",
    explode: "Schichten trennen", assemble: "Zusammenfügen", demo: "Transaktion verfolgen", next: "Nächster Schritt", restart: "Ablauf wiederholen", pause: "Bewegung pausieren", resume: "Bewegung fortsetzen", reset: "Ansicht zurücksetzen", rotateLeft: "Nach links drehen", rotateRight: "Nach rechts drehen", static: "Statisches Modell", selectLabel: "Schichten erkunden", stepLabel: "Schritt", complete: "Ablauf abgeschlossen. Es wurde keine Transaktion gesendet.",
    names: ["Transaktion", "Ausführung", "Block", "Netzwerk"],
    details: ["Eine signierte Anweisung fordert eine Zustandsänderung im Netzwerk an.", "Die Ausführung prüft die Regeln und berechnet den neuen Zustand.", "Ein Block bündelt geordnete Transaktionen und ihre Ergebnisse.", "Knoten tauschen Blöcke aus und pflegen eine gemeinsame Historie."],
    steps: ["Am Anfang steht eine signierte Anweisung: die Transaktion.", "Die Regeln werden angewandt und die Zustandsänderung berechnet.", "Transaktion und Ergebnis werden in einem Block zusammengefasst.", "Der Block wird mit anderen Knoten im Netzwerk geteilt."],
  },
  pt: {
    title: "A blockchain, camada a camada", badge: "Modelo interativo · dados ilustrativos", hint: "Arraste para rodar · toque numa camada", keyboard: "Use as setas para rodar e Home para repor a vista. Os botões também permitem selecionar cada camada.",
    explode: "Separar camadas", assemble: "Unir camadas", demo: "Seguir uma transação", next: "Próximo passo", restart: "Repetir percurso", pause: "Pausar movimento", resume: "Retomar movimento", reset: "Repor vista", rotateLeft: "Rodar para a esquerda", rotateRight: "Rodar para a direita", static: "Modelo estático", selectLabel: "Explorar cada camada", stepLabel: "Passo", complete: "Percurso concluído. Nenhuma transação foi enviada.",
    names: ["Transação", "Execução", "Bloco", "Rede"],
    details: ["Uma instrução assinada pede à rede que altere o seu estado.", "A execução verifica as regras e calcula o estado resultante.", "Um bloco reúne transações ordenadas e os seus resultados.", "Os nós trocam blocos para manter um histórico partilhado."],
    steps: ["Começa com uma instrução assinada: a transação.", "Aplicam-se as regras e calcula-se a alteração de estado.", "A transação e o seu resultado são reunidos num bloco.", "O bloco é partilhado com outros nós da rede."],
  },
  ru: {
    title: "Блокчейн, слой за слоем", badge: "Интерактивная модель · не реальные данные", hint: "Тяните для поворота · выберите слой", keyboard: "Стрелки поворачивают модель, Home сбрасывает вид. Слои можно выбирать кнопками ниже.",
    explode: "Разделить слои", assemble: "Собрать слои", demo: "Путь транзакции", next: "Следующий шаг", restart: "Повторить показ", pause: "Приостановить движение", resume: "Продолжить движение", reset: "Сбросить вид", rotateLeft: "Повернуть влево", rotateRight: "Повернуть вправо", static: "Статическая модель", selectLabel: "Изучить каждый слой", stepLabel: "Шаг", complete: "Показ завершён. Реальная транзакция не отправлялась.",
    names: ["Транзакция", "Исполнение", "Блок", "Сеть"],
    details: ["Подписанная инструкция запрашивает изменение состояния сети.", "Исполнение проверяет правила и вычисляет новое состояние.", "Блок объединяет упорядоченные транзакции и их результаты.", "Узлы обмениваются блоками, поддерживая общую историю."],
    steps: ["Всё начинается с подписанной инструкции — транзакции.", "Применяются правила и вычисляется изменение состояния.", "Транзакция и её результат объединяются в блок.", "Блок передаётся другим узлам сети."],
  },
  ar: {
    title: "سلسلة الكتل، طبقةً بعد طبقة", badge: "نموذج تفاعلي · ليس بيانات مباشرة", hint: "اسحب للتدوير · اضغط على طبقة", keyboard: "استخدم الأسهم للتدوير ومفتاح Home لإعادة العرض. يمكنك أيضًا اختيار الطبقات بالأزرار أدناه.",
    explode: "فصل الطبقات", assemble: "تجميع الطبقات", demo: "تتبّع معاملة", next: "الخطوة التالية", restart: "إعادة العرض", pause: "إيقاف الحركة مؤقتًا", resume: "استئناف الحركة", reset: "إعادة ضبط العرض", rotateLeft: "تدوير إلى اليسار", rotateRight: "تدوير إلى اليمين", static: "نموذج ثابت", selectLabel: "استكشف كل طبقة", stepLabel: "الخطوة", complete: "اكتمل العرض التوضيحي. لم تُرسل أي معاملة حقيقية.",
    names: ["المعاملة", "التنفيذ", "الكتلة", "الشبكة"],
    details: ["تطلب تعليمة موقّعة من الشبكة تغيير حالتها.", "يتحقق التنفيذ من القواعد ويحسب الحالة الناتجة.", "تجمع الكتلة المعاملات المرتّبة ونتائجها.", "تتبادل العقد الكتل للحفاظ على سجل مشترك."],
    steps: ["نبدأ بتعليمة موقّعة، وهي المعاملة.", "تُطبّق القواعد ويُحسب التغيّر في الحالة.", "تُجمع المعاملة ونتيجتها ضمن كتلة.", "تُشارك الكتلة مع العقد الأخرى في الشبكة."],
  },
  id: {
    title: "Blockchain, lapis demi lapis", badge: "Model interaktif · bukan data langsung", hint: "Seret untuk memutar · ketuk lapisan", keyboard: "Gunakan panah untuk memutar dan Home untuk mengatur ulang. Tombol di bawah juga dapat memilih setiap lapisan.",
    explode: "Pisahkan lapisan", assemble: "Satukan lapisan", demo: "Ikuti alur transaksi", next: "Langkah berikutnya", restart: "Ulangi alur", pause: "Jeda gerakan", resume: "Lanjutkan gerakan", reset: "Atur ulang tampilan", rotateLeft: "Putar ke kiri", rotateRight: "Putar ke kanan", static: "Model statis", selectLabel: "Jelajahi setiap lapisan", stepLabel: "Langkah", complete: "Alur selesai. Tidak ada transaksi yang dikirim.",
    names: ["Transaksi", "Eksekusi", "Blok", "Jaringan"],
    details: ["Instruksi bertanda tangan meminta perubahan status jaringan.", "Eksekusi memeriksa aturan dan menghitung status yang dihasilkan.", "Blok menghimpun transaksi berurutan beserta hasilnya.", "Simpul saling bertukar blok untuk menjaga riwayat bersama."],
    steps: ["Dimulai dengan instruksi bertanda tangan: transaksi.", "Aturan diterapkan dan perubahan status dihitung.", "Transaksi beserta hasilnya dihimpun dalam sebuah blok.", "Blok dibagikan kepada simpul lain di jaringan."],
  },
};

export function getBrandSceneCopy(locale = "en") {
  return COPY[locale] || COPY.en;
}
