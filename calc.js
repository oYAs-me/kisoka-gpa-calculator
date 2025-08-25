// 評定を数値に変換する関数
function convertGradeToNumber(grade) {
  const gradeMap = {
    'S': 4.0,
    'A+': 3.5,
    'A': 3.0,
    'B+': 2.5,
    'B': 2.0,
    'C+': 1.5,
    'C': 1.0,
    'D': 0.0,
    'F': 0.0,
  };
  return gradeMap[grade] || 0.0; // 評定がマップにない場合は0.0を返す
}

// class ClassGradeを定義
class ClassGrade {
  constructor(courseTitle, classCode, credit, year, semester, gradeStr) {
    this.courseTitle = courseTitle;
    this.classCode = classCode;
    this.credit = credit; // ここは単位数
    this.year = year;
    this.semester = semester;
    this.grade = convertGradeToNumber(gradeStr); 呼び出すときは評定を数値に変換する
  }
}

// 配属GPA計算に用いられる講義名と時間割コードのリスト
const compulsoryClasses = {
  // 理工系基礎教育科目	理工必修科目
  "RT1011": "微分積分学基礎Ⅰ",
  "RT1022": "微分積分学基礎Ⅱ",
  "RT1092": "線形代数基礎",
  "RT2011": "力学基礎",
  "RT2031": "電磁気学基礎",
  "RT3021": "物理化学Ⅰ",
  "RT3031": "無機化学Ⅰ",
  "RT3041": "有機化学Ⅰ",
  "RT9011": "理工学と現代社会",
  // 基礎化学科目	基礎化学必修科目
  "R13002": "基礎化学物理Ⅰ",
  "R13006": "基礎化学物理Ⅱ",
  "R13026": "物理化学Ⅱ",
  "R13037": "物理化学Ⅲ",
  "R13048": "物理化学Ⅳ",
  "R13059": "分析化学",
  "R13094": "無機化学Ⅱ",
  // 無機化学Ⅲは3年次後期のため除外
  "R13070": "無機化学Ⅳ",
  "R13116": "有機化学Ⅱ",
  "R13127": "有機化学Ⅲ",
  "R13138": "有機化学Ⅳ",
  "R13263": "有機機器分析",
  "R13156": "化学演習Ⅰ",
  "R13157": "化学演習Ⅱ",
  "R13140": "英語化学文献講読Ⅰ",
  "R13151": "英語化学文献講読Ⅱ",
  "R13533": "化学基礎実験Ⅰ",
  "R13544": "化学基礎実験Ⅱ",
  "R13555": "合成・解析化学実験Ⅰ",
  // 合成・解析化学実験Ⅱは3年次後期のため除外
};
const electiveClasses = {
  // 基礎化学科目 基礎化学選択科目
  "R13162": "化学結合論",
  "R13180": "熱力学・統計熱力学",
  "R13083": "機器分析",
  "R13198": "固体化学",
  "R13184": "量子化学",
  "R13285": "物性化学",
  "R13343": "反応物理化学",
  "R13353": "地球化学",
  "R13354": "放射化学",
  "R13307": "天然物化学",
  "R13318": "有機反応化学Ⅰ",
  "R13320": "有機反応化学Ⅱ",
  // 現代の化学は配属GPA計算から除外されている
};
const electiveCompulsoryClasses = {
  // 理工系基礎教育科目 理工選択必修科目 （この中から1科目）
  "RT4012": "生物学基礎",
  "RT4021": "基礎生化学",
  "RT4031": "基礎分子生物学",
  "RT4041": "基礎細胞生物学",
  "RT4051": "基礎生体適応学",
  "RT4061": "基礎生体機能学",
  "RT4071": "基礎生体情報制御学",
};


