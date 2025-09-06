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

// 配属GPA計算に用いられる講義名とその評定を保管するObject
const compulsoryClasses = {
  "微分積分学基礎Ⅰ": null,
  "微分積分学基礎Ⅱ": null,
  "線形代数基礎": null,
  "力学基礎": null,
  "電磁気学基礎": null,
  "物理化学Ⅰ": null,
  "無機化学Ⅰ": null,
  "有機化学Ⅰ": null,
  // "理工学と現代社会": null, // 配属GPAの計算には含まれない
  "基礎化学物理Ⅰ": null,
  "基礎化学物理Ⅱ": null,
  "物理化学Ⅱ": null,
  "物理化学Ⅲ": null,
  "物理化学Ⅳ": null,
  "分析化学": null,
  "無機化学Ⅱ": null,
  "無機化学Ⅳ": null,
  "有機化学Ⅱ": null,
  "有機化学Ⅲ": null,
  "有機化学Ⅳ": null,
  "有機機器分析": null,
  "化学演習Ⅰ": null,
  "化学演習Ⅱ": null,
  "英語化学文献講読Ⅰ": null,
  "英語化学文献講読Ⅱ": null,
  "化学基礎実験Ⅰ": null,
  "化学基礎実験Ⅱ": null,
  "合成・解析化学実験Ⅰ": null
};

const electiveClasses = {
  "化学結合論": null,
  "熱力学・統計熱力学": null,
  "機器分析": null,
  "固体化学": null,
  "量子化学": null,
  "物性化学": null,
  "反応物理化学": null,
  "地球化学": null,
  "放射化学": null,
  "天然物化学": null,
  "有機反応化学Ⅰ": null,
  "有機反応化学Ⅱ": null
};

const electiveCompulsoryClasses = {
  "生物学基礎": null,
  "基礎生化学": null,
  "基礎分子生物学": null,
  "基礎細胞生物学": null,
  "基礎生体適応学": null,
  "基礎生体機能学": null,
  "基礎生体情報制御学": null
};

// GPA計算に用いるすべての講義名とその評定を保管するMap
const calcClasses = new Map();

// 各科目の単位数を保管するObject
const creditMap = {
  "微分積分学基礎Ⅰ": 2,
  "微分積分学基礎Ⅱ": 2,
  "線形代数基礎": 2,
  "力学基礎": 2,
  "電磁気学基礎": 2,
  "物理化学Ⅰ": 2,
  "無機化学Ⅰ": 2,
  "有機化学Ⅰ": 2,
  // "理工学と現代社会": 2, // 配属GPAの計算には含まれない
  "基礎化学物理Ⅰ": 2,
  "基礎化学物理Ⅱ": 2,
  "物理化学Ⅱ": 2,
  "物理化学Ⅲ": 2,
  "物理化学Ⅳ": 2,
  "分析化学": 2,
  "無機化学Ⅱ": 2,
  "無機化学Ⅳ": 2,
  "有機化学Ⅱ": 2,
  "有機化学Ⅲ": 2,
  "有機化学Ⅳ": 2,
  "有機機器分析": 2,
  "化学演習Ⅰ": 2,
  "化学演習Ⅱ": 2,
  "英語化学文献講読Ⅰ": 2,
  "英語化学文献講読Ⅱ": 2,
  "化学基礎実験Ⅰ": 2,
  "化学基礎実験Ⅱ": 2,
  "合成・解析化学実験Ⅰ": 4,
  "化学結合論": 2,
  "熱力学・統計熱力学": 2,
  "機器分析": 2,
  "固体化学": 2,
  "量子化学": 2,
  "物性化学": 2,
  "反応物理化学": 2,
  "地球化学": 2,
  "放射化学": 2,
  "天然物化学": 2,
  "有機反応化学Ⅰ": 2,
  "有機反応化学Ⅱ": 2,
  "生物学基礎": 2,
  "基礎生化学": 2,
  "基礎分子生物学": 2,
  "基礎細胞生物学": 2,
  "基礎生体適応学": 2,
  "基礎生体機能学": 2,
  "基礎生体情報制御学": 2
};


