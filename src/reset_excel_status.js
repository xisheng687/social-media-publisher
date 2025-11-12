// reset_excel_status.js
// 重置Excel中的状态，以便重新排期

const XLSX = require('xlsx');
const fs = require('fs');

const EXCEL_FILE = '贴文发布.xlsx';

console.log('🔄 重置Excel状态...\n');

// 1. 读取Excel
const workbook = XLSX.readFile(EXCEL_FILE);
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// 2. 重置状态
const resetData = data.map(row => ({
    标题: row.标题,
    状态: '准备好',  // 重置为"准备好"
    贴文内容: row.贴文内容
    // 删除视频url、发布时间、处理时间等字段
}));

console.log(`📝 重置 ${resetData.length} 条记录的状态为"准备好"\n`);

// 3. 写回Excel
const newWorksheet = XLSX.utils.json_to_sheet(resetData);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, EXCEL_FILE);

console.log('✅ Excel状态已重置！');
console.log('\n现在可以运行: node process_excel_posts.js');
