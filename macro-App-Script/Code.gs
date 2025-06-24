

function doPost(e) {
  var SECRET_KEY = "Secret_Key_Anda";
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.key !== SECRET_KEY) {
      throw new Error("Akses ditolak: Kunci tidak valid.");
    }
    if (!data.name || data.score === undefined) {
      throw new Error("Parameter 'name' atau 'score' tidak ditemukan.");
    }
    var name = data.name;
    var score = data.score;
    var sheetName = "Skor";
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow(["Timestamp", "Nama Pemain", "Skor Tertinggi"]);
    }
    sheet.appendRow([new Date(), name, score]);
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheetName = "Skor";
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet '" + sheetName + "' tidak ditemukan.");
    }
    var data = sheet.getDataRange().getValues();
    var scoresData = data.slice(1);
    var highScores = {};
    scoresData.forEach(function(row) {
      var name = row[1];
      var score = row[2];
      if (name && typeof score === 'number') {
        if (!highScores[name] || score > highScores[name]) {
          highScores[name] = score;
        }
      }
    });
    var uniqueLeaderboard = Object.keys(highScores).map(function(name) {
      return {
        name: name,
        score: highScores[name]
      };
    });
    uniqueLeaderboard.sort(function(a, b) {
      return b.score - a.score;
    });
    var top10 = uniqueLeaderboard.slice(0, 10);
    return ContentService
      .createTextOutput(JSON.stringify(top10))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function resetSkorHarian() {
  var sheetName = "Skor"; 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    console.log("Data skor harian telah direset.");
  } else {
    console.log("Tidak ada data skor untuk direset.");
  }
}