// webブラウザ上でCSVデータを読み込み、ClassGradeオブジェクトの配列を返す関数
function parseCSVData(csvData) {
  // CSVデータを行ごとに分割
    // shift-jisでエンコードされているので、UTF-8に変換する必要がある（エラーが出ているがやり方がわからない）
	const lines = csvData.split('\n');

  // 基礎化学科の学生かどうかを判定する
    // 2行目に"理学部基礎化学科"が含まれているかどうかで判定する
  if (!lines[1].includes("理学部基礎化学科")) {
    alert("このCSVデータは理学部基礎化学科の学生のものではありません。");
    return []; // 空の配列を返す
  }

  for (let i = 5; i < lines.length; i++) { // 最初から4行とヘッダーはスキップ（nullとして出力されるだけなら別にぶん回してもいいんじゃないか？）
    let line = lines[i].trim();
    if (line === '') continue; // 空行をスキップ
    line = line.replaceAll("\"", ''); // 「"」を削除
    // CSVの各行をカンマで分割して必要なフィールドを抽出
    let splitLine = line.split(',');
    let courseTitle = splitLine[4];
    let grade = convertGradeToNumber(splitLine[splitLine.length -3]); // カンマが最後に含まれているから，最後から2番目の要素でも3を指定しないといけない

    // 計算に必要な科目
    if (courseTitle in compulsoryClasses) {
      // 今保存されているものより高い評定なら更新する
      if (compulsoryClasses[courseTitle] < grade) {
        compulsoryClasses[courseTitle] = grade;
      } 
    } else if (courseTitle in electiveClasses) {
      // 今保存されているものより高い評定なら更新する
      if (electiveClasses[courseTitle] < grade) {
        electiveClasses[courseTitle] = grade;
      } 
    } else if (courseTitle in electiveCompulsoryClasses) {
      // 今保存されているものより高い評定なら更新する
      if (electiveCompulsoryClasses[courseTitle] < grade) {
        electiveCompulsoryClasses[courseTitle] = grade;
      }
    } else {
      continue; // その他の配属GPAの計算に不要な科目はスキップ
    }
  }
}

// electiveClassesのうち評定が0より大きい科目が4科目以上であるなら，その超えた分の科目数を返す関数
function countExtraElectiveClasses() {
  let count = 0;
  for (let grade of Object.values(electiveClasses)) {
    if (grade > 0) {
      count++;
    }
  }
  return Math.max(0, count - 4); // 4科目を超えた分の科目数を返す
}

// electiveClassesから科目数を勘定して上位4科目を取得する関数
function TopElectiveClasses() {
  // electiveClassesを評定の高い順にソートして上位4科目を選ぶ
  let sortedElectiveClasses = Object.entries(electiveClasses)
    .sort((a, b) => b[1] - a[1]) // 評定の高い順にソート
    .slice(0, 4); // 上位4科目を取得
  return sortedElectiveClasses;
}

// electiveCompulsoryClassesから上位1科目を取得する関数
function TopElectiveCompulsoryClass() {
  // electiveCompulsoryClassesを評定の高い順にソートして上位1科目を選ぶ
  let sortedElectiveCompulsoryClasses = Object.entries(electiveCompulsoryClasses)
    .sort((a, b) => b[1] - a[1]) // 評定の高い順にソート
    .slice(0, 1); // 上位1科目を取得
  return sortedElectiveCompulsoryClasses;
}

// electiveClassesの上位4科目とelectiveCompulsoryClassesの上位1科目をcalcClassesに追加する関数
function addTopElectiveAndCompulsoryClasses() {
  const topElectiveClasses = TopElectiveClasses();
  const topElectiveCompulsoryClass = TopElectiveCompulsoryClass();
  // 選ばれた科目をcalcClassesに追加する
  for (const [courseTitle, grade] of topElectiveClasses) {
    calcClasses[courseTitle] = grade;
  }
  for (const [courseTitle, grade] of topElectiveCompulsoryClass) {
    calcClasses[courseTitle] = grade;
  }
}

// 配属GPAを計算する関数
  // GPA = (必修科目の評定と単位数の積の総和 + 選択科目上位4科目の評定と単位数の積の総和(4科目に満たないときは0埋めする) + 選択必修科目上位1科目の評定と単位数の積 + 選択科目のうち4科目を超えた分の科目数) / (必修科目・選択科目・選択必修科目の単位数の総和)
