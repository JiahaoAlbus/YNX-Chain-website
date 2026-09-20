export const ADDRESS_COPY = {
  en: { native: "YNX address", details: "Address details", evm: "EVM address", sameAccount: "Both formats identify the same account.", unavailable: "Address unavailable" },
  "zh-CN": { native: "YNX 地址", details: "地址详情", evm: "EVM 地址", sameAccount: "两种格式对应同一个账户。", unavailable: "地址不可用" },
  "zh-TW": { native: "YNX 地址", details: "地址詳情", evm: "EVM 地址", sameAccount: "兩種格式對應同一個帳戶。", unavailable: "地址無法使用" },
  ja: { native: "YNX アドレス", details: "アドレスの詳細", evm: "EVM アドレス", sameAccount: "どちらの形式も同じアカウントを表します。", unavailable: "アドレスを表示できません" },
  ko: { native: "YNX 주소", details: "주소 상세 정보", evm: "EVM 주소", sameAccount: "두 형식은 같은 계정을 나타냅니다.", unavailable: "주소를 표시할 수 없음" },
  es: { native: "Dirección YNX", details: "Detalles de la dirección", evm: "Dirección EVM", sameAccount: "Ambos formatos identifican la misma cuenta.", unavailable: "Dirección no disponible" },
  fr: { native: "Adresse YNX", details: "Détails de l’adresse", evm: "Adresse EVM", sameAccount: "Les deux formats désignent le même compte.", unavailable: "Adresse indisponible" },
  de: { native: "YNX-Adresse", details: "Adressdetails", evm: "EVM-Adresse", sameAccount: "Beide Formate bezeichnen dasselbe Konto.", unavailable: "Adresse nicht verfügbar" },
  pt: { native: "Endereço YNX", details: "Detalhes do endereço", evm: "Endereço EVM", sameAccount: "Os dois formatos identificam a mesma conta.", unavailable: "Endereço indisponível" },
  ru: { native: "Адрес YNX", details: "Сведения об адресе", evm: "Адрес EVM", sameAccount: "Оба формата обозначают один и тот же аккаунт.", unavailable: "Адрес недоступен" },
  ar: { native: "عنوان YNX", details: "تفاصيل العنوان", evm: "عنوان EVM", sameAccount: "يشير التنسيقان إلى الحساب نفسه.", unavailable: "العنوان غير متاح" },
  id: { native: "Alamat YNX", details: "Detail alamat", evm: "Alamat EVM", sameAccount: "Kedua format menunjukkan akun yang sama.", unavailable: "Alamat tidak tersedia" },
};

export const getAddressCopy = (locale) => ADDRESS_COPY[locale] || ADDRESS_COPY.en;
