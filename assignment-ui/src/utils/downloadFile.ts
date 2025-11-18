// utils/downloadFile.ts
export function downloadFile(fileName: string, content: string = "샘플 파일 내용입니다.") {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
}
