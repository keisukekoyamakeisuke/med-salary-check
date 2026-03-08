import type { DiagnosisAnswers, DiagnosisResult, Advice } from "./types";
import { getSalaryData } from "./salary-data";

export function calcDiagnosisResult(answers: DiagnosisAnswers): DiagnosisResult | null {
  const { profession, facilityType, region, experience, employmentType, position } = answers;

  if (!profession || !facilityType || !region || !experience || !employmentType || !position) {
    return null;
  }

  const salaryData = getSalaryData(profession, experience, region, facilityType, employmentType, position);

  const salary     = answers.currentSalary ?? salaryData.medianSalary;
  const difference = salary - salaryData.medianSalary;
  const ratio      = difference / salaryData.medianSalary;

  let evaluation: DiagnosisResult["evaluation"];
  if (ratio > 0.05)       evaluation = "above";
  else if (ratio < -0.05) evaluation = "below";
  else                    evaluation = "average";

  const advices = generateAdvices(answers, evaluation);

  return { answers, salaryData, evaluation, difference, advices };
}

function generateAdvices(
  answers: DiagnosisAnswers,
  evaluation: DiagnosisResult["evaluation"]
): Advice[] {
  const advices: Advice[] = [];
  const { profession, position, qualifications, facilityType, employmentType } = answers;

  // 共通：相場より低い場合
  if (evaluation === "below") {
    advices.push({
      priority: 1,
      title: "転職で即時改善の可能性あり",
      description:
        "現在の年収は同条件の市場相場より低い傾向にあります。医療特化型の転職エージェントへの相談で、より好条件の求人が見つかるケースが多くあります。",
      impact: "+50〜150万円",
    });
  }

  // 職種別アドバイス
  switch (profession) {
    case "doctor":
      if (!qualifications.includes("board_certified")) {
        advices.push({
          priority: 2,
          title: "専門医資格の取得",
          description: "専門医資格を取得することで病院からの評価が上がり、年収・ポジション交渉を有利に進められます。",
          impact: "+100〜300万円",
        });
      }
      if (facilityType === "clinic" || facilityType === "small_hospital") {
        advices.push({
          priority: 3,
          title: "大学病院・高機能病院でのキャリア形成",
          description: "大規模病院での症例経験と実績は、将来の独立開業や高収入ポストへの道を開きます。",
          impact: "+200〜500万円",
        });
      }
      break;

    case "dentist":
      if (!qualifications.includes("implant_cert")) {
        advices.push({
          priority: 2,
          title: "インプラント・矯正の自費診療スキル習得",
          description: "自費診療の比率を高めることで、保険点数に縛られない収益向上が見込めます。",
          impact: "+100〜400万円",
        });
      }
      if (facilityType !== "clinic") {
        advices.push({
          priority: 3,
          title: "自院開業・分院長ポジションの検討",
          description: "歯科医師は開業による収入増が大きいです。まずは分院長を経験してノウハウを積む選択肢もあります。",
          impact: "+200〜1000万円",
        });
      }
      break;

    case "nurse":
      if (!qualifications.includes("certified_nurse") && !qualifications.includes("specialist_nurse")) {
        advices.push({
          priority: 2,
          title: "認定看護師・専門看護師の取得",
          description: "専門資格を取得することで手当が付き、年収アップにつながります。認定看護師は+20〜50万円、専門看護師は+30〜80万円が見込まれます。",
          impact: "+20〜80万円",
        });
      }
      if (facilityType === "clinic" || facilityType === "nursing_home") {
        advices.push({
          priority: 3,
          title: "病院勤務への転職",
          description: "クリニック・施設より大規模病院の方が夜勤手当・各種手当が充実しており、年収差が生じやすいです。",
          impact: "+30〜80万円",
        });
      }
      break;

    case "assistant_nurse":
      advices.push({
        priority: 2,
        title: "看護師免許取得によるキャリアアップ",
        description: "准看護師から看護師免許を取得することで年収が大きく上がります。通信教育や夜間課程を活用して取得を目指しましょう。",
        impact: "+50〜120万円",
      });
      break;

    case "pharmacist":
      if (facilityType === "drugstore") {
        advices.push({
          priority: 2,
          title: "調剤薬局・病院薬剤師へのキャリアチェンジ",
          description: "ドラッグストアより調剤薬局・病院薬剤師の方が専門性が高く評価されやすく、年収が高い傾向にあります。",
          impact: "+20〜60万円",
        });
      }
      advices.push({
        priority: 3,
        title: "認定・専門薬剤師資格の取得",
        description: "専門・認定資格を保有することで、薬局や病院での評価が上がりやすくなります。",
        impact: "+10〜30万円",
      });
      break;

    case "pt":
      if (!qualifications.includes("certified_pt") && !qualifications.includes("specialist_pt")) {
        advices.push({
          priority: 2,
          title: "認定・専門理学療法士の取得",
          description: "日本理学療法士協会の認定制度を活用することで、専門性の証明と年収交渉の根拠になります。",
          impact: "+10〜30万円",
        });
      }
      if (facilityType === "clinic" || facilityType === "nursing_home") {
        advices.push({
          priority: 3,
          title: "急性期病院・スポーツクリニックへの転職",
          description: "急性期リハビリや整形外科特化クリニックは比較的高待遇のケースが多く、キャリアアップの機会もあります。",
          impact: "+20〜50万円",
        });
      }
      break;

    case "ot":
      if (!qualifications.includes("certified_ot")) {
        advices.push({
          priority: 2,
          title: "認定・専門作業療法士の取得",
          description: "日本作業療法士協会の認定制度を通じた資格取得で、専門性の証明と待遇改善につながります。",
          impact: "+10〜30万円",
        });
      }
      advices.push({
        priority: 3,
        title: "訪問リハビリ・自費リハビリへの展開",
        description: "訪問リハビリや自費リハビリ分野は単価が高く、副業・独立でも収入向上が見込めます。",
        impact: "+20〜60万円",
      });
      break;

    case "st":
      advices.push({
        priority: 2,
        title: "嚥下・摂食障害の専門スキル強化",
        description: "嚥下障害への対応は需要が高く、専門病院や急性期病院での評価が高まりやすいです。",
        impact: "+15〜40万円",
      });
      if (facilityType === "nursing_home" || facilityType === "clinic") {
        advices.push({
          priority: 3,
          title: "急性期病院・リハビリ専門病院への転職",
          description: "急性期や回復期のリハビリ専門病院はSTのニーズが高く、待遇も良い傾向にあります。",
          impact: "+20〜50万円",
        });
      }
      break;

    case "radiologist":
      advices.push({
        priority: 2,
        title: "専門技師資格の取得（核医学・MRI等）",
        description: "放射線技師の専門分野資格は待遇改善に直結します。特に核医学・MRI安全管理は需要が高いです。",
        impact: "+15〜40万円",
      });
      if (facilityType !== "university_hospital" && facilityType !== "general_hospital") {
        advices.push({
          priority: 3,
          title: "大規模病院への転職",
          description: "大学病院・総合病院は機器が多く専門技師の需要が高いため、より高い待遇を期待できます。",
          impact: "+30〜70万円",
        });
      }
      break;

    case "clinical_lab_tech":
      advices.push({
        priority: 2,
        title: "細胞検査士・専門技師資格の取得",
        description: "細胞検査士や各専門技師資格の保有は希少性が高く、大病院や検査センターでの評価が上がります。",
        impact: "+10〜30万円",
      });
      if (facilityType === "clinic" || facilityType === "nursing_home") {
        advices.push({
          priority: 3,
          title: "検査センター・大規模病院への転職",
          description: "大規模な検査施設では給与水準が高く、技術的な成長機会も豊富です。",
          impact: "+30〜70万円",
        });
      }
      break;

    case "dietitian":
      advices.push({
        priority: 2,
        title: "NST（栄養サポートチーム）専門療法士の取得",
        description: "NST専門療法士は病院での評価が高く、チーム医療の中核として待遇改善につながります。",
        impact: "+10〜25万円",
      });
      if (facilityType === "nursing_home" || facilityType === "other") {
        advices.push({
          priority: 3,
          title: "病院・クリニックへの転職",
          description: "病院勤務の管理栄養士は栄養指導料や給食管理の評価が高く、年収改善の余地があります。",
          impact: "+20〜50万円",
        });
      }
      break;

    case "medical_clerk":
      if (!qualifications.includes("medical_coding")) {
        advices.push({
          priority: 2,
          title: "診療報酬請求事務能力認定の取得",
          description: "業界最難関の医療事務資格であり、取得することで待遇交渉や転職が有利になります。",
          impact: "+10〜30万円",
        });
      }
      advices.push({
        priority: 3,
        title: "医療情報技師・電子カルテ専門職への展開",
        description: "IT×医療知識を活かした専門職はDX需要で急増しており、一般の医療事務より高収入を狙えます。",
        impact: "+30〜80万円",
      });
      break;
  }

  // 共通：役職・雇用形態
  if (position === "staff") {
    advices.push({
      priority: advices.length + 1,
      title: "管理職へのキャリアアップ",
      description: "主任・師長クラスへの昇進で役職手当が加算されます。積極的に管理業務を担い、昇進を目指しましょう。",
      impact: "+40〜100万円",
    });
  }

  if (employmentType === "part_time" || employmentType === "dispatch") {
    advices.push({
      priority: advices.length + 1,
      title: "常勤への切り替えを検討",
      description: "常勤に切り替えることで、ボーナス・各種手当・退職金制度の恩恵を受けられる可能性があります。",
      impact: "+60〜150万円",
    });
  }

  return advices.slice(0, 4);
}

export function formatSalary(amount: number): string {
  return `¥${(amount / 10000).toFixed(0)}万`;
}

export function formatSalaryFull(amount: number): string {
  return amount.toLocaleString("ja-JP", { style: "currency", currency: "JPY" });
}
