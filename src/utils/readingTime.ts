const CJK_PATTERN =
  /[\u2e80-\u2eff\u2f00-\u2fdf\u3000-\u303f\u31c0-\u31ef\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const WORD_PATTERN = /[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g;

export type ReadingTime = {
  minutes: number;
  label: string;
};

export default function getReadingTime(markdown = ""): ReadingTime {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ");

  const cjkCount = prose.match(CJK_PATTERN)?.length ?? 0;
  const latinWordCount =
    prose.replace(CJK_PATTERN, " ").match(WORD_PATTERN)?.length ?? 0;

  const minutes = Math.max(1, Math.ceil(cjkCount / 420 + latinWordCount / 230));

  return {
    minutes,
    label: `约 ${minutes} 分钟`,
  };
}