function calculateGPA() {
  // compulsoryClassesのすべての科目をcalcClassesに追加する
  for (const key in compulsoryClasses) {
    calcClasses[key] = compulsoryClasses[key];
  }

  // electiveClassesのうち評定が高い上位4科目とelectiveCompulsoryClassesのうち評定が高い上位1科目をcalcClassesに追加する
  addTopElectiveAndCompulsoryClasses();

  // calcClassesから各科目の評定の総和を計算する
  let totalGrade = 0.0;
  let totalCredits = 0;
  for (let [courseTitle, grade] of Object.entries(calcClasses)) {
    let credits = creditMap[courseTitle] || 0; // creditMapに科目がない場合は0単位とする（ありえないはずだが）
    totalGrade += grade * credits;
    totalCredits += credits;
  }
  // electiveClassesのうち4科目を超えた分の科目数を加算する
  totalGrade += countExtraElectiveClasses();
  // GPAを計算する
  const gpa = totalCredits > 0 ? totalGrade / totalCredits : 0.0;
  console.log(totalGrade, "/", totalCredits, "=", gpa); // デバッグ用
  return gpa.toFixed(3); // 小数点以下2桁に丸めて
}

// Shift-JISをUTF-8に変換する関数
function convertShiftJISToUTF8(shiftJISArrayBuffer) {
  const uint8Array = new Uint8Array(shiftJISArrayBuffer);
  const utf8Array = Encoding.convert(uint8Array, { to: 'UNICODE', from: 'SJIS' });
  const utf8String = Encoding.codeToString(utf8Array);
  return utf8String;
}

// 必修科目の履修率とGPA小計を計算する関数
function calculateCompulsoryInfo() {
  // 必修科目の履修状況を集計
  let totalClasses = 0;
  let completedClasses = 0;
  let completedCredits = 0;
  let totalGradePoints = 0.0;
  for (const [courseTitle, grade] of Object.entries(compulsoryClasses)) {
    totalClasses++;
    let credits = creditMap[courseTitle] || 0;
    if (grade !== null) {
      completedClasses++;
      completedCredits += credits;
      totalGradePoints += grade * credits;
    }
  }

  // 必修科目の履修率を計算
  const completionRate = completedClasses > 0 ? (completedClasses / totalClasses) * 100 : 0;

  // 必修科目のGPA小計を計算
  const gpaSubtotal = completedCredits > 0 ? totalGradePoints / completedCredits : 0;

  // 表に結果を反映
  const compulsoryInfo = document.getElementById("compulsoryInfo");
  const compulsoryGPA = document.getElementById("compulsoryGPA");
  compulsoryInfo.textContent = `${completionRate.toFixed(1)}%  (${completedClasses} / ${totalClasses})`;
  compulsoryGPA.textContent = gpaSubtotal.toFixed(3);

  // 履修済み科目GPA計算用データを出力
  return [completedCredits, totalGradePoints];
}

// 選択科目の履修率とGPA小計を計算して表示する関数
function calculateElectiveInfo() {
  // 選択科目の履修状況を集計
  const topElectiveClasses = TopElectiveClasses(); // 評定の高い上位4科目を取得
  const totalClasses = topElectiveClasses.length; // 実際に取得した科目数を使用
  let completedClasses = 0;
  let completedCredits = 0;
  let totalGradePoints = 0.0;
  for (const [courseTitle, grade] of topElectiveClasses) {
    let credits = creditMap[courseTitle] || 0;
    if (grade !== null) {
      completedClasses++;
      completedCredits += credits;
      totalGradePoints += grade * credits;
    }
  }

  // 選択科目の履修率を計算
  const completionRate = completedClasses > 0 ? (completedClasses / totalClasses) * 100 : 0;

  // 選択科目のGPA小計を計算
  const gpaSubtotal = completedCredits > 0 ? totalGradePoints / completedCredits : 0;

  // 表に結果を反映
  const electiveInfo = document.getElementById("electiveInfo");
  const electiveGPA = document.getElementById("electiveGPA");
  electiveInfo.textContent = `${completionRate.toFixed(1)}%  (${completedClasses} / ${totalClasses})`;
  electiveGPA.textContent = gpaSubtotal.toFixed(3);

  // 履修済み科目GPA計算用データを出力
  return [completedCredits, totalGradePoints];
}