// webブラウザ上でCSVデータを読み込み、ClassGradeオブジェクトの配列を返す関数
////////////////////////////////////////////////////
// CoPilotに作らせたので手直しが必要かもしれない！   //
////////////////////////////////////////////////////
function parseCSVData(csvData) {
  const lines = csvData.split('\n');
  const classGrades = []; // 配属GPAに算入するClassGradeオブジェクトを格納する配列
  const electiveClassesGrades = []; // 履修したすべての選択科目を一時保存しておく配列
  const electiveCompulsoryClassGlades = []; // 履修したすべての選択必修科目を一時保存しておく配列

  // 基礎化学科の学生かどうかを判定する
  if (!lines[1].includes("理学部基礎化学科")) { // 2行目に学部・学科情報が含まれていると決めつけているから将来的に動作しない可能性がある
    alert("このCSVデータは理学部基礎化学科の学生のものではありません。");
    return classGrades; // 空の配列を返す
  }

  for (let i = 5; i < lines.length; i++) { // 最初から4行とヘッダーはスキップ（nullとして出力されるだけなら別にぶん回してもいいんじゃないか？）
    const line = lines[i].trim();
    if (line === '') continue; // 空行をスキップ

    // CSVの各行をカンマで分割して必要なフィールドを抽出
    const [mainClassification, del1, tertiaryClassification, del3, courseTitle, classCode, del4, credit, year, semester, gradeStr] = line.split(',');

    // 計算に必要な科目
    if (mainClassification === "理学部専門科目") {
      // 理学部専門科目以外はスキップ
      if (tertiaryClassification === "理工必修科目" || tertiaryClassification === "基礎化学必修科目") {
        // 算入されない科目があるからcompulsoryClassesから比較して，classGradesに追加
        if (classCode in compulsoryClasses) {
          let newClass = new ClassGrade(courseTitle, classCode, parseFloat(credit), parseInt(year), parseInt(semester[0]), gradeStr);
          classGrades.push(newClass); 
        } else {
          continue; // 配属GPAの計算に入らない必修科目はスキップ
        }
      } else if (tertiaryClassification === "基礎化学選択科目") {
        // 算入されない科目があるからelectiveClassesから比較して，classGradesに追加
        if (classCode in electiveClasses) {
          let newClass = new ClassGrade(courseTitle, classCode, parseFloat(credit), parseInt(year), parseInt(semester[0]), gradeStr);
          electiveclassGrades.push(newClass);
        } else {
          continue; // 配属GPAの計算に入らない選択科目はスキップ
        }
      } else if (tertiaryClassification === "理工選択必修科目") {
        // 算入されない科目があるからelectiveCompulsoryClassesから比較して，electiveCompulsoryclassGradesに追加
        if (classCode in electiveCompulsoryClasses) {
          let newClass = new ClassGrade(courseTitle, classCode, parseFloat(credit), parseInt(year), parseInt(semester[0]), gradeStr);
          electiveCompulsoryclassGrades.push(newClass);
        } else {
          continue; // 配属GPAの計算に入らない選択必修科目はスキップ
        }
      }
    } else {
      continue; // その他の配属GPAの計算に不要な科目はスキップ
    }
  }
  ClassGrade.push(electiveCompulsoryClassGlades);
  return classGrades;
}

// electiveClassesから科目数を勘定して4科目までclassGradesに追加し足りなかったらそれを記録しておく関数


// electiveCompulsoryClassesから1科目選んでclassGradesに追加する関数


// 配属GPAを計算する関数
function calculateGPA(classGrades) {
  let totalCredits = 0;
  let totalPoints = 0;

  // 各科目の単位数と評定を用いて単位数と評定の積を計算
  classGrades.forEach(cls => {
    totalCredits += cls.credit;
    totalPoints += cls.credit * cls.grade;
  });

  // ここで選択科目の不足分や過剰分を補う処理を行う．

  // GPAを計算するが，TotalCreditsが0の場合はGPAも0とする
  if (totalCredits === 0) return "0.00";
  // 一方でTotalCreditsは固定して計算すべきかもしれない（単位数は固定されている）
  const gpa = totalPoints / totalCredits;
  return gpa.toFixed(2); // 小数点以下2桁に丸める
}
