import type { DiagnosisAnswers, DiagnosisResult, Advice } from "./types";
import { getSalaryData } from "./salary-data";

export function calcDiagnosisResult(answers: DiagnosisAnswers): DiagnosisResult | null {
  const { profession, facilityType, region, experience, employmentType, position, currentSalary } =
    answers;

  if (
    !profession ||
    !facilityType ||
    !region ||
    !experience ||
    !employmentType ||
    !position
  ) {
    return null;
  }

  const salaryData = getSalaryData(
    profession,
    experience,
    region,
    facilityType,
    employmentType,
    position
  );

  const salary = currentSalary ?? salaryData.medianSalary;
  const difference = salary - salaryData.medianSalary;
  const ratio = difference / salaryData.medianSalary;

  let evaluation: DiagnosisResult["evaluation"];
  if (ratio > 0.05) evaluation = "above";
  else if (ratio < -0.05) evaluation = "below";
  else evaluation = "average";

  const advices = generateAdvices(answers, evaluation);

  return { answers, salaryData, evaluation, difference, advices };
}

function generateAdvices(
  answers: DiagnosisAnswers,
  evaluation: DiagnosisResult["evaluation"]
): Advice[] {
  const advices: Advice[] = [];
  const { profession, position, qualifications, facilityType, employmentType } = answers;

  if (evaluation === "below") {
    advices.push({
      priority: 1,
      title: "転職で即時改善の可能性あり",
      description:
        "現在の年収は同条件の市場相場より低い傾向にあります。医療特化型の転職エージェントへの相談で、より好条件の求人が見つかるケースが多くあります。",
      impact: "+50〜150万円",
    });
  }

  if (profession === "nurse") {
    if (!qualifications.includes("certified_nurse") && !qualifications.includes("specialist_nurse")) {
      advices.push({
        priority: 2,
        title: "認定看護師・専門看護師の取得",
        description:
          "専門資格を取得することで手当が付き、年収アップにつながります。認定看護師は+20〜50万円、専門看護師は+30〜80万円の加算が見込まれます。",
        impact: "+20〜80万円",
      });
    }
    if (facilityType === "clinic" || facilityType === "nursing_home") {
      advices.push({
        priority: 3,
        title: "病院勤務への転職",
        description:
          "クリニック・施設より大規模病院の方が夜勤手当・各種手当が充実しており、年収差が生じやすいです。",
        impact: "+30〜80万円",
      });
    }
  }

  if (profession === "pharmacist") {
    if (facilityType === "drugstore") {
      advices.push({
        priority: 2,
        title: "調剤薬局・病院薬剤師へのキャリアチェンジ",
        description:
          "ドラッグストアより調剤薬局・病院薬剤師の方が専門性が高く評価されやすく、年収が高い傾向にあります。",
        impact: "+20〜60万円",
      });
    }
    advices.push({
      priority: 3,
      title: "認定薬剤師資格の取得",
      description: "専門・認定資格を保有することで、薬局や病院での評価が上がりやすくなります。",
      impact: "+10〜30万円",
    });
  }

  if (profession === "pt") {
    if (!qualifications.includes("certified_pt") && !qualifications.includes("specialist_pt")) {
      advices.push({
        priority: 2,
        title: "認定・専門理学療法士の取得",
        description:
          "日本理学療法士協会の認定制度を活用することで、専門性の証明と年収交渉の根拠になります。",
        impact: "+10〜30万円",
      });
    }
    if (facilityType === "clinic" || facilityType === "nursing_home") {
      advices.push({
        priority: 3,
        title: "急性期病院・スポーツクリニックへの転職",
        description:
          "急性期リハビリや整形外科特化クリニックは比較的高待遇のケースが多く、キャリアアップの機会もあります。",
        impact: "+20〜50万円",
      });
    }
  }

  if (position === "staff") {
    advices.push({
      priority: advices.length + 1,
      title: "管理職へのキャリアアップ",
      description:
        "主任・師長クラスへの昇進で役職手当が加算されます。積極的に管理業務を担い、昇進を目指しましょう。",
      impact: "+40〜100万円",
    });
  }

  if (employmentType === "part_time" || employmentType === "dispatch") {
    advices.push({
      priority: advices.length + 1,
      title: "常勤への切り替えを検討",
      description:
        "常勤に切り替えることで、ボーナス・各種手当・退職金制度の恩恵を受けられる可能性があります。",
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