// 選択必修科目の履修率とGPA小計を計算して表示する関数
function calculateElectiveCompulsoryInfo() {
  // 選択必修科目の履修状況を集計
  const topElectiveCompulsoryClass = TopElectiveCompulsoryClass(); // 評定の高い上位1科目を取得
  const totalClasses = topElectiveCompulsoryClass.length;
  let completedClasses = 0;
  let completedCredits = 0;
  let totalGradePoints = 0.0;
  for (const [courseTitle, grade] of topElectiveCompulsoryClass) {
    let credits = creditMap[courseTitle] || 0;
    if (grade !== null) {
      completedClasses++;
      completedCredits += credits;
      totalGradePoints += grade * credits;
    }
  }

  // 選択必修科目の履修率を計算
  const completionRate = completedClasses > 0 ? (completedClasses / totalClasses) * 100 : 0;

  // 選択必修科目のGPA小計を計算
  const gpaSubtotal = completedCredits > 0 ? totalGradePoints / completedCredits : 0;

  // 表に結果を反映
  const electiveCompulsoryInfo = document.getElementById("electiveCompulsoryInfo");
  const electiveCompulsoryGPA = document.getElementById("electiveCompulsoryGPA");
  electiveCompulsoryInfo.textContent = `${completionRate.toFixed(1)}%  (${completedClasses} / ${totalClasses})`;
  electiveCompulsoryGPA.textContent = gpaSubtotal.toFixed(3);

  // 履修済み科目GPA計算用データを出力
  return [completedCredits, totalGradePoints];
}

// 各科目の表を作成する関数
function createSubjectTables() {
    const table = document.getElementById("tableBody");
  table.innerHTML = ""; // 既存の内容をクリア

  // 表に追加するObjectの配列
  const displayArray = [compulsoryClasses, electiveClasses, electiveCompulsoryClasses];
  // 表の左に付ける色のためのクラス名の配列
  const classNames = ["compulsory", "elective", "elective-compulsory"];

  for (let i = 0; i < displayArray.length; i++) {
    const classObject = displayArray[i];
    for (const [courseTitle, grade] of Object.entries(classObject)) {
      const row = document.createElement("tr");
      const titleCell = document.createElement("td");
      const creditCell = document.createElement("td");
      const gradeCell = document.createElement("td");

      titleCell.textContent = courseTitle;
      creditCell.textContent = creditMap[courseTitle] || "N/A";
      gradeCell.textContent = grade === null ? "-" : grade.toString();

      // 評定がnullの場合は3つのtd要素に.empty-gpクラスを追加
      if (grade === null) {
        titleCell.classList.add("empty-gp");
        creditCell.classList.add("empty-gp");
        gradeCell.classList.add("empty-gp");
      }

      // titleCellにclassNames[i]を追加
      titleCell.classList.add(classNames[i]);
  
      row.appendChild(titleCell);
      row.appendChild(creditCell);
      row.appendChild(gradeCell);
      table.appendChild(row);
    }
  }
}

// 履修科目の表を作成する関数
function createTable() {
  // 履修率とGPA小計を計算して表示
  const [compulsoryCompletedCredits, compulsoryTotalGradePoints] = calculateCompulsoryInfo();
  const [electiveCompletedCredits, electiveTotalGradePoints] = calculateElectiveInfo();
  const [electiveCompulsoryCompletedCredits, electiveCompulsoryTotalGradePoints] = calculateElectiveCompulsoryInfo();

  // 履修済み科目GPAを計算して表示
  const totalCompletedCredits = compulsoryCompletedCredits + electiveCompletedCredits + electiveCompulsoryCompletedCredits;
  let CompletedGPA = 0.0;
  if (totalCompletedCredits > 0) {
    CompletedGPA = (compulsoryTotalGradePoints + electiveTotalGradePoints + electiveCompulsoryTotalGradePoints) / totalCompletedCredits;
  }
  document.getElementById('completedGPA').innerHTML = `履修済み科目GPA: ${CompletedGPA.toFixed(3)}`;

  // 各科目の表を作成
  createSubjectTables();
}

// グローバル変数を初期化する
function initializeGlobals() {
  for (const key in compulsoryClasses) {
    compulsoryClasses[key] = null;
  }
  for (const key in electiveClasses) {
    electiveClasses[key] = null;
  }
  for (const key in electiveCompulsoryClasses) {
    electiveCompulsoryClasses[key] = null;
  }
  calcClasses.clear();
}

// Calculate GPAボタンがクリックされたときの処理
document.getElementById('calcButton').addEventListener('click', () => {
  initializeGlobals(); // グローバル変数を初期化

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  if (!file) {
    alert("CSVファイルを選択してください。");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    let csvData = e.target.result;
    csvData = convertShiftJISToUTF8(csvData); // Shift-JISをUTF-8に変換
    parseCSVData(csvData);
    const gpa = calculateGPA();
    document.getElementById('result').innerText = `配属GPA: ${gpa}`;
    createTable(); // テーブルを作成
  };
  reader.readAsArrayBuffer(file);
});