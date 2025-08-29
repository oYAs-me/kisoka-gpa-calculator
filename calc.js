// import createTable from "./table.js";

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


// 配属GPA計算に用いられる講義名とその評定を保管するMap
const compulsoryClasses = {
  "微分積分学基礎Ⅰ": 0.0,
  "微分積分学基礎Ⅱ": 0.0,
  "線形代数基礎": 0.0,
  "力学基礎": 0.0,
  "電磁気学基礎": 0.0,
  "物理化学Ⅰ": 0.0,
  "無機化学Ⅰ": 0.0,
  "有機化学Ⅰ": 0.0,
  "理工学と現代社会": 0.0,
  "基礎化学物理Ⅰ": 0.0,
  "基礎化学物理Ⅱ": 0.0,
  "物理化学Ⅱ": 0.0,
  "物理化学Ⅲ": 0.0,
  "物理化学Ⅳ": 0.0,
  "分析化学": 0.0,
  "無機化学Ⅱ": 0.0,
  "無機化学Ⅳ": 0.0,
  "有機化学Ⅱ": 0.0,
  "有機化学Ⅲ": 0.0,
  "有機化学Ⅳ": 0.0,
  "有機機器分析": 0.0,
  "化学演習Ⅰ": 0.0,
  "化学演習Ⅱ": 0.0,
  "英語化学文献講読Ⅰ": 0.0,
  "英語化学文献講読Ⅱ": 0.0,
  "化学基礎実験Ⅰ": 0.0,
  "化学基礎実験Ⅱ": 0.0,
  "合成・解析化学実験Ⅰ": 0.0
};

const electiveClasses = {
  "化学結合論": 0.0,
  "熱力学・統計熱力学": 0.0,
  "機器分析": 0.0,
  "固体化学": 0.0,
  "量子化学": 0.0,
  "物性化学": 0.0,
  "反応物理化学": 0.0,
  "地球化学": 0.0,
  "放射化学": 0.0,
  "天然物化学": 0.0,
  "有機反応化学Ⅰ": 0.0,
  "有機反応化学Ⅱ": 0.0
};

const electiveCompulsoryClasses = {
  "生物学基礎": 0.0,
  "基礎生化学": 0.0,
  "基礎分子生物学": 0.0,
  "基礎細胞生物学": 0.0,
  "基礎生体適応学": 0.0,
  "基礎生体機能学": 0.0,
  "基礎生体情報制御学": 0.0
};

// 各科目の単位数を保管するMap
const creditMap = {
  "微分積分学基礎Ⅰ": 2,
  "微分積分学基礎Ⅱ": 2,
  "線形代数基礎": 2,
  "力学基礎": 2,
  "電磁気学基礎": 2,
  "物理化学Ⅰ": 2,
  "無機化学Ⅰ": 2,
  "有機化学Ⅰ": 2,
  "理工学と現代社会": 2,
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
    // console.log(line); // デバッグ用
    // CSVの各行をカンマで分割して必要なフィールドを抽出
    let splitLine = line.split(',');
    let mainClassification = splitLine[1];
    let tertiaryClassification = splitLine[3];

    // 計算に必要な科目
    if (mainClassification === "理学部専門科目") {
      // 理学部専門科目以外はスキップ
      // 科目名と評定は必要になってから取得する
      let courseTitle = splitLine[4];
      let gradeStr = splitLine[10];
      if (tertiaryClassification === "理工必修科目" || tertiaryClassification === "基礎化学必修科目") {
        // 必修科目の評定をcompulsoryClassesに保存する
        if (courseTitle in compulsoryClasses) {
          let grade = convertGradeToNumber(gradeStr);
          // 今保存されているものより高い評定なら更新する
          if (compulsoryClasses[courseTitle] < grade) {
            compulsoryClasses[courseTitle] = grade;
          }
        }
      } else if (tertiaryClassification === "基礎化学選択科目") {
        // 選択科目の評定をelectiveClassesに保存する
        if (courseTitle in electiveClasses) {
          let grade = convertGradeToNumber(gradeStr);
          // 今保存されているものより高い評定なら更新する
          if (electiveClasses[courseTitle] < grade) {
            electiveClasses[courseTitle] = grade;
          }
        }
      } else if (tertiaryClassification === "理工選択必修科目") {
        // 選択必修科目の評定をelectiveCompulsoryClassesに保存する
        if (courseTitle in electiveCompulsoryClasses) {
          let grade = convertGradeToNumber(gradeStr);
          // 今保存されているものより高い評定なら更新する
          if (electiveCompulsoryClasses[courseTitle] < grade) {
            electiveCompulsoryClasses[courseTitle] = grade;
          }
        }
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

// electiveClassesから科目数を勘定して上位4科目をcompulsoryClassesに追加する関数
function addTopElectiveClasses() {
  // electiveClassesを評定の高い順にソートして上位4科目を選ぶ
  let sortedElectiveClasses = Object.entries(electiveClasses)
    .sort((a, b) => b[1] - a[1]) // 評定の高い順にソート
    .slice(0, 4); // 上位4科目を取得

  // 選ばれた科目をcompulsoryClassesに追加する
  // 4科目に満たない場合は0埋めされるので、そのまま追加しても問題ない
  for (let [courseTitle, grade] of sortedElectiveClasses) {
    compulsoryClasses[courseTitle] = grade;
    console.log(`Added elective class: ${courseTitle} with grade ${grade}`); // デバッグ用
  }
}

// electiveCompulsoryClassesから上位1科目をcompulsoryClassesに追加する関数
function addTopElectiveCompulsoryClass() {
  // electiveCompulsoryClassesを評定の高い順にソートして上位1科目を選ぶ
  let sortedElectiveCompulsoryClasses = Object.entries(electiveCompulsoryClasses)
    .sort((a, b) => b[1] - a[1]) // 評定の高い順にソート
    .slice(0, 1); // 上位1科目を取得

  // 選ばれた科目をcompulsoryClassesに追加する
  for (let [courseTitle, grade] of sortedElectiveCompulsoryClasses) {
    compulsoryClasses[courseTitle] = grade;
    console.log(`Added elective compulsory class: ${courseTitle} with grade ${grade}`); // デバッグ用
  }
}


// 配属GPAを計算する関数
  // GPA = (必修科目の評定と単位数の積の総和 + 選択科目上位4科目の評定と単位数の積の総和(4科目に満たないときは0埋めする) + 選択必修科目上位1科目の評定と単位数の積 + 選択科目のうち4科目を超えた分の科目数) / (必修科目・選択科目・選択必修科目の単位数の総和)
function calculateGPA() {
  // electiveClassesから上位4科目をcompulsoryClassesに追加する
  addTopElectiveClasses();

  // electiveCompulsoryClassesから上位1科目をcompulsoryClassesに追加する
  addTopElectiveCompulsoryClass();

  // 各科目の評定の総和を計算する
  let totalGrade = 0.0;
  let totalCredits = 0;
  for (let [courseTitle, grade] of Object.entries(compulsoryClasses)) {
    let credits = creditMap[courseTitle] || 0; // creditMapに科目がない場合は0単位とする（ありえないはずだが）
    totalGrade += grade * credits;
    totalCredits += credits;
  }
  // electiveClassesのうち4科目を超えた分の科目数を加算する
  totalGrade += countExtraElectiveClasses();
  // GPAを計算する
  let gpa = totalCredits > 0 ? totalGrade / totalCredits : 0.0;
  console.log(totalCredits, totalGrade);
  return gpa.toFixed(3); // 小数点以下2桁に丸めて
}

// Shift-JISをUTF-8に変換する関数
function convertShiftJISToUTF8(shiftJISArrayBuffer) {
  const uint8Array = new Uint8Array(shiftJISArrayBuffer);
  // console.log(uint8Array);
  const utf8Array = Encoding.convert(uint8Array, { to: 'UNICODE', from: 'SJIS' });
  const utf8String = Encoding.codeToString(utf8Array);
  return utf8String;
}

// 履修科目の表を作成する関数
function createTable(compulsoryClasses) {
  const table = document.getElementById("tableBody");
  table.innerHTML = ""; // 既存の内容をクリア

  for (const [courseTitle, grade] of Object.entries(compulsoryClasses)) {
    const row = document.createElement("tr");
    const titleCell = document.createElement("td");
    const creditCell = document.createElement("td");
    const gradeCell = document.createElement("td");

    titleCell.textContent = courseTitle;
    creditCell.textContent = creditMap[courseTitle] || "N/A";
    gradeCell.textContent = grade.toString();
  
    row.appendChild(titleCell);
    row.appendChild(creditCell);
    row.appendChild(gradeCell);
    table.appendChild(row);
  }
}

// Calculate GPAボタンがクリックされたときの処理
document.getElementById('calcButton').addEventListener('click', () => {
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
    // console.log(csvData); // CSVデータをコンソールに出力（デバッグ用）
    parseCSVData(csvData);
    const gpa = calculateGPA();
    document.getElementById('result').innerText = `配属GPA: ${gpa}`;
    console.log(compulsoryClasses);
    createTable(compulsoryClasses); // テーブルを作成
  };
  reader.readAsArrayBuffer(file);
});